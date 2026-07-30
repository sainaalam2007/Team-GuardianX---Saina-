import subprocess
import time
import webbrowser
import sys
import os

def run_system():
    print("\nStarting GuardianX Fleet Command...")
    print("---------------------------------------")
    
    # Start Backend
    print("1/3 Starting Python FastAPI Backend...")
    backend = subprocess.Popen(["python", "main.py"], cwd="backend")
    
    # Start Dashboard
    print("2/3 Starting Next.js Dashboard...")
    dashboard = subprocess.Popen(["npm", "run", "dev"], cwd="dashboard", shell=True)
    
    print("Waiting for servers to initialize...")
    time.sleep(5)
    
    # Start Simulator
    print("3/3 Starting Hardware Simulator...")
    simulator = subprocess.Popen(["python", "simulate_helmet.py"], cwd="simulator")
    
    print("\n===================================================")
    print("SUCCESS! GuardianX is now running.")
    print("The website will open automatically in your browser.")
    print("===================================================\n")
    print("Press CTRL+C here to stop all servers at once.\n")
    
    # Open browser automatically
    webbrowser.open("http://localhost:3000")
    
    try:
        # Keep script running to keep children alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down all GuardianX services...")
        backend.terminate()
        simulator.terminate()
        # npm child processes can be stubborn on windows, but this sends the signal
        dashboard.terminate()
        print("Goodbye!")
        sys.exit(0)

if __name__ == "__main__":
    run_system()
