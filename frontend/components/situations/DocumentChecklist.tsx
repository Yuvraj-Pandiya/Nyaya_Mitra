'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Square, Download, AlertCircle } from 'lucide-react';
import { generateChecklistPDF } from '../../lib/pdfGenerator';
import type { Situation } from '../../types';

export default function DocumentChecklist({ situation, onCompleteChange }: { situation: Situation; onCompleteChange?: (done: boolean) => void }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const isHi = lang === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';
  const key = `checklist_${situation.id}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const checkCompletion = (items: Record<string, boolean>) => {
    const required = (situation.checklist || []).filter(i => i.required);
    if (required.length === 0) return true;
    return required.every(i => items[i.id]);
  };

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      setChecked(parsed);
      onCompleteChange?.(checkCompletion(parsed));
    } else {
      onCompleteChange?.(checkCompletion({}));
    }
  }, [key]);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(key, JSON.stringify(next));
    onCompleteChange?.(checkCompletion(next));
  };

  const done = (situation.checklist || []).filter(i => checked[i.id]).length;
  const total = situation.checklist?.length || 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', fontFamily: hFont }}>
          {t('explain.checklist_title')}
        </h2>
        <button
          onClick={() => generateChecklistPDF((situation.checklist || []).map(i => ({ ...i, checked: !!checked[i.id] })), situation.title.en)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'white', color: '#923c22', border: '1.5px solid #EAE1DA',
            padding: '8px 16px', borderRadius: 24, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: hFont,
          }}
        >
          <Download size={14} /> {t('explain.download_checklist')}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        background: 'linear-gradient(135deg, #FAF4EE, #EAE1DA)',
        border: '1px solid #EAE1DA', borderRadius: 12, padding: '14px 18px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#923c22', fontFamily: hFont }}>
            {t('explain.progress', { done, total })}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: pct === 100 ? '#455B3C' : '#6A564A' }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: 8, background: '#EAE1DA', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: pct === 100 ? '#455B3C' : '#923c22',
            borderRadius: 4,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(situation.checklist || []).map(item => (
          <div
            key={item.id}
            onClick={() => toggle(item.id)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
              background: checked[item.id] ? '#E0ECD6' : 'white',
              border: `1.5px solid ${checked[item.id] ? '#C6D9BA' : '#EAE1DA'}`,
              borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ marginTop: 1, color: checked[item.id] ? '#455B3C' : '#A0A0A0', flexShrink: 0 }}>
              {checked[item.id] ? <CheckSquare size={20} /> : <Square size={20} />}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', fontFamily: hFont, lineHeight: 1.4, margin: 0 }}>
                {item.item[lang]}
              </p>
              {item.required && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#dc2626', marginTop: 4 }}>
                  <AlertCircle size={10} /> {t('common.required')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
