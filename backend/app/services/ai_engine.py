from app.models.schemas import DigitalTwinState, SensorTelemetry

def calculate_ai_risk_score(twin: DigitalTwinState, telemetry: SensorTelemetry) -> float:
    """
    Calculates a dynamic risk score from 0 to 100.
    Based on fatigue, speed, alerts, and environmental conditions.
    """
    base_risk = 10.0
    
    # Fatigue factor
    fatigue_risk = twin.fatigue_score * 40.0
    
    # Speed factor (assuming > 40 km/h adds risk)
    speed_risk = max(0, (telemetry.speed - 40) * 0.5)
    
    # Environmental factors
    aqi_risk = max(0, (telemetry.air_quality_index - 50) * 0.2)
    
    # Alert multiplier
    alert_multiplier = 1.0 + (len(twin.active_alerts) * 0.2)
    
    # Critical overrides
    if twin.alcohol_detected:
        return 100.0
    
    total_risk = (base_risk + fatigue_risk + speed_risk + aqi_risk) * alert_multiplier
    return min(100.0, total_risk)

def generate_ai_coach_message(twin: DigitalTwinState, telemetry: SensorTelemetry, risk_score: float) -> str:
    """
    Generates dynamic coaching text based on the rider's current state.
    """
    if twin.health_status == "critical":
        if twin.alcohol_detected:
            return "ALCOHOL DETECTED: Do not ride. Call a cab immediately."
        return "CRITICAL EVENT: Pull over immediately. SOS dispatched if needed."
        
    if risk_score > 70:
        if twin.fatigue_score > 0.6:
            return "WARNING: High fatigue levels detected. A rest stop is 5km away. Please pull over."
        if telemetry.speed > 80:
            return "WARNING: High speed detected. Please slow down to reduce risk."
        return "WARNING: Risk score is very high. Ride defensively."
        
    if risk_score > 40:
        if telemetry.air_quality_index > 100:
            return "NOTICE: Poor air quality. Consider taking a break or closing visor."
        return "NOTICE: Moderate risk. Maintain safe following distance."
        
    return "Optimal riding conditions. Stay alert and ride safe."
