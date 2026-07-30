"use client";
import React, { useEffect, useState } from 'react';

// Basic SVG icons to avoid external dependencies for now
const AlertTriangle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
const Activity = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const ShieldAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;

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
}

export default function Dashboard() {
  const [twin, setTwin] = useState<TwinState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to dashboard websocket
    const ws = new WebSocket('ws://localhost:8000/api/ws/dashboard');
    
    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to GuardianX Backend');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTwin(data);
    };
    
    ws.onclose = () => {
      setConnected(false);
      console.log('Disconnected from GuardianX Backend');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">GuardianX Fleet</h1>
          <p className="text-slate-400 mt-2">Real-time Rider & Helmet Telemetry</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${connected ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          {connected ? 'Live Connection' : 'Disconnected'}
        </div>
      </header>

      {twin ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rider Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl font-bold">
                {twin.rider_id.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{twin.rider_id}</h2>
                <p className="text-slate-400">Helmet: {twin.helmet_id}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <span className="text-slate-400">Health Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  twin.health_status === 'optimal' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                  twin.health_status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {twin.health_status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <span className="text-slate-400">Speed</span>
                <span className="font-mono text-xl">{twin.current_speed.toFixed(1)} <span className="text-sm text-slate-500">km/h</span></span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-400">Last Update</span>
                <span className="text-sm">{new Date(twin.last_updated).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Vitals & Risk Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl lg:col-span-2">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Activity /> Live Telemetry
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                <div className="text-slate-400 text-sm mb-1">Fatigue Score</div>
                <div className="text-3xl font-light">
                  {(twin.fatigue_score * 100).toFixed(0)}<span className="text-lg text-slate-500">%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${twin.fatigue_score > 0.7 ? 'bg-red-500' : twin.fatigue_score > 0.4 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${twin.fatigue_score * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                <div className="text-slate-400 text-sm mb-1">Alcohol Detected</div>
                <div className={`text-2xl font-medium mt-2 ${twin.alcohol_detected ? 'text-red-400' : 'text-green-400'}`}>
                  {twin.alcohol_detected ? 'YES' : 'NO'}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 md:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldAlert />
                </div>
                <div className="text-slate-400 text-sm mb-1">Active Alerts</div>
                <div className="text-3xl font-light mb-2">{twin.active_alerts.length}</div>
                <div className="flex flex-wrap gap-2">
                  {twin.active_alerts.slice(-3).map((alertId, i) => (
                    <span key={i} className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-1 rounded">Alert Triggered</span>
                  ))}
                  {twin.active_alerts.length === 0 && (
                    <span className="text-xs text-slate-500">No active alerts</span>
                  )}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 rounded-xl overflow-hidden border border-slate-800 relative h-48 bg-slate-950 flex items-center justify-center">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               <div className="z-10 text-center">
                 <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                 <div className="text-slate-400 text-sm font-mono">
                   LAT: {twin.current_location.lat.toFixed(4)} <br/>
                   LNG: {twin.current_location.lng.toFixed(4)}
                 </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
          <p className="text-xl">Waiting for telemetry data...</p>
          <p className="text-sm mt-2 max-w-md text-center">Start the GuardianX Backend and the Hardware Simulator to see live data.</p>
        </div>
      )}
    </div>
  );
}
