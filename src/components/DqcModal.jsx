import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Printer, 
  Download, 
  CloudUpload, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Sparkles,
  Building,
  MapPin,
  Calendar,
  User,
  Check
} from 'lucide-react';
import { generateSha256, generateEd25519Signature } from '../utils/crypto';
import { computeBatchStats } from '../utils/geometry';

export default function DqcModal({ 
  currentBatch, 
  currentMandi, 
  onClose, 
  onSyncBatchToCentral 
}) {
  const [dqcHash, setDqcHash] = useState('');
  const [ed25519Sig, setEd25519Sig] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [syncTxId, setSyncTxId] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const stats = computeBatchStats(currentBatch?.onions || []);

  useEffect(() => {
    const initCrypto = async () => {
      const now = new Date();
      const timeFormatted = now.toISOString();
      setTimestamp(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST');

      const payload = JSON.stringify({
        lotId: currentBatch?.id,
        mandiId: currentMandi?.id,
        mandiCoords: `${currentMandi?.lat},${currentMandi?.lng}`,
        farmer: currentBatch?.farmer,
        bags: currentBatch?.bags,
        quintals: currentBatch?.quintals,
        gradeAPct: stats.gradeAPct,
        ursPct: stats.ursPct,
        rejectPct: stats.rejectPct,
        avgDiameter: stats.avgDiameter,
        officer: currentMandi?.officer,
        time: timeFormatted
      });

      const hash = await generateSha256(payload);
      setDqcHash(hash);
      const sig = generateEd25519Signature(hash, currentMandi?.officer || 'DOCA-4429', timeFormatted);
      setEd25519Sig(sig);
    };

    initCrypto();
  }, [currentBatch, currentMandi, stats]);

  // QR Code Payload (JSON formatted for mobile scanner verification)
  const qrData = JSON.stringify({
    dqcVersion: "2.0-DoCA",
    lotId: currentBatch?.id,
    mandi: currentMandi?.name,
    farmer: currentBatch?.farmer,
    qtl: currentBatch?.quintals,
    gradeA: `${stats.gradeAPct}%`,
    urs: `${stats.ursPct}%`,
    reject: `${stats.rejectPct}%`,
    avgMm: `${stats.avgDiameter}mm`,
    verdict: stats.verdict,
    hash: dqcHash.slice(0, 16),
    sig: ed25519Sig.slice(0, 24)
  });

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  // Handle JSON export
  const handleExportJson = () => {
    const dataToExport = {
      certificateType: "DoCA-NAFED-National-Onion-Buffer-DQC",
      version: "2026.1",
      generatedAt: timestamp,
      dqcSha256: dqcHash,
      ed25519Signature: ed25519Sig,
      mandiDetails: currentMandi,
      batchDetails: {
        id: currentBatch?.id,
        farmer: currentBatch?.farmer,
        village: currentBatch?.village,
        bags: currentBatch?.bags,
        quintals: currentBatch?.quintals,
        cropType: currentBatch?.cropType,
      },
      qualityMetrics: stats,
      deviceIntegrity: {
        hardwareEnclave: "ARM TrustZone Secure Boot Validated",
        offlineMode: true,
        edgeModel: "YOLOv11-OnionSeg-Quantized-INT8",
        arucoTrayCalibrated: true
      }
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DQC_${currentBatch?.id}_${currentMandi?.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle simulated cloud sync
  const handleSyncCloud = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsSynced(true);
      const randomTx = '0xDOCA_' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase();
      setSyncTxId(randomTx);
      if (onSyncBatchToCentral) {
        onSyncBatchToCentral({
          lotId: currentBatch?.id,
          farmerName: currentBatch?.farmer,
          village: currentBatch?.village,
          bags: currentBatch?.bags,
          quintals: currentBatch?.quintals,
          timestamp,
          gradeAPct: stats.gradeAPct,
          ursPct: stats.ursPct,
          rejectPct: stats.rejectPct,
          avgDiameterMm: stats.avgDiameter,
          status: 'synced',
          syncTxHash: randomTx,
          dqcHash
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Certificate Dialog Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>Official Digital Quality Certificate</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  DoCA Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Cryptographically Signed Offline on Mandi Edge Device
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE RECEIPT CONTAINER */}
        <div id="dqc-printable-receipt" className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
          
          {/* Certificate Header / Emblem */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            {/* Tiranga Stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-slate-300 to-emerald-600 mb-4 rounded-full"></div>

            <div className="flex flex-col items-center">
              {/* Ashoka Emblem Placeholder / Ministry Seal */}
              <div className="w-12 h-12 rounded-full border-2 border-slate-800 p-1 flex items-center justify-center mb-2 shadow-xs">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xs uppercase font-bold tracking-widest text-slate-700">
                Government of India
              </h3>
              <h4 className="text-sm font-extrabold tracking-wide text-slate-900 uppercase">
                Ministry of Consumer Affairs, Food & Public Distribution
              </h4>
              <p className="text-[11px] font-semibold text-slate-600">
                Department of Consumer Affairs (DoCA) • NAFED National Buffer Procurement Division
              </p>
              <div className="mt-3 px-4 py-1 rounded bg-slate-900 text-white font-mono text-xs font-bold tracking-wider inline-block">
                DIGITAL QUALITY CERTIFICATE (DQC)
              </div>
            </div>
          </div>

          {/* Mandi & Batch Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Lot Identifier</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{currentBatch?.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Mandi Center</span>
              <span className="font-semibold text-slate-900">{currentMandi?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Inspection Timestamp</span>
              <span className="font-mono text-slate-800">{timestamp || '30-Sep-2026 12:00 IST'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Inspecting Officer</span>
              <span className="font-semibold text-slate-800">{currentMandi?.officer}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Farmer / Producer</span>
              <span className="font-bold text-slate-900">{currentBatch?.farmer}</span>
              <span className="text-slate-500 text-[11px] ml-1">({currentBatch?.village})</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Aadhaar Reference</span>
              <span className="font-mono font-medium text-slate-800">{currentBatch?.aadhaarMasked || 'XXXX-XXXX-8921'}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Procured Volume</span>
              <span className="font-bold text-slate-900">{currentBatch?.bags} Bags ({currentBatch?.quintals} Qtl)</span>
            </div>
          </div>

          {/* Quality Assessment Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 flex justify-between items-center">
              <span>Objective Vision Grading Metrics</span>
              <span className="text-[10px] font-mono text-slate-500">Method: ArUco 4-Point Homography</span>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Parameter</th>
                  <th className="px-4 py-2.5">DoCA Buffer Standard</th>
                  <th className="px-4 py-2.5">Observed Metric</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-800">Grade A Sound Bulbs (≥45mm)</td>
                  <td className="px-4 py-2 text-slate-500">Min 60.0% of lot</td>
                  <td className="px-4 py-2 font-mono font-bold text-emerald-700">{stats.gradeAPct}% ({stats.gradeACount} units)</td>
                  <td className="px-4 py-2 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {stats.gradeAPct >= 60 ? 'COMPLIANT' : 'SUB-OPTIMAL'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-800">URS Specifications (35-45mm)</td>
                  <td className="px-4 py-2 text-slate-500">Max 25.0% (15% deduction)</td>
                  <td className="px-4 py-2 font-mono font-bold text-amber-700">{stats.ursPct}% ({stats.ursCount} units)</td>
                  <td className="px-4 py-2 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {stats.ursPct <= 25 ? 'PERMISSIBLE' : 'HIGH URS'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-slate-800">Disqualified Rejections (&lt;35mm/Rot/Sprout)</td>
                  <td className="px-4 py-2 text-slate-500">Max 10.0% tolerance</td>
                  <td className="px-4 py-2 font-mono font-bold text-red-700">{stats.rejectPct}% ({stats.rejectCount} units)</td>
                  <td className="px-4 py-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      stats.rejectPct <= 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {stats.rejectPct <= 10 ? 'WITHIN LIMIT' : 'EXCEEDED'}
                    </span>
                  </td>
                </tr>
                <tr className="bg-slate-50/60 font-semibold">
                  <td className="px-4 py-2 text-slate-800">Mean Equatorial Diameter</td>
                  <td className="px-4 py-2 text-slate-500">45.0 mm – 65.0 mm</td>
                  <td className="px-4 py-2 font-mono text-slate-900">{stats.avgDiameter} mm (±{stats.stdDev} mm)</td>
                  <td className="px-4 py-2 text-right text-emerald-700 font-mono">ArUco Scaled</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cryptographic Proof & QR Code Section */}
          <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Dynamic QR Code */}
            <div className="bg-white p-2.5 rounded-lg shadow-md flex-shrink-0 flex flex-col items-center">
              <QRCodeSVG 
                value={qrData} 
                size={112} 
                level="M" 
                includeMargin={false}
              />
              <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase font-bold tracking-tighter">
                Scan to Verify DQC
              </span>
            </div>

            {/* Cryptographic Hashes & Badges */}
            <div className="flex-1 space-y-2 text-xs w-full">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200">SHA-256 Lot Integrity Digest:</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[10px] text-emerald-400 break-all select-all">
                {dqcHash || '8f4b2a9e31d4c82b09ff7c24a64bb193e22aa4d1...'}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Ed25519 Hardware Signature:</span>
                <span className="font-mono text-slate-300 font-semibold">
                  {ed25519Sig ? ed25519Sig.slice(0, 28) + '...' : 'ed25519:sig:v2...'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Signed offline on Hardware Secure Enclave (Zero Cloud Latency)</span>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 rounded-xl border-2 text-center font-bold tracking-wide text-sm ${
            stats.verdict === 'APPROVED' ? 'bg-emerald-50 border-emerald-500 text-emerald-950' :
            stats.verdict === 'CONDITIONAL' ? 'bg-amber-50 border-amber-500 text-amber-950' :
            'bg-red-50 border-red-500 text-red-950'
          }`}>
            <div className="text-base uppercase tracking-wider">
              {stats.verdict === 'APPROVED' ? 'APPROVED FOR CENTRAL BUFFER PROCUREMENT' :
               stats.verdict === 'CONDITIONAL' ? 'CONDITIONALLY APPROVED FOR BUFFER PROCUREMENT (URS TIER)' :
               'DISQUALIFIED FOR CENTRAL BUFFER PROCUREMENT'}
            </div>
            <div className="text-xs font-normal opacity-90 mt-1">
              Authorized by DoCA Officer • Valid for NAFED Warehousing & MSP Direct Payout
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 flex justify-between items-end text-xs text-slate-700 border-t border-slate-200">
            <div>
              <div className="font-mono text-[10px] text-slate-400">FARMER ACKNOWLEDGEMENT</div>
              <div className="h-8"></div>
              <div className="border-t border-slate-400 pt-1 font-semibold">{currentBatch?.farmer}</div>
            </div>
            <div className="text-center">
              <div className="w-24 h-12 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] font-mono text-slate-400">
                [OFFICIAL SEAL]
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-slate-400">AUTHORIZED MANDI INSPECTOR</div>
              <div className="h-8 flex items-center justify-end text-emerald-700 font-serif italic text-sm">
                R. V. Patil
              </div>
              <div className="border-t border-slate-400 pt-1 font-semibold">{currentMandi?.officer}</div>
            </div>
          </div>

        </div>

        {/* Modal Action Controls Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="text-xs text-slate-600 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Immutable DQC Record • Stored in Local SQLite</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Print Slip */}
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Slip</span>
            </button>

            {/* Export JSON */}
            <button
              onClick={handleExportJson}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Audit JSON</span>
            </button>

            {/* Simulate Cloud Sync */}
            <button
              onClick={handleSyncCloud}
              disabled={isSyncing || isSynced}
              className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition ${
                isSynced 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSynced ? 'Synced to DoCA Portal' : isSyncing ? 'Syncing...' : 'Sync to Central'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
