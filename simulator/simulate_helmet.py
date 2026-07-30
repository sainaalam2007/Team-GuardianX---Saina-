import asyncio
import websockets
import json
import random
import time
import requests
import uuid
from datetime import datetime, timezone
import speech_recognition as sr
import pyttsx3
import threading

# Voice Command State
current_voice_command = None
voice_lock = threading.Lock()

def speak_async(text):
    def run_tts():
        try:
            import pyttsx3
            engine = pyttsx3.init()
            engine.setProperty('rate', 160) # slightly faster rate
            engine.say(text)
            engine.runAndWait()
        except Exception as e:
            print(f"TTS Error: {e}")
            
    threading.Thread(target=run_tts, daemon=True).start()

def listen_loop():
    global current_voice_command
    r = sr.Recognizer()
    
    try:
        with sr.Microphone() as source:
            print("Adjusting for ambient noise... please wait 2 seconds.")
            r.adjust_for_ambient_noise(source, duration=2)
            # Increase pause threshold so it doesn't cut off speech too early
            r.pause_threshold = 1.0 
            
            print("\n=========================================")
            print("Microphone initialized. Listening for commands...")
            print("Say 'help', 'ambulance', or 'crash' to test alerts.")
            print("=========================================\n")
            
            while True:
                try:
                    # Removed phrase_time_limit so users can finish their sentences
                    audio = r.listen(source, timeout=None)
                    print("[Mic] Processing audio...")
                    text = r.recognize_google(audio)
                    print(f"[Mic] Heard: '{text}'")
                    
                    with voice_lock:
                        current_voice_command = text
                    
                    speak_async("Command received.")
                    
                except sr.UnknownValueError:
                    pass
                except sr.RequestError as e:
                    print(f"[Mic] Request error: {e}")
                except Exception as e:
                    pass
    except Exception as e:
        print(f"Could not initialize microphone: {e}")

# Configuration
RIDER_ID = "rider_123"
HELMET_ID = "helmet_456"
BACKEND_WS_URL = f"ws://localhost:8000/api/ws/ingest/{HELMET_ID}"
BACKEND_API_URL = "http://localhost:8000/api"
SEND_INTERVAL = 1.0  # seconds

# Base location (San Francisco)
BASE_LAT = 37.7749
BASE_LNG = -122.4194

def generate_telemetry_payload(scenario="normal", iteration=0):
    global current_voice_command
    cmd_to_send = None
    with voice_lock:
        if current_voice_command:
            cmd_to_send = current_voice_command
            current_voice_command = None

    # Base telemetry for a normal ride
    telemetry = {
        "rider_id": RIDER_ID,
        "helmet_id": HELMET_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "heart_rate": random.uniform(70, 100),
        "spo2": random.uniform(95, 100),
        "speed": random.uniform(30, 60),
        "accelerometer": {"x": random.uniform(-0.5, 0.5), "y": random.uniform(-0.5, 0.5), "z": random.uniform(0.8, 1.2)},
        "gyroscope": {"x": random.uniform(-10, 10), "y": random.uniform(-10, 10), "z": random.uniform(-10, 10)},
        "alcohol_ppm": random.uniform(0, 50),
        "air_quality_index": random.uniform(20, 80),
        "ultrasonic_distance": random.uniform(200, 500), # safe distance
        "gps_location": {
            "lat": BASE_LAT + (iteration * 0.0001) + random.uniform(-0.00005, 0.00005), 
            "lng": BASE_LNG + (iteration * 0.0001) + random.uniform(-0.00005, 0.00005)
        },
        "battery_level": 85.0,
        "voice_command": cmd_to_send
    }

    # Override values based on scenario
    if scenario == "accident":
        # Sudden deceleration (high g-force)
        telemetry["speed"] = 0
        telemetry["accelerometer"]["x"] = random.uniform(6.0, 10.0) # > 5.0 threshold
        telemetry["heart_rate"] = random.uniform(120, 150)
    elif scenario == "voice_nav":
        # Do nothing to voice command, just let the iteration pass
        pass
    elif scenario == "drowsiness":
        # Low heart rate, low variability
        telemetry["heart_rate"] = random.uniform(40, 48) # < 50 threshold
    elif scenario == "drunk":
        # High alcohol reading
        telemetry["alcohol_ppm"] = random.uniform(250, 400) # > 200 threshold
    elif scenario == "blind_spot":
        # Object very close
        telemetry["ultrasonic_distance"] = random.uniform(50, 100) # < 150 threshold
        
    return telemetry

async def stream_data():
    # Start the listening thread
    listener_thread = threading.Thread(target=listen_loop, daemon=True)
    listener_thread.start()
    
    async with websockets.connect(BACKEND_WS_URL) as websocket:
        print(f"Connected to {BACKEND_WS_URL}")
        
        iteration = 0
        while True:
            # Determine scenario based on iteration to simulate different events
            scenario = "normal"
            if 10 <= iteration < 15:
                scenario = "drowsiness"
            elif 25 <= iteration < 30:
                scenario = "drunk"
            elif 38 == iteration:
                scenario = "voice_nav"
            elif 40 <= iteration < 45:
                scenario = "accident"
                
            # Randomly create a hazard
            if iteration == 35:
                try:
                    requests.post(f"{BACKEND_API_URL}/hazards", json={
                        "hazard_id": str(uuid.uuid4()),
                        "type": random.choice(["POTHOLE", "ICE", "ROAD_WORK"]),
                        "location": {
                            "lat": BASE_LAT + ((iteration + 5) * 0.0001), 
                            "lng": BASE_LNG + ((iteration + 5) * 0.0001)
                        },
                        "reported_by": "community_user_7",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "active": True
                    })
                    print("Spawned a community hazard!")
                except Exception as e:
                    print(f"Failed to post hazard: {e}")
                
            payload = generate_telemetry_payload(scenario, iteration)
            await websocket.send(json.dumps(payload))
            print(f"Sent {scenario} telemetry at {payload['timestamp']}")
            
            iteration += 1
            if iteration > 70:
                iteration = 0 # reset cycle
                
            await asyncio.sleep(SEND_INTERVAL)

if __name__ == "__main__":
    try:
        asyncio.run(stream_data())
    except KeyboardInterrupt:
        print("Simulation stopped.")
