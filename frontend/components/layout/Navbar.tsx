'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Scale, Menu, X } from 'lucide-react';
import LanguageToggle from '../shared/LanguageToggle';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/situations', label: t('nav.situations') },
    { href: '/lawyers', label: t('nav.lawyers') },
    { href: '/translate', label: i18n.language === 'hi' ? 'दस्तावेज़ सरल बनाएं' : 'Simplify Document' },
    { href: '/knowledge-base', label: i18n.language === 'hi' ? 'ज्ञान भंडार' : 'Knowledge Base' },
  ];

  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  return (
    <nav style={{
      background: '#FCF5EF', borderBottom: '1px solid #EAE1DA',
      position: 'sticky', top: 0, zIndex: 50,
      fontFamily: hFont
    }}>
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#923c22', letterSpacing: '-0.3px', fontFamily: hFont }}>
            NyayaMitra <span style={{ fontWeight: 600, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>(न्यायमित्र)</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: '#3A3A3A', textDecoration: 'none', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#EAE1DA'; (e.target as HTMLElement).style.color = '#923c22'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#3A3A3A'; }}
              >{l.label}</Link>
            ))}
          </div>
          <LanguageToggle />
          <Link href="/situations" style={{ background: '#923c22', color: 'white', padding: '10px 24px', borderRadius: 24, fontSize: 14, fontWeight: 600, textDecoration: 'none', marginLeft: 16 }}>
             {isHi ? 'मदद लें' : 'Get Help'}
          </Link>
          <button onClick={() => setOpen(v => !v)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} className="mobile-menu-btn" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: '#FCF5EF', borderTop: '1px solid #EAE1DA', padding: 16 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '12px 8px', fontSize: 15, fontWeight: 500,
              color: '#3A3A3A', textDecoration: 'none', borderBottom: '1px solid #EAE1DA',
            }}>{l.label}</Link>
          ))}
          <div style={{ marginTop: 14 }}><LanguageToggle /></div>
          <Link href="/situations" onClick={() => setOpen(false)} style={{ display: 'block', marginTop: 16, textAlign: 'center', background: '#923c22', color: 'white', padding: '12px', borderRadius: 24, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            {isHi ? 'मदद लें' : 'Get Help'}
          </Link>
        </div>
      )}

      <style>{
        `@media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          nav > div > div:last-child > a { display: none; }
        }`
      }</style>
    </nav>
  );
}
