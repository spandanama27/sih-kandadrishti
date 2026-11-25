import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  WifiOff, 
  Clock, 
  Building2, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Languages, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { MANDI_CENTERS } from '../data/mockBatches';

export default function Header({ 
  currentMandi, 
  setCurrentMandi, 
  lang, 
  setLang, 
  t, 
  onOpenHelp, 
  voiceEnabled, 
  setVoiceEnabled 
}) {
  const [timeStr, setTimeStr] = useState('');
  const [mandiDropdownOpen, setMandiDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-IN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setTimeStr(`${formatted}.${ms} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-white shadow-xl border-b border-slate-800 sticky top-0 z-40">
      {/* Tiranga National Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 flex">
        <div className="w-1/3 bg-amber-500"></div>
        <div className="w-1/3 bg-slate-100"></div>
        <div className="w-1/3 bg-emerald-600"></div>
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Brand & Ministry Seal */}
          <div className="flex items-center gap-3.5">
            {/* National Crest / AI Lens Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-500 via-emerald-700 to-slate-900 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center relative overflow-hidden">
                  <span className="text-xl">🧅</span>
                  <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>{t.appTitle}</span>
                  <span className="text-slate-400 font-light">|</span>
                  <span className="text-emerald-400 font-mono tracking-wide">{t.appName}</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-sm">
                  DoCA • NAFED
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-950/70 text-blue-300 border border-blue-800/60">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium line-clamp-1 max-w-xl">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Right Status Badges & Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            
            {/* Mandi Geofence Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMandiDropdownOpen(!mandiDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all text-left"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-[11px] leading-tight text-emerald-300">
                    {lang === 'mr' ? currentMandi.nameMr : lang === 'hi' ? currentMandi.nameHi : currentMandi.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {currentMandi.lat}°N, {currentMandi.lng}°E • {currentMandi.elevation}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
              </button>

              {mandiDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider border-b border-slate-750">
                    Switch Mandi Buffer Center
                  </div>
                  {MANDI_CENTERS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCurrentMandi(m);
                        setMandiDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700 transition ${
                        m.id === currentMandi.id ? 'bg-slate-700/70 text-emerald-300 font-medium' : 'text-slate-200'
                      }`}
                    >
                      <div>
                        <div>{lang === 'mr' ? m.nameMr : lang === 'hi' ? m.nameHi : m.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Quota: {m.bufferQuota}</div>
                      </div>
                      {m.id === currentMandi.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Offline SQLite Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 font-medium shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] hidden sm:inline">Edge SQLite Active</span>
              <span className="text-[9px] bg-emerald-500/20 px-1 py-0.2 rounded text-emerald-200 uppercase font-mono">100% Offline</span>
            </div>

            {/* NTP Clock */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeStr || '12:00:00.000 IST'}</span>
            </div>

            {/* Voice Audio Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              title={voiceEnabled ? 'Mute Mandi Voice Feedback' : 'Enable Mandi Voice Feedback'}
              className={`p-1.5 rounded-md border transition ${
                voiceEnabled 
                  ? 'bg-emerald-900/40 border-emerald-600 text-emerald-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-md border border-slate-700 p-0.5">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('mr')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  lang === 'mr' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="मराठी (Maharashtra APMC)"
              >
                मराठी
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  lang === 'hi' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="हिंदी"
              >
                हिंदी
              </button>
            </div>

            {/* Help / Standards Guide Modal Button */}
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition text-[11px]"
              title="DoCA Buffer Standards & Architecture"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">DoCA Specs</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
