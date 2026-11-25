import React, { useState } from 'react';
import { 
  Database, 
  CloudUpload, 
  CheckCircle2, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export default function SyncQueueDrawer({ 
  queue, 
  onSyncLot, 
  onSyncAll, 
  onLoadBatchFromQueue, 
  t 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [syncingLotId, setSyncingLotId] = useState(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const pendingCount = queue.filter(item => item.status === 'pending').length;

  const handleSyncIndividual = (lotId) => {
    setSyncingLotId(lotId);
    setTimeout(() => {
      onSyncLot(lotId);
      setSyncingLotId(null);
    }, 1000);
  };

  const handleSyncAllLots = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      onSyncAll();
      setIsSyncingAll(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
      
      {/* Drawer Header Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white px-5 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-850 select-none border-b border-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Officer Audit & Edge SQLite Batch Queue</span>
              {pendingCount > 0 ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold animate-pulse">
                  {pendingCount} Pending Sync
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  All Synced
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              Offline-First Mandi Storage • Auto-resolves network dropouts via background worker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSyncAllLots();
              }}
              disabled={isSyncingAll}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Syncing Queue...' : `Sync All (${pendingCount})`}</span>
            </button>
          )}

          <div className="p-1 rounded bg-slate-800 text-slate-400">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Drawer Table Body */}
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Lot ID & Timestamp</th>
                <th className="px-4 py-3">Farmer & Village</th>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3">Grade Breakdown</th>
                <th className="px-4 py-3">Mean Size</th>
                <th className="px-4 py-3">Sync Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((lot) => {
                const isCurrentlySyncing = syncingLotId === lot.lotId || isSyncingAll;

                return (
                  <tr key={lot.lotId} className="hover:bg-slate-50/80 transition-colors">
                    {/* Lot ID */}
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-slate-900">{lot.lotId}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{lot.timestamp}</span>
                      </div>
                    </td>

                    {/* Farmer */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{lot.farmerName}</div>
                      <div className="text-[10px] text-slate-500">{lot.village}</div>
                    </td>

                    {/* Volume */}
                    <td className="px-4 py-3 font-mono">
                      <span className="font-bold text-slate-800">{lot.bags} Bags</span>
                      <span className="text-slate-400 block text-[10px]">({lot.quintals} Qtl)</span>
                    </td>

                    {/* Grade Breakdown */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold" title="Grade A %">
                          {lot.gradeAPct}% A
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold" title="URS %">
                          {lot.ursPct}% URS
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-semibold" title="Reject %">
                          {lot.rejectPct}% Rej
                        </span>
                      </div>
                    </td>

                    {/* Mean Size */}
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">
                      {lot.avgDiameterMm} mm
                    </td>

                    {/* Sync Status */}
                    <td className="px-4 py-3">
                      {lot.status === 'synced' ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Synced</span>
                          <span className="text-[9px] font-mono text-emerald-800/60 hidden lg:inline">
                            ({lot.syncTxHash?.slice(0, 10)}...)
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>Local SQLite Edge</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lot.status === 'pending' ? (
                          <button
                            onClick={() => handleSyncIndividual(lot.lotId)}
                            disabled={isCurrentlySyncing}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium flex items-center gap-1 transition disabled:opacity-50"
                          >
                            <CloudUpload className={`w-3 h-3 ${isCurrentlySyncing ? 'animate-bounce' : ''}`} />
                            <span>{isCurrentlySyncing ? 'Syncing...' : 'Sync Now'}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>DoCA Verified</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer Footer Info */}
      {isOpen && (
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Edge Database: <strong>sqlite3-wasm-v1.3</strong> (IndexedDB persistent backed)</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Total Cached Lots: {queue.length} • Mandi Buffer Session #2026-LSG
          </div>
        </div>
      )}

    </div>
  );
}
