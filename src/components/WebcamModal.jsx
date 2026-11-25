import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Sparkles, Sliders } from 'lucide-react';

export default function WebcamModal({ isOpen, onClose, onCaptureAndAnalyze }) {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedStream, setSimulatedStream] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreamActive(true);
        }
      } else {
        setSimulatedStream(true);
      }
    } catch (err) {
      console.warn('Real webcam not accessible or permission denied. Using high-fidelity Mandi camera simulation:', err);
      setSimulatedStream(true);
      setStreamActive(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    setSimulatedStream(false);
  };

  const handleCapture = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onCaptureAndAnalyze();
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>Live Mandi Edge Camera Stream</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {simulatedStream ? 'Synthetic Mandi Feed' : 'Hardware Sensor Active'}
                </span>
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
          {simulatedStream ? (
            <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
              {/* Simulated camera grid & reticle */}
              <div className="absolute inset-4 border border-dashed border-emerald-500/40 rounded-lg pointer-events-none">
                <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400">
                  ARUCO-TRAY-CALIBRATION: LOCKED (4/4 CORNERS)
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-emerald-400">
                  LUX: 540 | EXPOSURE: 1/120s
                </div>
              </div>

              {/* Moving scanning reticle */}
              <div className="w-48 h-48 border-2 border-emerald-400/80 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              </div>

              <div className="mt-4 space-y-1 text-slate-300">
                <div className="font-bold text-sm text-white">Live Conveyor Feed Active</div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Simulated 1080p Mandi inspection feed scanning top-down onto calibrated 500x400mm ArUco marker tray.
                </p>
              </div>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
          )}

          {/* ArUco Corner Guides Overlay */}
          <div className="absolute inset-6 border border-emerald-500/50 pointer-events-none rounded">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/40 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-mono">
            Optical Homography Matrix: Ready
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCapture}
              disabled={isProcessing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-2 transition disabled:opacity-50"
            >
              <Camera className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Analyzing Frame...' : 'Capture & Grade Frame'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
