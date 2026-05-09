'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Home, ShoppingBag, Briefcase, Shield, FileText, HeartHandshake, Landmark, ChevronRight } from 'lucide-react';
import type { Situation } from '../../types';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Home, ShoppingBag, Briefcase, Shield, FileText, HeartHandshake, Landmark,
};

// All category colors now use NyayaMitra earthen palette
const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  Housing:          { bg: '#FAF4EE', text: '#923c22', border: '#EAE1DA' },
  'Consumer Rights':{ bg: '#E0ECD6', text: '#455B3C', border: '#C6D9BA' },
  Employment:       { bg: '#FEF9EC', text: '#92400e', border: '#F5E0A0' },
  Criminal:         { bg: '#FEF2F2', text: '#dc2626', border: '#fecaca' },
  Government:       { bg: '#F5F3FF', text: '#6d28d9', border: '#ddd6fe' },
  Family:           { bg: '#FDF2F8', text: '#9d174d', border: '#fbcfe8' },
  Property:         { bg: '#FFF7ED', text: '#c2410c', border: '#fed7aa' },
};

export default function SituationCard({ situation }: { situation: Situation }) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const isHi = lang === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';
  const Icon = iconMap[situation.icon] || Home;
  const colors = colorMap[situation.category] || colorMap.Housing;

  return (
    <Link href={`/situations/${situation.id}/explain`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 22,
        border: '1px solid #EAE1DA', cursor: 'pointer',
        height: '100%', display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'box-shadow 0.2s, transform 0.15s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(146,60,34,0.12)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Icon + Category */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            background: colors.bg, border: `1px solid ${colors.border}`,
            borderRadius: 12, width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={22} color={colors.text} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
              background: colors.bg, color: colors.text,
              padding: '3px 10px', borderRadius: 20, display: 'inline-block',
              marginBottom: 6, textTransform: 'uppercase',
            }}>
              {situation.category}
            </span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginTop: 2, lineHeight: 1.3, fontFamily: hFont }}>
              {situation.title[lang]}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: '#6A564A', lineHeight: 1.6, flex: 1, fontFamily: hFont, margin: 0 }}>
          {situation.description[lang]}
        </p>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#A0A0A0', fontFamily: hFont }}>
            {isHi 
              ? `${situation?.checklist?.length || 0} दस्तावेज़ आवश्यक` 
              : `${situation?.checklist?.length || 0} documents needed`}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors?.text || '#923c22', fontSize: 13, fontWeight: 700, fontFamily: hFont }}>
            {isHi ? 'अधिकार देखें' : 'View Rights'} <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
