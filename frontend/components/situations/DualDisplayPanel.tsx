'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Check, Sparkles, Target, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Situation } from '../../types';

export default function DualDisplayPanel({ situation }: { situation: Situation }) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const isHi = lang === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: situation.id, lang }),
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { if (!data || data.error) throw new Error(); setAiData(data); setLoading(false); })
      .catch(() => {
        setAiData({
          summary: situation.description[lang],
          rights: situation.rights.map((r: any) => r.title[lang] + ': ' + r.description[lang]),
          what_you_can_do: situation.steps.map((s: any) => s.title[lang]),
          disclaimer: isHi
            ? 'यह कानूनी जानकारी है, कानूनी सलाह नहीं (स्थिर बैकअप)।'
            : 'This is legal information, not legal advice (Static Backup).',
        });
        setLoading(false);
      });
  }, [situation, lang, isHi]);

  return (
    <div className="w-full flex flex-col bg-white border-t border-[#EAE1DA] -mx-5">
      <div className="flex flex-wrap">

        {/* ── Left: Original Legal Text ──────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-w-[320px] bg-[#FAF4EE]/80 p-10 border-r border-[#EAE1DA] relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          
          <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-[#EAE1DA] rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#6A564A] mb-7 shadow-sm relative z-10">
            <Scale size={14} className="text-[#923c22]" /> {isHi ? 'मूल कानूनी पाठ' : 'Original Legal Text'}
          </div>

          <div className="flex flex-col gap-8 relative z-10">
            {situation.laws.map((law, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
                className="group"
              >
                <h3 className="text-xl font-bold text-[#923c22] mb-1.5 font-serif group-hover:translate-x-1 transition-transform">
                  {law.section}, {law.act}
                </h3>
                <p className="text-sm text-[#6A564A] mb-4 italic opacity-80">{law.summary[lang]}</p>
                <div className="text-[14px] text-[#3A3A3A] leading-[1.8] font-serif whitespace-pre-wrap glass-card p-6 rounded-xl border border-[#EAE1DA] shadow-sm group-hover:shadow-md transition-shadow">
                  {law.fullText}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: AI Plain Translation ────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-w-[320px] bg-white p-10 relative overflow-hidden"
        >
          {/* Subtle Background Accent */}
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -ml-36 -mb-36 pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 bg-[#E0ECD6]/80 backdrop-blur-sm border border-[#C6D9BA] rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#455B3C] mb-7 shadow-sm relative z-10">
            <Sparkles size={14} className="text-[#455B3C] animate-pulse" />
            {isHi ? 'AI द्वारा सरल अनुवाद' : 'AI Plain Translation'}
          </div>

          <h2 className="text-2xl font-extrabold text-[#1A1A1A] mb-2 relative z-10" style={{ fontFamily: hFont }}>
            {isHi ? 'आपके लिए इसका क्या अर्थ है' : 'What this means for you'}
          </h2>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 mt-10 relative z-10"
              >
                <div className="space-y-3">
                  <div className="h-6 w-full bg-slate-100/80 animate-pulse rounded-lg" />
                  <div className="h-6 w-[85%] bg-slate-100/80 animate-pulse rounded-lg" />
                  <div className="h-6 w-[92%] bg-slate-100/80 animate-pulse rounded-lg" />
                </div>
                <div className="flex items-center gap-3 mt-4 text-[#923c22]">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <p className="text-[14px] font-medium italic" style={{ fontFamily: hFont }}>
                    {isHi ? 'NyayaMitra AI आपके अधिकारों का विश्लेषण कर रहा है...' : 'NyayaMitra AI is analyzing your rights...'}
                  </p>
                </div>
              </motion.div>
            ) : aiData ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-8 mt-6 relative z-10"
              >

                {/* Summary */}
                <motion.div 
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="bg-[#FAF4EE] p-5 rounded-2xl border-l-4 border-[#923c22] shadow-sm transition-all hover:shadow-md"
                >
                  <p className="text-[16px] text-[#1A1A1A] leading-[1.6] font-semibold" style={{ fontFamily: hFont }}>{aiData.summary}</p>
                </motion.div>

                {/* Rights */}
                <div className="flex flex-col gap-6">
                  {aiData.rights.map((right: string, i: number) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, ease: "easeOut" }}
                      whileHover={{ x: 5 }}
                      className="flex gap-4 items-start group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#E0ECD6] text-[#455B3C] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <p className="text-[15px] text-[#3A3A3A] leading-[1.6] pt-1" style={{ fontFamily: hFont }}>{right}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Key Protection */}
                {aiData.key_protection && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#FFF9EC] p-5 rounded-2xl border border-[#F5E0A0] shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <ShieldCheck size={48} />
                    </div>
                    <p className="text-sm font-bold text-[#b45309] mb-2 flex items-center gap-2">
                      <ShieldCheck size={18} /> {isHi ? 'मुख्य कानूनी सुरक्षा' : 'Key Protection'}
                    </p>
                    <p className="text-[15px] text-[#78350f] leading-[1.6] font-medium" style={{ fontFamily: hFont }}>
                      {aiData.key_protection}
                    </p>
                  </motion.div>
                )}

                {/* What you can do */}
                {aiData.what_you_can_do && aiData.what_you_can_do.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm"
                  >
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2" style={{ fontFamily: hFont }}>
                      <Info size={20} className="text-[#923c22]" />
                      {isHi ? 'आप क्या कर सकते हैं' : 'What you can do next'}
                    </h3>
                    <div className="flex flex-col gap-4">
                      {aiData.what_you_can_do.map((action: string, idx: number) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          whileHover={{ x: 8, color: "#923c22" }}
                          className="flex gap-3 items-start text-[15px] text-[#4A4A4A] cursor-default transition-colors" 
                          style={{ fontFamily: hFont }}
                        >
                          <ArrowRight size={18} className="text-[#923c22] flex-shrink-0 mt-0.5" />
                          {action}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Disclaimer */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1 }}
                  className="text-[12px] text-[#A0A0A0] italic mt-4 font-medium border-t border-[#EAE1DA] pt-5" 
                  style={{ fontFamily: hFont }}
                >
                  {aiData.disclaimer}
                </motion.p>
              </motion.div>
            ) : (
              <p className="text-sm text-red-600 mt-10">
                {isHi ? 'एआई को लोड करने में विफल। कृपया पृष्ठ को रीफ्रेश करें।' : 'Failed to load AI explanation. Please check your connection or try again.'}
              </p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
