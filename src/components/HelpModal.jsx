import React from 'react';
import { X, BookOpen, ShieldCheck, Cpu, Target, Award, CheckCircle2, ChevronRight } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>कांदा-दृष्टि System Architecture & DoCA Norms</span>
              </h2>
              <p className="text-xs text-slate-400">
                Smart India Hackathon 2026 • Ministry of Consumer Affairs, Food & Public Distribution
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs text-slate-700 leading-relaxed">
          
          {/* Mission Objective */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900 text-sm">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>National Onion Buffer Procurement Mandate</span>
            </div>
            <p>
              Under the Department of Consumer Affairs (DoCA), Government of India procures an annual buffer stock of <strong>5 Lakh Metric Tonnes (LMT)</strong> of Rabi onions via NAFED and NCCF to stabilize retail prices during lean months. KandaDrishti AI replaces subjective visual inspection with <strong>deterministic edge computer vision</strong>.
            </p>
          </div>

          {/* DoCA 2026 Grading Specifications */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>DoCA Buffer Quality Classification Norms</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Grade A */}
              <div className="p-3 bg-slate-50 rounded-xl border border-emerald-300 space-y-1.5">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>Grade A (Sound)</span>
                </div>
                <div className="font-mono text-emerald-700 font-semibold">Equatorial ≥ 45 mm</div>
                <p className="text-[11px] text-slate-600">
                  Tight dry neck, healthy papery skin (minimum 2 layers), zero sprouting, zero black mould rot. 
                  <strong> 100% MSP Payout.</strong>
                </p>
              </div>

              {/* URS */}
              <div className="p-3 bg-slate-50 rounded-xl border border-amber-300 space-y-1.5">
                <div className="font-bold text-amber-800 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>URS (Relaxed)</span>
                </div>
                <div className="font-mono text-amber-700 font-semibold">Equatorial 35–45 mm</div>
                <p className="text-[11px] text-slate-600">
                  Fair average quality, or minor cut (&lt;5% surface area). Procured under Under Relaxed Specifications with 
                  <strong> 15% MSP deduction.</strong>
                </p>
              </div>

              {/* Rejections */}
              <div className="p-3 bg-slate-50 rounded-xl border border-red-300 space-y-1.5">
                <div className="font-bold text-red-800 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <span>Rejections</span>
                </div>
                <div className="font-mono text-red-700 font-semibold">Under 35 mm / Rot</div>
                <p className="text-[11px] text-slate-600">
                  Under-sized bulbs (&lt;35mm), active sprouts (&gt;5mm), Aspergillus mould, or wet neck rot. 
                  <strong> Disqualified (0% payout).</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Technical Edge Pipeline */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Core Edge Vision & Cryptographic Architecture</span>
            </h3>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-2.5 font-mono text-[11px]">
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300">1. ArUco 4-Point Homography Matrix:</strong> Uses 4 calibrated fiducial markers to calculate exact pixel-to-millimeter scale (1 px ≈ 1.136 mm) and cancel camera tilt/perspective distortion.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300">2. Real-Time Segmentation:</strong> Detects bulb boundaries, equatorial axis (width), polar axis (height), and sphericity index.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300">3. Multi-Defect Pathology Classifier:</strong> Segregates active sprouting, Aspergillus niger black mould patches, and mechanical sorting cuts.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300">4. Ed25519 Hardware Enclave Signatures:</strong> Generates tamper-proof Digital Quality Certificates (DQC) locally on device without requiring cloud connectivity.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-mono">
            DoCA Ref: DQC-PROC-2026/DOCA-NAFED
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
}
