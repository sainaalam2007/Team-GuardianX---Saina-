"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import Map to prevent SSR issues with Leaflet
const Map = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-900 animate-pulse rounded-xl flex items-center justify-center text-slate-500">Loading Maps...</div>
});

// Basic SVG icons
const Activity = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const ShieldAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;
const BrainCircuit = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"/><path d="M16 8V5c0-1.1.9-2 2-2"/><path d="M12 20v-8"/><path d="M16 16v-2a2 2 0 0 0-2-2h-2"/><path d="M20 12h-2a2 2 0 0 1-2-2V8"/></svg>;

interface TwinState {
  rider_id: string;
  helmet_id: string;
  last_updated: string;
  current_location: { lat: number; lng: number };
  current_speed: number;
  health_status: string;
  fatigue_score: number;
  alcohol_detected: boolean;
  active_alerts: string[];
  risk_score: number;
  ai_coach_message: string;
}

interface Hazard {
  hazard_id: string;
  type: string;
  location: { lat: number; lng: number };
  reported_by: string;
  timestamp: string;
}

export default function Dashboard() {
  const [twin, setTwin] = useState<TwinState | null>(null);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [connected, setConnected] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    router.push('/login');
  };

  useEffect(() => {
    // Fetch initial hazards
    fetch('http://localhost:8000/api/hazards')
      .then(res => res.json())
      .then(data => setHazards(data))
      .catch(console.error);

    // Connect to dashboard websocket
    const ws = new WebSocket('ws://localhost:8000/api/ws/dashboard');
    
    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to GuardianX Backend');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_hazard') {
          // It's a hazard broadcast
          setHazards(prev => [...prev, data.data]);
        } else if (data.rider_id) {
          // It's a TwinState broadcast
          setTwin(data);
        }
      } catch (e) {
        console.error("Failed to parse ws message", e);
      }
    };
    
    ws.onclose = () => {
      setConnected(false);
      console.log('Disconnected from GuardianX Backend');
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="mb-6 flex justify-between items-center bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-800/50 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">GuardianX Fleet Command</h1>
          <p className="text-slate-400 text-sm mt-1">AI-Powered Risk Prediction & Telemetry</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-[0_0_15px_rgba(0,0,0,0.2)] backdrop-blur-md ${connected ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-400'}`}></div>
            <span className="text-sm font-medium tracking-wide">{connected ? 'SYSTEM ONLINE' : 'OFFLINE'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 rounded-full text-slate-300 text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {twin ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Left Column: Stats & AI */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            
            {/* Rider Profile Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
                  {twin.rider_id.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100 tracking-tight">{twin.rider_id}</h2>
                  <p className="text-slate-400 text-xs font-mono">{twin.helmet_id}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400 text-sm">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    twin.health_status === 'optimal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 
                    twin.health_status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(225,29,72,0.2)] animate-pulse'
                  }`}>
                    {twin.health_status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400 text-sm">Speed</span>
                  <span className="font-mono text-xl font-semibold text-slate-200">{twin.current_speed.toFixed(1)} <span className="text-xs text-slate-500">km/h</span></span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 text-sm">Last Sync</span>
                  <span className="text-xs font-mono text-slate-500">{new Date(twin.last_updated).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* AI Ride Coach Widget */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 shadow-[0_8px_32px_rgba(79,70,229,0.1)] relative overflow-hidden flex-1">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-indigo-400">
                <BrainCircuit />
              </div>
              <h3 className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-6 flex items-center gap-2">
                AI Ride Coach
              </h3>
              
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {/* SVG Circle for Risk Score */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      stroke={twin.risk_score > 70 ? "#e11d48" : twin.risk_score > 40 ? "#f59e0b" : "#10b981"} 
                      strokeWidth="8" 
                      strokeDasharray={`${twin.risk_score * 2.827} 282.7`} 
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-light">{twin.risk_score.toFixed(0)}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-widest mt-1">Risk</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/80 shadow-inner">
                <p className={`text-sm leading-relaxed ${
                  twin.risk_score > 70 ? "text-rose-400" : twin.risk_score > 40 ? "text-amber-400" : "text-emerald-400"
                }`}>
                  "{twin.ai_coach_message}"
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Telemetry & Map */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            
            {/* Top Row: Vitals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 shadow-xl transition-transform hover:scale-[1.02]">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Fatigue Level</div>
                <div className="flex items-end gap-1">
                  <div className="text-4xl font-light">{(twin.fatigue_score * 100).toFixed(0)}</div>
                  <div className="text-lg text-slate-500 mb-1">%</div>
                </div>
                <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${twin.fatigue_score > 0.7 ? 'bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.8)]' : twin.fatigue_score > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${twin.fatigue_score * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 shadow-xl transition-transform hover:scale-[1.02]">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Alcohol Detection</div>
                <div className={`text-3xl font-medium mt-1 tracking-tight ${twin.alcohol_detected ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
                  {twin.alcohol_detected ? 'DETECTED' : 'CLEAR'}
                </div>
                <p className="text-xs text-slate-500 mt-3 font-mono">{twin.alcohol_detected ? 'MQ3 Sensor: >200ppm' : 'MQ3 Sensor: Normal'}</p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 shadow-xl md:col-span-2 relative overflow-hidden flex flex-col transition-transform hover:scale-[1.01]">
                <div className="absolute top-0 right-0 p-5 opacity-10">
                  <ShieldAlert />
                </div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Active Alerts</div>
                
                {twin.active_alerts.length === 0 ? (
                   <div className="flex-1 flex flex-col justify-center">
                     <span className="text-3xl font-light text-slate-600 mb-1">0</span>
                     <span className="text-xs text-slate-500">System operating normally. No active threats.</span>
                   </div>
                ) : (
                  <>
                    <div className="text-3xl font-light text-rose-400 mb-3">{twin.active_alerts.length}</div>
                    <div className="flex flex-wrap gap-2">
                      {twin.active_alerts.slice(-4).map((alertId, i) => (
                        <span key={i} className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-1 rounded-md shadow-sm">Alert ID: {alertId.substring(0,8)}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Row: The Map & Hazards Feed */}
            <div className="flex-1 min-h-[400px] grid grid-cols-1 lg:grid-cols-4 gap-6">
               
               {/* Leaflet Map */}
               <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-2xl relative">
                 {/* Decorative Frame */}
                 <div className="absolute inset-0 border border-slate-700/50 rounded-2xl pointer-events-none z-10" />
                 <Map riderLocation={twin.current_location} hazards={hazards} />
               </div>

               {/* Community Hazards Feed */}
               <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-xl flex flex-col">
                 <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase mb-4 flex items-center justify-between">
                   <span>Hazard Feed</span>
                   <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{hazards.length} Live</span>
                 </h3>
                 
                 <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                   {hazards.length === 0 ? (
                     <div className="h-full flex items-center justify-center text-center p-4">
                       <p className="text-xs text-slate-500">No community hazards reported in this sector.</p>
                     </div>
                   ) : (
                     hazards.slice().reverse().map(hazard => (
                       <div key={hazard.hazard_id} className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-xl hover:bg-slate-800 transition-colors">
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">{hazard.type}</span>
                           <span className="text-[10px] text-slate-500">{new Date(hazard.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         </div>
                         <p className="text-xs text-slate-400 truncate">Rep: {hazard.reported_by}</p>
                       </div>
                     ))
                   )}
                 </div>
               </div>

            </div>

          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-slate-800 border-b-blue-500 rounded-full animate-spin direction-reverse"></div>
          </div>
          <h2 className="text-2xl font-bold mt-8 mb-2 tracking-tight">Awaiting Telemetry Stream</h2>
          <p className="text-sm max-w-md text-center text-slate-400">
            Start the GuardianX Backend and Hardware Simulator to establish a live connection to the fleet command center.
          </p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 1); 
        }
        .direction-reverse {
          animation-direction: reverse;
          animation-duration: 1.5s;
        }
      `}} />
    </div>
  );
}
