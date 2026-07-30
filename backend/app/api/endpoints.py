from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from typing import List
import json
from app.models.schemas import SensorTelemetry, DigitalTwinState, Alert, SOSSnapshot, Hazard, VoiceCommandRequest
from app.services.store import store
from app.services.rules import process_telemetry

router = APIRouter()

# Store active websocket connections for dashboard to listen
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@router.websocket("/ws/ingest/{helmet_id}")
async def websocket_endpoint(websocket: WebSocket, helmet_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            try:
                telemetry_data = json.loads(data)
                telemetry = SensorTelemetry(**telemetry_data)
                
                # Process the telemetry and update state
                twin_state = process_telemetry(telemetry)
                
                # Broadcast the updated twin state to any dashboard clients
                await manager.broadcast(twin_state.model_dump_json())
                
            except Exception as e:
                print(f"Error processing telemetry: {e}")
                
    except WebSocketDisconnect:
        print(f"Helmet {helmet_id} disconnected")

@router.websocket("/ws/dashboard")
async def dashboard_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Just keep the connection alive, dashboard only receives
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.get("/twins", response_model=List[DigitalTwinState])
async def get_all_twins():
    return store.get_all_twins()

@router.get("/twins/{rider_id}", response_model=DigitalTwinState)
async def get_twin(rider_id: str):
    twin = store.get_twin(rider_id)
    if not twin:
        raise HTTPException(status_code=404, detail="Twin not found")
    return twin

@router.get("/alerts/{rider_id}", response_model=List[Alert])
async def get_alerts(rider_id: str):
    return store.get_alerts(rider_id)

@router.get("/alerts", response_model=List[Alert])
async def get_all_alerts():
    return store.get_all_alerts()

@router.get("/sos/{rider_id}", response_model=List[SOSSnapshot])
async def get_sos_snapshots(rider_id: str):
    return store.get_sos(rider_id)

@router.get("/hazards", response_model=List[Hazard])
async def get_hazards():
    return store.get_all_hazards()

@router.post("/hazards", response_model=Hazard)
async def report_hazard(hazard: Hazard):
    store.add_hazard(hazard)
    # Broadcast new hazard to dashboard clients
    await manager.broadcast(f'{{"type": "new_hazard", "data": {hazard.model_dump_json()}}}')
    return hazard

@router.post("/voice")
async def process_voice_command(req: VoiceCommandRequest):
    twin = store.get_twin(req.rider_id)
    if not twin:
        raise HTTPException(status_code=404, detail="Twin not found")
        
    twin.last_voice_command = req.command
    
    cmd = req.command.lower()
    if "ambulance" in cmd or "help" in cmd or "crash" in cmd:
        print("\n📞 [TWILIO MOCK] ---------------------------------------")
        print(f"📞 [TWILIO MOCK] LIVE MICROPHONE KEYWORDS DETECTED: '{req.command}'")
        print(f"📞 [TWILIO MOCK] Dialing EMS (911) for Rider {req.rider_id}")
        print(f"💬 [TWILIO MOCK] SMS sent to Emergency Contact: 'Rider {req.rider_id} requests immediate assistance.'")
        print("📞 [TWILIO MOCK] ---------------------------------------\n")
        
    store.update_twin(req.rider_id, twin)
    await manager.broadcast(twin.model_dump_json())
    return {"status": "processed"}
