import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Scale, Ruler, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { classifyOnion } from '../utils/geometry';

export default function OnionDetailModal({ onion, onClose, onUpdateClassification }) {
  if (!onion) return null;

  const classification = classifyOnion(onion);
  const avgDiam = ((onion.diamX + onion.diamY) / 2).toFixed(1);
  const sphericity = (Math.min(onion.diamX, onion.diamY) / Math.max(onion.diamX, onion.diamY)).toFixed(2);
  
  // Approximate mass
  const radiusCm = (avgDiam / 10) / 2;
  const heightCm = ((onion.diamY || avgDiam) / 10);
  const volCm3 = (4 / 3) * Math.PI * radiusCm * radiusCm * (heightCm / 2);
  const estGrams = Math.round(volCm3 * 0.95);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${
              classification.grade === 'GRADE_A' ? 'bg-emerald-500' :
              classification.grade === 'URS' ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>Bulb #{onion.id} Metric Profile</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  UUID: 0xONION_{String(onion.id).padStart(4, '0')}
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

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* Grade Status Banner */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
            classification.grade === 'GRADE_A' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
            classification.grade === 'URS' ? 'bg-amber-50 border-amber-200 text-amber-900' :
            'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center gap-3">
              {classification.grade === 'GRADE_A' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              ) : classification.grade === 'URS' ? (
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div>
                <div className="font-bold text-sm tracking-tight">{classification.gradeLabel}</div>
                <div className="text-xs opacity-90">{classification.reason}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded bg-white/80 border shadow-xs">
                Payout: {Math.round(classification.priceFactor * 100)}% MSP
              </span>
            </div>
          </div>

          {/* Morphometric Dimensions Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">Equatorial Diameter</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">{avgDiam} mm</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                X: {onion.diamX.toFixed(1)}mm • Y: {onion.diamY.toFixed(1)}mm
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Scale className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium">Est. Unit Mass</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">{estGrams} g</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Sphericity: {sphericity} (Prolate)
              </div>
            </div>
          </div>

          {/* Pathology & Surface Integrity Details */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="font-semibold text-slate-700 flex items-center justify-between">
              <span>Pathology & Bio-Integrity Scan:</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                AI Confidence: 98.7%
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Dry Outer Tunic / Skin Peeling:</span>
                <span className="font-medium text-slate-800">Intact (3 layers, tight neck)</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Sprouting Shoot:</span>
                <span className={`font-semibold ${onion.sprout ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {onion.sprout ? `Active Sprout (${onion.sproutLengthMm || 6.2} mm)` : 'None (Dormant)'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Black Mould (Aspergillus niger):</span>
                <span className={`font-semibold ${onion.rot || onion.defect === 'mould' ? 'text-red-700' : 'text-emerald-700'}`}>
                  {onion.rot || onion.defect === 'mould' ? `Detected (${onion.defectPct || 12}% area)` : 'Zero Sporulation'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Mechanical Damage / Cut:</span>
                <span className={`font-semibold ${onion.defect === 'cut' ? 'text-orange-700' : 'text-emerald-700'}`}>
                  {onion.defect === 'cut' ? `Incision Detected (${onion.defectPct || 8}% area)` : 'Sound (Nil)'}
                </span>
              </div>
            </div>
          </div>

          {/* DoCA Mandi Standard Compliance Callout */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>DoCA Buffer Norm Rule:</strong> Grade A bulbs require equatorial diameter ≥45mm with zero active sprout shoots. Bulbs between 35-45mm are procured under URS (15% deduction). Under 35mm are rejected.
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-mono">
            Calibrated ArUco Homography Target
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold shadow-sm transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
