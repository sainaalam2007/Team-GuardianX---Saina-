import uuid
from datetime import datetime
from app.models.schemas import SensorTelemetry, DigitalTwinState, Alert, SOSSnapshot
from app.services.store import store

# Thresholds
ACCIDENT_ACCEL_THRESHOLD = 5.0 # g-force roughly
DROWSINESS_HR_THRESHOLD_LOW = 50
ALCOHOL_PPM_THRESHOLD = 200
BLIND_SPOT_DISTANCE_CM = 150
AQI_WARNING_THRESHOLD = 150

def process_telemetry(telemetry: SensorTelemetry):
    rider_id = telemetry.rider_id
    helmet_id = telemetry.helmet_id
    
    # 1. Update or create DigitalTwinState
    twin = store.get_twin(rider_id)
    if not twin:
        twin = DigitalTwinState(
            rider_id=rider_id,
            helmet_id=helmet_id,
            last_updated=telemetry.timestamp,
            current_location=telemetry.gps_location,
            current_speed=telemetry.speed,
            health_status="optimal",
            fatigue_score=0.0,
            alcohol_detected=False,
            active_alerts=[]
        )
    
    twin.last_updated = telemetry.timestamp
    twin.current_location = telemetry.gps_location
    twin.current_speed = telemetry.speed
    
    active_alerts = []
    
    # 2. Rule: Accident Detection (Sudden Deceleration / Impact)
    accel = telemetry.accelerometer
    accel_mag = (accel.get("x", 0)**2 + accel.get("y", 0)**2 + accel.get("z", 0)**2) ** 0.5
    if accel_mag > ACCIDENT_ACCEL_THRESHOLD:
        twin.health_status = "critical"
        alert = Alert(
            alert_id=str(uuid.uuid4()),
            rider_id=rider_id,
            type="SOS",
            severity="CRITICAL",
            timestamp=telemetry.timestamp,
            message="Possible accident detected due to high impact."
        )
        store.add_alert(rider_id, alert)
        active_alerts.append(alert.alert_id)
        
        # Create SOS snapshot
        sos = SOSSnapshot(
            rider_id=rider_id,
            location=telemetry.gps_location,
            timestamp=telemetry.timestamp,
            trigger_reason="impact_detected",
            vitals_snapshot={"heart_rate": telemetry.heart_rate, "spo2": telemetry.spo2}
        )
        store.add_sos(rider_id, sos)
        print(f"!!! DISPATCHING SOS for Rider {rider_id} at {telemetry.gps_location} !!!")
        
    # 3. Rule: Drowsiness
    if telemetry.heart_rate < DROWSINESS_HR_THRESHOLD_LOW and twin.health_status != "critical":
        twin.fatigue_score = min(1.0, twin.fatigue_score + 0.1)
        if twin.fatigue_score > 0.7:
            twin.health_status = "warning"
            alert = Alert(
                alert_id=str(uuid.uuid4()),
                rider_id=rider_id,
                type="DROWSINESS",
                severity="WARNING",
                timestamp=telemetry.timestamp,
                message="Drowsiness detected. Please take a break."
            )
            store.add_alert(rider_id, alert)
            active_alerts.append(alert.alert_id)
    else:
        twin.fatigue_score = max(0.0, twin.fatigue_score - 0.05)
        
    # 4. Rule: Alcohol
    if telemetry.alcohol_ppm > ALCOHOL_PPM_THRESHOLD:
        twin.alcohol_detected = True
        twin.health_status = "critical"
        alert = Alert(
            alert_id=str(uuid.uuid4()),
            rider_id=rider_id,
            type="ALCOHOL",
            severity="CRITICAL",
            timestamp=telemetry.timestamp,
            message="High alcohol level detected! Do not ride."
        )
        store.add_alert(rider_id, alert)
        active_alerts.append(alert.alert_id)
    else:
        twin.alcohol_detected = False
        
    # 5. Rule: Blind Spot
    if telemetry.ultrasonic_distance < BLIND_SPOT_DISTANCE_CM and telemetry.speed > 10:
        alert = Alert(
            alert_id=str(uuid.uuid4()),
            rider_id=rider_id,
            type="BLIND_SPOT",
            severity="INFO",
            timestamp=telemetry.timestamp,
            message="Vehicle in blind spot!"
        )
        store.add_alert(rider_id, alert)
        active_alerts.append(alert.alert_id)
        
    # 6. Rule: Air Quality
    if telemetry.air_quality_index > AQI_WARNING_THRESHOLD:
        alert = Alert(
            alert_id=str(uuid.uuid4()),
            rider_id=rider_id,
            type="AIR_QUALITY",
            severity="WARNING",
            timestamp=telemetry.timestamp,
            message="Poor air quality detected."
        )
        store.add_alert(rider_id, alert)
        active_alerts.append(alert.alert_id)
        
    if not active_alerts and twin.health_status != "critical" and twin.fatigue_score < 0.5:
        twin.health_status = "optimal"
        
    twin.active_alerts.extend(active_alerts)
    # Keep last 10 alerts in twin state for brevity
    twin.active_alerts = twin.active_alerts[-10:]
    
    store.update_twin(rider_id, twin)
    return twin
