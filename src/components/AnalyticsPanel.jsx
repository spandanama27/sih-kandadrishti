import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  FileCheck, 
  IndianRupee, 
  Sliders, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import { computeBatchStats } from '../utils/geometry';

export default function AnalyticsPanel({ 
  currentBatch, 
  onGenerateDqc, 
  t 
}) {
  // Real-time MSP Calculator State
  const [mspRate, setMspRate] = useState(2400); // ₹ per quintal default
  const [lotQuintals, setLotQuintals] = useState(currentBatch?.quintals || 40.0);

  // Synchronize when currentBatch changes
  React.useEffect(() => {
    if (currentBatch?.quintals) {
      setLotQuintals(currentBatch.quintals);
    }
  }, [currentBatch]);

  const stats = computeBatchStats(currentBatch?.onions || []);

  // Price calculations based on DoCA buffer policy:
  // Grade A receives 100% of MSP
  // URS receives 85% of MSP (15% deduction)
  // Rejections are deducted (0% payout)
  const gradeAQtl = (lotQuintals * (stats.gradeAPct / 100));
  const ursQtl = (lotQuintals * (stats.ursPct / 100));
  const rejectQtl = (lotQuintals * (stats.rejectPct / 100));

  const gradeAPayout = gradeAQtl * mspRate;
  const ursPayout = ursQtl * (mspRate * 0.85);
  const rejectPayout = 0; // 0%
  const netPayout = Math.round(gradeAPayout + ursPayout);
  const effectiveRatePerQtl = lotQuintals > 0 ? Math.round(netPayout / lotQuintals) : 0;
  const standardLoss = Math.round((lotQuintals * mspRate) - netPayout);

  // Max count for distribution scaling
  const maxBucketCount = Math.max(
    stats.sizeBuckets['<35mm'],
    stats.sizeBuckets['35-45mm'],
    stats.sizeBuckets['45-65mm'],
    stats.sizeBuckets['>65mm'],
    1
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span>Real-Time Grading & Analytics Engine</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Objective Computer Vision Assessment vs DoCA Buffer Norms
            </p>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-xs ${
          stats.verdict === 'APPROVED' 
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
            : stats.verdict === 'CONDITIONAL'
            ? 'bg-amber-950/80 text-amber-300 border-amber-700'
            : 'bg-red-950/80 text-red-300 border-red-700'
        }`}>
          {stats.verdict === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          {stats.verdict === 'CONDITIONAL' && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
          {stats.verdict === 'REJECTED' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
          <span>{stats.verdict === 'APPROVED' ? 'Buffer Compliant' : stats.verdict === 'CONDITIONAL' ? 'Conditional URS' : 'Disqualified'}</span>
        </div>
      </div>

      {/* Main Body with scrolling content */}
      <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
        
        {/* Instant KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* Total Detected */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Total Bulbs</div>
            <div className="text-2xl font-bold font-mono text-slate-800 mt-0.5">{stats.total}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Sample Crate (≈2.5kg)</div>
          </div>

          {/* Grade A */}
          <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
            <div className="text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
              <span>Grade A</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-0.5">{stats.gradeACount}</div>
            <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
              {stats.gradeAPct}% <span className="text-[10px] font-normal text-emerald-600">(≥45mm)</span>
            </div>
          </div>

          {/* URS */}
          <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200">
            <div className="text-[11px] text-amber-800 font-semibold flex items-center justify-between">
              <span>URS Spec</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-700 mt-0.5">{stats.ursCount}</div>
            <div className="text-[11px] font-semibold text-amber-800 mt-0.5">
              {stats.ursPct}% <span className="text-[10px] font-normal text-amber-600">(35-45mm)</span>
            </div>
          </div>

          {/* Rejections */}
          <div className="bg-red-50/70 p-3 rounded-lg border border-red-200">
            <div className="text-[11px] text-red-800 font-semibold flex items-center justify-between">
              <span>Rejections</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <div className="text-2xl font-bold font-mono text-red-700 mt-0.5">{stats.rejectCount}</div>
            <div className="text-[11px] font-semibold text-red-800 mt-0.5">
              {stats.rejectPct}% <span className="text-[10px] font-normal text-red-600">(&lt;35mm/Rot)</span>
            </div>
          </div>

        </div>

        {/* Equatorial Diameter Statistics Row */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Mean Equatorial Diameter:</span>{' '}
            <strong className="text-slate-900 font-mono text-sm ml-1">{stats.avgDiameter} mm</strong>
            <span className="text-slate-400 font-mono text-[11px] ml-1.5">(σ = ±{stats.stdDev} mm)</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600">
            <span>Min: <strong>{stats.minDiameter} mm</strong></span>
            <span>•</span>
            <span>Max: <strong>{stats.maxDiameter} mm</strong></span>
            <span>•</span>
            <span>Total Sample Mass: <strong>{(stats.totalEstWeightGrams / 1000).toFixed(2)} kg</strong></span>
          </div>
        </div>

        {/* Interactive Size Distribution Bar Graph */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Equatorial Sizing Tiers (mm)</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Calibrated via ArUco Homography</span>
          </div>

          <div className="space-y-2">
            {/* <35mm Tier */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span className="text-red-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  &lt;35 mm (Reject - Under-sized)
                </span>
                <span className="font-mono text-slate-700">
                  {stats.sizeBuckets['<35mm']} units ({Math.round((stats.sizeBuckets['<35mm'] / stats.total) * 100 || 0)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.sizeBuckets['<35mm'] / maxBucketCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* 35-45mm Tier */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span className="text-amber-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  35 – 45 mm (URS - Under Relaxed Specs)
                </span>
                <span className="font-mono text-slate-700">
                  {stats.sizeBuckets['35-45mm']} units ({Math.round((stats.sizeBuckets['35-45mm'] / stats.total) * 100 || 0)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.sizeBuckets['35-45mm'] / maxBucketCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* 45-65mm Tier */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span className="text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  45 – 65 mm (Grade A - National Buffer Standard)
                </span>
                <span className="font-mono text-slate-700">
                  {stats.sizeBuckets['45-65mm']} units ({Math.round((stats.sizeBuckets['45-65mm'] / stats.total) * 100 || 0)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.sizeBuckets['45-65mm'] / maxBucketCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* >65mm Tier */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span className="text-teal-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  &gt;65 mm (Jumbo Grade A)
                </span>
                <span className="font-mono text-slate-700">
                  {stats.sizeBuckets['>65mm']} units ({Math.round((stats.sizeBuckets['>65mm'] / stats.total) * 100 || 0)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.sizeBuckets['>65mm'] / maxBucketCount) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* Pathology & Defect Matrix */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Bio-Pathology Breakdown</span>
            <span className="text-[10px] font-mono text-slate-500">Visual Defect Classifier</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded border border-slate-200">
              <div className="text-[10px] text-slate-500">Sound</div>
              <div className="font-bold text-emerald-600 text-sm font-mono mt-0.5">{stats.defects.sound}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <div className="text-[10px] text-slate-500">Sprouts</div>
              <div className="font-bold text-amber-600 text-sm font-mono mt-0.5">{stats.defects.sprout}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <div className="text-[10px] text-slate-500">Black Rot</div>
              <div className="font-bold text-red-600 text-sm font-mono mt-0.5">{stats.defects.mould}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <div className="text-[10px] text-slate-500">Cuts</div>
              <div className="font-bold text-orange-600 text-sm font-mono mt-0.5">{stats.defects.cut}</div>
            </div>
          </div>
        </div>

        {/* Price Realization & Farmer Payout Calculator */}
        <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl border border-slate-800 shadow-md space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-amber-500/20 text-amber-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Mandi Lot Payout Calculator (DoCA Norms)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              100% Transparent
            </span>
          </div>

          {/* Calculator Sliders / Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Base MSP Rate:</span>
                <span className="font-bold text-amber-400 font-mono">₹{mspRate.toLocaleString('en-IN')}/Qtl</span>
              </div>
              <input 
                type="range" 
                min="1600" 
                max="3200" 
                step="50"
                value={mspRate}
                onChange={(e) => setMspRate(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Lot Quantity:</span>
                <span className="font-bold text-slate-200 font-mono">{lotQuintals} Quintals</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="120" 
                step="5"
                value={lotQuintals}
                onChange={(e) => setLotQuintals(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Payout Breakdown Tiers */}
          <div className="space-y-1.5 text-xs bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80 font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Grade A Payout (100% MSP • {gradeAQtl.toFixed(1)} Qtl):</span>
              <span className="text-emerald-400 font-semibold">₹{Math.round(gradeAPayout).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>URS Payout (85% MSP • {ursQtl.toFixed(1)} Qtl):</span>
              <span className="text-amber-400 font-semibold">₹{Math.round(ursPayout).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Rejections Deduction (0% Payout • {rejectQtl.toFixed(1)} Qtl):</span>
              <span className="text-red-400">-₹0 (Returned)</span>
            </div>
          </div>

          {/* Total Net Payout Callout */}
          <div className="p-3 bg-emerald-950/70 rounded-lg border border-emerald-700 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-300 font-medium">Estimated Net Farmer Payout</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                ₹{netPayout.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono">Effective Rate:</div>
              <div className="text-sm font-bold font-mono text-white">₹{effectiveRatePerQtl}/Qtl</div>
            </div>
          </div>
        </div>

      </div>

      {/* Primary CTA: Generate DQC Modal Trigger */}
      <div className="p-4 bg-slate-100 border-t border-slate-200">
        <button
          onClick={onGenerateDqc}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 group relative overflow-hidden"
        >
          {/* Subtle sheen highlight */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <FileCheck className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
          <span className="text-sm tracking-wide uppercase">
            Generate Digital Quality Certificate (DQC)
          </span>
          <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
            Ed25519
          </span>
        </button>
      </div>

    </div>
  );
}
