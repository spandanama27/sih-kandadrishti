import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import CanvasStudio from './components/CanvasStudio';
import AnalyticsPanel from './components/AnalyticsPanel';
import OnionDetailModal from './components/OnionDetailModal';
import DqcModal from './components/DqcModal';
import SyncQueueDrawer from './components/SyncQueueDrawer';
import HelpModal from './components/HelpModal';
import WebcamModal from './components/WebcamModal';

import { MANDI_CENTERS, PRESET_BATCHES, INITIAL_OFFLINE_QUEUE } from './data/mockBatches';
import { TRANSLATIONS } from './data/translations';
import { computeBatchStats } from './utils/geometry';

export default function App() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [currentMandi, setCurrentMandi] = useState(MANDI_CENTERS[0]);
  const [currentBatch, setCurrentBatch] = useState(PRESET_BATCHES[0]);
  const [selectedOnion, setSelectedOnion] = useState(null);
  const [queue, setQueue] = useState(INITIAL_OFFLINE_QUEUE);

  // Modals
  const [dqcModalOpen, setDqcModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [webcamModalOpen, setWebcamModalOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Text-to-Speech Voice Feedback
  const speakVoice = useCallback((text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (lang === 'mr') {
        utterance.lang = 'mr-IN';
      } else if (lang === 'hi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, [voiceEnabled, lang]);

  // Handle Preset Selection
  const handleSelectPreset = (presetId) => {
    const found = PRESET_BATCHES.find(b => b.id === presetId);
    if (found) {
      setCurrentBatch(found);
      setSelectedOnion(null);
      const stats = computeBatchStats(found.onions);
      if (lang === 'mr') {
        speakVoice(`नमुना बॅच निवडली. ग्रेड अ प्रमाण ${stats.gradeAPct} टक्के.`);
      } else if (lang === 'hi') {
        speakVoice(`नमूना बैच चुना गया। ग्रेड ए अनुपात ${stats.gradeAPct} प्रतिशत।`);
      } else {
        speakVoice(`Batch loaded. Grade A sound ratio is ${stats.gradeAPct} percent.`);
      }
    }
  };

  // Handle Custom Upload
  const handleUploadCustom = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generate a fresh interactive batch inspired by uploaded sample
    const newLotId = `LOT-2026-UPL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOnions = [];
    const count = 26;

    for (let i = 1; i <= count; i++) {
      const col = (i - 1) % 5;
      const row = Math.floor((i - 1) / 5);
      const x = 80 + col * 78 + (Math.random() * 16 - 8);
      const y = 75 + row * 68 + (Math.random() * 16 - 8);

      const roll = Math.random();
      let diamX, diamY, defect = 'none', rot = 0, sprout = 0, sproutLengthMm = 0, defectPct = 0;

      if (roll < 0.65) {
        // Grade A
        diamX = 46.0 + Math.random() * 16.0;
        diamY = diamX - (Math.random() * 3.5);
      } else if (roll < 0.88) {
        // URS
        diamX = 36.0 + Math.random() * 8.5;
        diamY = diamX - (Math.random() * 2.5);
        if (Math.random() > 0.6) {
          defect = 'cut';
          defectPct = 3.5;
        }
      } else {
        // Reject
        if (Math.random() > 0.5) {
          diamX = 29.0 + Math.random() * 5.0; // Under 35mm
          diamY = diamX - 1;
        } else if (Math.random() > 0.5) {
          diamX = 45.0 + Math.random() * 10.0;
          diamY = diamX;
          defect = 'mould';
          rot = 1;
          defectPct = 14.0;
        } else {
          diamX = 44.0 + Math.random() * 8.0;
          diamY = diamX;
          sprout = 1;
          sproutLengthMm = 7.5;
        }
      }

      newOnions.push({
        id: i,
        x,
        y,
        diamX: Number(diamX.toFixed(1)),
        diamY: Number(diamY.toFixed(1)),
        defect,
        rot,
        sprout,
        sproutLengthMm,
        defectPct,
        skinColor: Math.random() > 0.5 ? '#9a3412' : '#b45309'
      });
    }

    const uploadedBatch = {
      id: newLotId,
      name: `Custom Lot (${file.name.slice(0, 16)})`,
      farmer: 'Shantaram Bhikaji Pund',
      village: 'Chandwad, Nashik',
      aadhaarMasked: 'XXXX-XXXX-9904',
      cropType: 'Rabi Late Kharif',
      bags: 75,
      quintals: 37.5,
      trayDimensionsMm: { width: 500, height: 400 },
      arucoMarkerSizeMm: 45.0,
      note: 'Custom uploaded lot image scanned and mapped onto ArUco homography grid.',
      onions: newOnions
    };

    setCurrentBatch(uploadedBatch);
    setSelectedOnion(null);

    // Also add to local SQLite queue as pending
    const stats = computeBatchStats(newOnions);
    setQueue(prev => [
      {
        lotId: newLotId,
        farmerName: uploadedBatch.farmer,
        village: uploadedBatch.village,
        bags: uploadedBatch.bags,
        quintals: uploadedBatch.quintals,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        gradeAPct: stats.gradeAPct,
        ursPct: stats.ursPct,
        rejectPct: stats.rejectPct,
        avgDiameterMm: stats.avgDiameter,
        status: 'pending',
        syncTxHash: null,
        dqcHash: '0x' + Math.floor(Math.random() * 0xFFFFFFFFFFFFF).toString(16)
      },
      ...prev
    ]);

    speakVoice('Custom sample image uploaded and calibrated successfully.');
  };

  // Handle Webcam Capture
  const handleCaptureAndAnalyze = () => {
    // Switch to a dynamic batch
    handleSelectPreset('BATCH-2026-A4');
    speakVoice('Camera frame captured. All corner ArUco markers locked.');
  };

  // Generate DQC trigger
  const handleGenerateDqc = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const stats = computeBatchStats(currentBatch.onions);
    if (stats.verdict === 'APPROVED') {
      speakVoice('Quality certificate generated. Batch approved for Central Buffer Procurement.');
    } else {
      speakVoice('Quality certificate generated with conditional specification.');
    }

    setDqcModalOpen(true);
  };

  // Sync individual lot in queue
  const handleSyncLot = (lotId) => {
    setQueue(prev => prev.map(item => {
      if (item.lotId === lotId) {
        return {
          ...item,
          status: 'synced',
          syncTxHash: '0xDOCA_' + Math.floor(Math.random() * 0xFFFFFFF).toString(16).toUpperCase()
        };
      }
      return item;
    }));
  };

  // Sync all pending lots
  const handleSyncAll = () => {
    setQueue(prev => prev.map(item => ({
      ...item,
      status: 'synced',
      syncTxHash: item.syncTxHash || ('0xDOCA_' + Math.floor(Math.random() * 0xFFFFFFF).toString(16).toUpperCase())
    })));
    speakVoice('All offline batches synced to Central DoCA Portal.');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-600 selection:text-white">
      
      {/* Top Navigation & Geofence Status Bar */}
      <Header
        currentMandi={currentMandi}
        setCurrentMandi={setCurrentMandi}
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenHelp={() => setHelpModalOpen(true)}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
      />

      {/* Main Viewport Container */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 py-4 flex-1 w-full space-y-4">
        
        {/* Main 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Pane: Interactive Inspection Canvas Studio (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <CanvasStudio
              currentBatch={currentBatch}
              selectedOnion={selectedOnion}
              setSelectedOnion={setSelectedOnion}
              onSelectPreset={handleSelectPreset}
              onUploadCustom={handleUploadCustom}
              onTriggerWebcam={() => setWebcamModalOpen(true)}
              t={t}
            />
          </div>

          {/* Right Pane: Real-Time Analytics & Grading Engine (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <AnalyticsPanel
              currentBatch={currentBatch}
              onGenerateDqc={handleGenerateDqc}
              t={t}
            />
          </div>

        </div>

        {/* Bottom Drawer: Officer Audit & Offline Batch Sync Queue */}
        <div className="w-full">
          <SyncQueueDrawer
            queue={queue}
            onSyncLot={handleSyncLot}
            onSyncAll={handleSyncAll}
            onLoadBatchFromQueue={(lotId) => {}}
            t={t}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-3 px-6 text-center font-mono">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            कांदा-दृष्टि (KandaDrishti AI) • Smart India Hackathon 2026 Prototype • Dept. of Consumer Affairs (DoCA)
          </div>
          <div className="text-[11px] text-slate-500">
            Complies with NAFED/NCCF Rabi Buffer Procurement Standards (FAQ 2026 Revision)
          </div>
        </div>
      </footer>

      {/* Micro-Modal: Individual Onion Detail Inspector */}
      {selectedOnion && (
        <OnionDetailModal
          onion={selectedOnion}
          onClose={() => setSelectedOnion(null)}
        />
      )}

      {/* Official Government DQC Certificate Modal */}
      {dqcModalOpen && (
        <DqcModal
          currentBatch={currentBatch}
          currentMandi={currentMandi}
          onClose={() => setDqcModalOpen(false)}
          onSyncBatchToCentral={(newSyncedItem) => {
            setQueue(prev => [newSyncedItem, ...prev.filter(x => x.lotId !== newSyncedItem.lotId)]);
          }}
        />
      )}

      {/* DoCA Standards & Architecture Guide */}
      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      {/* Webcam Simulation Modal */}
      <WebcamModal
        isOpen={webcamModalOpen}
        onClose={() => setWebcamModalOpen(false)}
        onCaptureAndAnalyze={handleCaptureAndAnalyze}
      />

    </div>
  );
}
