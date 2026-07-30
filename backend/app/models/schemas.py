from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

# 1. Incoming Sensor Telemetry
class SensorTelemetry(BaseModel):
    rider_id: str
    helmet_id: str
    timestamp: datetime
    heart_rate: float        # bpm
    spo2: float              # percentage
    speed: float             # km/h
    accelerometer: Dict[str, float]      # {"x": float, "y": float, "z": float}
    gyroscope: Dict[str, float]          # {"x": float, "y": float, "z": float}
    alcohol_ppm: float       # MQ3 reading
    air_quality_index: float # MQ135 reading
    ultrasonic_distance: float # cm (for blind spot)
    gps_location: Dict[str, float]       # {"lat": float, "lng": float}
    battery_level: float     # percentage
    voice_command: Optional[str] = None  # STT transcription

# 2. Digital Twin State
class DigitalTwinState(BaseModel):
    rider_id: str
    helmet_id: str
    last_updated: datetime
    current_location: Dict[str, float]
    current_speed: float
    health_status: str       # e.g., "optimal", "warning", "critical"
    fatigue_score: float     # 0.0 to 1.0 (calculated over time)
    alcohol_detected: bool
    active_alerts: List[str]
    risk_score: float = 0.0
    ai_coach_message: str = "Stay alert. Ride safe."
    last_voice_command: Optional[str] = None

# 3. Alert / Event Model
class Alert(BaseModel):
    alert_id: str
    rider_id: str
    type: str                # "SOS", "DROWSINESS", "ALCOHOL", "BLIND_SPOT", "AIR_QUALITY"
    severity: str            # "INFO", "WARNING", "CRITICAL"
    timestamp: datetime
    message: str
    resolved: bool = False

# 4. SOS Snapshot
class SOSSnapshot(BaseModel):
    rider_id: str
    location: Dict[str, float]
    timestamp: datetime
    trigger_reason: str      # e.g., "impact_detected"
    vitals_snapshot: Dict[str, float]

# 5. Community Hazard
class Hazard(BaseModel):
    hazard_id: str
    type: str                # e.g., "POTHOLE", "ICE", "ACCIDENT"
    location: Dict[str, float]
    reported_by: str
    timestamp: datetime
    active: bool = True

class VoiceCommandRequest(BaseModel):
    rider_id: str
    command: str

# 7. Authentication & User
class EmergencyContacts(BaseModel):
    parents_phone: str
    police_phone: str
    ambulance_phone: str
    other_phone: Optional[str] = None

class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    emergency_contacts: EmergencyContacts

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserRegister):
    id: str

