const fs = require('fs');
const path = require('path');
function w(p, c) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, 'utf8'); console.log('Created:', p); }

// ── HOME PAGE ────────────────────────────────────────────────────────────────
w('app/page.tsx',
`'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Scale, ArrowRight, Shield, Users, BookOpen } from 'lucide-react';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const trusts = [
    { icon: <Scale size={22} color="#1a56db" />, num: t('home.trust1_num'), label: t('home.trust1_label') },
    { icon: <Shield size={22} color="#0e9f6e" />, num: t('home.trust2_num'), label: t('home.trust2_label') },
    { icon: <BookOpen size={22} color="#ff6b35" />, num: t('home.trust3_num'), label: t('home.trust3_label') },
  ];

  return (
    <div style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1a56db 100%)', minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Watermark SVG */}
        <div style={{ position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
          <Scale size={500} color="white" />
        </div>
        <div className="page-container" style={{ padding: '80px 20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0e9f6e', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Free • Bilingual • AI-Powered</span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: 'white', fontFamily: hFont }}>
              {isHi ? (
                <><span style={{ color: '#ff6b35' }}>अपना हक</span> जानिए</>
              ) : (
                <><span style={{ color: '#ff6b35' }}>Know</span> Your Rights</>
              )}
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, fontFamily: hFont }}>
              {t('home.hero_sub')}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/situations" style={{
                background: '#ff6b35', color: 'white', padding: '14px 28px', borderRadius: 10,
                fontWeight: 700, fontSize: 16, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 20px rgba(255,107,53,0.35)',
                transition: 'transform 0.2s',
              }}>
                {t('home.cta')} <ArrowRight size={18} />
              </Link>
              <Link href="/lawyers" style={{
                background: 'rgba(255,255,255,0.12)', color: 'white', padding: '14px 28px', borderRadius: 10,
                fontWeight: 600, fontSize: 16, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <Users size={18} /> Find a Lawyer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div className="page-container" style={{ padding: '32px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
            {trusts.map((tr, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderRight: i < trusts.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tr.icon}
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{tr.num}</p>
                  <p style={{ fontSize: 12, color: '#64748b', fontFamily: hFont }}>{tr.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '64px 0', background: '#f8fafc' }}>
        <div className="page-container">
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', color: '#0f172a', marginBottom: 8, fontFamily: hFont }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: '#475569', marginBottom: 48, fontSize: 15 }}>Get legal help in 4 simple steps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Select Situation', desc: 'Choose the legal issue you are facing from 7 categories', color: '#1a56db' },
              { step: '02', title: 'Know Your Rights', desc: 'Get plain-language rights explanation with verified law text', color: '#0e9f6e' },
              { step: '03', title: 'Prepare Documents', desc: 'Interactive checklist tells you exactly what to gather', color: '#ff6b35' },
              { step: '04', title: 'Take Action', desc: 'Generate documents and connect with pro bono lawyers', color: '#6d28d9' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: s.color, opacity: 0.08, position: 'absolute', top: -4, right: 12, lineHeight: 1 }}>{s.step}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, marginBottom: 14 }}>{s.step}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, #1a56db, #0e9f6e)', padding: '48px 20px' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 12, fontFamily: hFont }}>Ready to know your rights?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 28, fontSize: 15 }}>No registration required. Free for everyone.</p>
          <Link href="/situations" style={{ background: 'white', color: '#1a56db', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {t('home.cta')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
`);

// ── SITUATIONS PAGE ──────────────────────────────────────────────────────────
w('app/situations/page.tsx',
`'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SituationCard from '../../components/situations/SituationCard';
import situationsData from '../../data/situations';
import type { Situation } from '../../types';

export default function SituationsPage() {
  const { t, i18n } = useTranslation();
  const [situations, setSituations] = useState<Situation[]>(situationsData);
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/situations')
      .then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setSituations(d); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '48px 0 64px' }}>
      <div className="page-container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', marginBottom: 10, fontFamily: hFont }}>{t('situations.page_title')}</h1>
          <p style={{ fontSize: 16, color: '#475569', fontFamily: hFont }}>{t('situations.page_sub')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {situations.map(s => <SituationCard key={s.id} situation={s} />)}
        </div>
      </div>
    </div>
  );
}
`);

// ── EXPLAIN PAGE ─────────────────────────────────────────────────────────────
w('app/situations/[slug]/explain/page.tsx',
`'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft, FileText, ArrowRight } from 'lucide-react';
import DualDisplayPanel from '../../../../components/situations/DualDisplayPanel';
import DocumentChecklist from '../../../../components/situations/DocumentChecklist';
import ProcedureStepper from '../../../../components/situations/ProcedureStepper';
import ProgressStepper from '../../../../components/shared/ProgressStepper';
import situationsData from '../../../../data/situations';
import type { Situation } from '../../../../types';

export default function ExplainPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [situation, setSituation] = useState<Situation | null>(situationsData.find(s => s.id === slug) || null);
  const [tab, setTab] = useState<'rights' | 'checklist' | 'procedure' | 'help'>('rights');
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/situations/' + slug)
      .then(r => r.json()).then(d => { if (d && d.id) setSituation(d); }).catch(() => {});
  }, [slug]);

  if (!situation) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div className="skeleton" style={{ width: 200, height: 20 }} />
    </div>
  );

  const lang = i18n.language as 'en' | 'hi';
  const steps = [
    { label: 'Situations', href: '/situations', done: true, active: false },
    { label: situation.title[lang], href: '#', done: false, active: true },
    { label: 'Documents', href: '#', done: false, active: false },
    { label: 'Generate', href: '#', done: false, active: false },
  ];

  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'rights', label: t('explain.tabs.rights') },
    { key: 'checklist', label: t('explain.tabs.checklist') },
    { key: 'procedure', label: t('explain.tabs.procedure') },
    { key: 'help', label: t('explain.tabs.help') },
  ];

  return (
    <div>
      <ProgressStepper steps={steps} />
      <div style={{ padding: '32px 0 64px' }}>
        <div className="page-container">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <Link href="/situations" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#475569', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              <ArrowLeft size={14} /> {t('nav.situations')}
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, fontFamily: hFont }}>{situation.title[lang]}</span>
          </div>

          {/* Page title */}
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0f172a', marginBottom: 6, fontFamily: hFont }}>{situation.title[lang]}</h1>
          <p style={{ fontSize: 14, color: '#475569', marginBottom: 28, fontFamily: hFont }}>{situation.description[lang]}</p>

          {/* Tabs */}
          <div style={{ borderBottom: '2px solid #e2e8f0', display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 32 }}>
            {tabs.map(tb => (
              <button key={tb.key} onClick={() => setTab(tb.key)} className={\`tab-btn \${tab === tb.key ? 'active' : ''}\`} style={{ fontFamily: hFont }}>{tb.label}</button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'rights' && <DualDisplayPanel situation={situation} />}
          {tab === 'checklist' && <DocumentChecklist situation={situation} />}
          {tab === 'procedure' && <ProcedureStepper situation={situation} />}
          {tab === 'help' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={28} color="#1a56db" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', fontFamily: hFont }}>{t('explain.get_help_title')}</h2>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/lawyers" className="btn-primary">
                  <ArrowRight size={16} /> {t('explain.find_lawyer')}
                </Link>
                <Link href={\`/generate/\${situation.id}\`} className="btn-secondary">
                  <FileText size={16} /> {t('explain.generate_docs')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`);

// ── GENERATE PAGE ────────────────────────────────────────────────────────────
w('app/generate/[slug]/page.tsx',
`'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Copy, Check, FileText } from 'lucide-react';
import DocumentForm from '../../../components/generate/DocumentForm';
import DocumentPreview, { makeComplaintText, makeRTIText } from '../../../components/generate/DocumentPreview';
import { generateComplaintPDF, generateRTIPDF } from '../../../lib/pdfGenerator';
import situationsData from '../../../data/situations';
import type { DocumentFormData } from '../../../types';

const lawCitations: Record<string, string> = {
  'landlord-dispute': 'Transfer of Property Act 1882 (Section 106)',
  'consumer-complaint': 'Consumer Protection Act 2019 (Section 35)',
  'workplace-harassment': 'POSH Act 2013 (Section 4)',
  'fir-filing': 'Code of Criminal Procedure 1973 (Section 154)',
  'rti-application': 'Right to Information Act 2005 (Section 6)',
  'domestic-violence': 'Protection of Women from Domestic Violence Act 2005 (Section 12)',
  'property-dispute': 'Code of Criminal Procedure 1973 (Section 145)',
};

const docTitles: Record<string, string> = {
  'landlord-dispute': 'Complaint Letter to Local Authority',
  'consumer-complaint': 'Consumer Complaint Letter',
  'workplace-harassment': 'Workplace Harassment Complaint',
  'fir-filing': 'Complaint Letter to Police',
  'rti-application': 'RTI Application',
  'domestic-violence': 'Complaint to Protection Officer',
  'property-dispute': 'Property Encroachment Complaint',
};

const EMPTY: DocumentFormData = { name: '', address: '', phone: '', date: '', incidentDate: '', description: '', amount: '', respondentName: '', respondentAddress: '', authority: '', infoRequested: '' };

export default function GeneratePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const situation = situationsData.find(s => s.id === slug);
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<DocumentFormData>(EMPTY);
  const [copied, setCopied] = useState(false);
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const templateType = situation?.templateType || 'complaint';
  const docTitle = docTitles[slug] || 'Legal Complaint Letter';
  const lawCite = lawCitations[slug] || 'applicable law';

  const docText = templateType === 'rti'
    ? makeRTIText(fields)
    : makeComplaintText(fields, docTitle, lawCite);

  const handleChange = (key: keyof DocumentFormData, val: string) => setFields(prev => ({ ...prev, [key]: val }));

  const handleDownload = () => {
    if (templateType === 'rti') generateRTIPDF(fields);
    else generateComplaintPDF(fields, docTitle, lawCite);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!situation) return (
    <div className="page-container" style={{ padding: '48px 20px', textAlign: 'center' }}>
      <p>Situation not found. <Link href="/situations">Go back</Link></p>
    </div>
  );

  const stepLabels = [t('generate.step1'), t('generate.step2'), t('generate.step3')];

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link href={\`/situations/\${slug}/explain\`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#475569', textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to Rights
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#1a56db" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: hFont }}>{t('generate.page_title')}</h1>
              <p style={{ fontSize: 13, color: '#64748b', fontFamily: hFont }}>{docTitle}</p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {stepLabels.map((sl, i) => (
            <div key={i} style={{
              flex: 1, padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600,
              background: step === i + 1 ? '#1a56db' : step > i + 1 ? '#f0fdf4' : 'white',
              color: step === i + 1 ? 'white' : step > i + 1 ? '#0e9f6e' : '#94a3b8',
              borderRight: i < 2 ? '1px solid #e2e8f0' : 'none',
              transition: 'all 0.2s', fontFamily: hFont,
            }}>{i + 1}. {sl}</div>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: step === 3 ? '1fr' : '1fr 1fr', gap: 24 }}>
          {step < 3 ? (
            <>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20, fontFamily: hFont }}>{stepLabels[step - 1]}</h2>
                <DocumentForm fields={fields} step={step} templateType={templateType} onChange={handleChange} />
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  {step > 1 && <button className="btn-secondary" onClick={() => setStep(s => s - 1)}><ArrowLeft size={14} /> {t('generate.back')}</button>}
                  <button className="btn-primary" onClick={() => setStep(s => Math.min(3, s + 1))}>{t('generate.next')} <ArrowRight size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, height: '100%' }}>
                  <DocumentPreview fields={fields} templateType={templateType} situationTitle={docTitle} lawCitation={lawCite} />
                </div>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
                <DocumentPreview fields={fields} templateType={templateType} situationTitle={docTitle} lawCitation={lawCite} />
              </div>
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
                <DocumentPreview fields={fields} templateType={templateType} situationTitle={docTitle} lawCitation={lawCite} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: hFont }}>Download & Share</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button className="btn-primary" onClick={handleDownload} style={{ width: '100%', justifyContent: 'center' }}>
                      <Download size={15} /> {t('generate.download_pdf')}
                    </button>
                    <button className="btn-secondary" onClick={handleCopy} style={{ width: '100%', justifyContent: 'center' }}>
                      {copied ? <><Check size={15} /> {t('generate.copied')}</> : <><Copy size={15} /> {t('generate.copy')}</>}
                    </button>
                    <button className="btn-secondary" onClick={() => setStep(1)} style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                      <ArrowLeft size={14} /> Edit Details
                    </button>
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 14 }}>
                  <p style={{ fontSize: 11, color: '#78350f', lineHeight: 1.6, fontFamily: hFont }}>{t('generate.disclaimer')}</p>
                </div>
                <Link href="/lawyers" className="btn-accent" style={{ textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}>
                  Find a Pro Bono Lawyer
                </Link>
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 16, textAlign: 'center', fontFamily: hFont }}>{t('generate.disclaimer')}</p>
        )}
      </div>
    </div>
  );
}
`);

// ── LAWYERS PAGE ─────────────────────────────────────────────────────────────
w('app/lawyers/page.tsx',
`'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import LawyerCard from '../../components/lawyers/LawyerCard';
import LawyerFilters from '../../components/lawyers/LawyerFilters';
import lawyersData from '../../data/lawyers.json';
import type { Lawyer } from '../../types';

export default function LawyersPage() {
  const { t, i18n } = useTranslation();
  const [lawyers, setLawyers] = useState<Lawyer[]>(lawyersData as Lawyer[]);
  const [filters, setFilters] = useState({ city: '', area: '', lang: '', query: '' });
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/lawyers')
      .then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setLawyers(d); }).catch(() => {});
  }, []);

  const cities = [...new Set(lawyers.map(l => l.city))].sort();
  const areas = [...new Set(lawyers.flatMap(l => l.specializations))].sort();
  const langs = [...new Set(lawyers.flatMap(l => l.languages))].sort();

  const filtered = lawyers.filter(l => {
    if (filters.city && l.city !== filters.city) return false;
    if (filters.area && !l.specializations.includes(filters.area)) return false;
    if (filters.lang && !l.languages.includes(filters.lang)) return false;
    if (filters.query && !l.name.toLowerCase().includes(filters.query.toLowerCase()) && !l.organization.toLowerCase().includes(filters.query.toLowerCase())) return false;
    return true;
  });

  const onChange = (key: string, val: string) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div style={{ padding: '40px 0 64px' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="#1a56db" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', fontFamily: hFont }}>{t('lawyers.page_title')}</h1>
            <p style={{ fontSize: 14, color: '#475569', fontFamily: hFont }}>{t('lawyers.page_sub')}</p>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 28, fontFamily: hFont }}>{t('lawyers.disclaimer')}</p>

        <LawyerFilters cities={cities} areas={areas} langs={langs} city={filters.city} area={filters.area} lang={filters.lang} query={filters.query} onChange={onChange} />

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Users size={40} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 16, color: '#94a3b8', fontFamily: hFont }}>{t('lawyers.no_results')}</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Showing {filtered.length} lawyers</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {filtered.map(l => <LawyerCard key={l.id} lawyer={l} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
`);

// ── ABOUT PAGE ───────────────────────────────────────────────────────────────
w('app/about/page.tsx',
`'use client';
import { useTranslation } from 'react-i18next';
import { Scale, Shield, BookOpen, Code } from 'lucide-react';

const techStack = ['Next.js 14 (App Router)', 'TypeScript', 'Tailwind CSS', 'i18next (Hindi + English)', 'jsPDF (document generation)', 'Java + Spring Boot (backend)', 'SupaBase', 'Google Gemini Flash (AI)'];
const sources = ['IndiaCode (indiacode.nic.in)', 'NALSA (nalsa.gov.in)', 'Consumer Helpline (consumerhelpline.gov.in)', 'RTI Online (rtionline.gov.in)', 'Ministry of Law and Justice'];

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="page-container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 8, fontFamily: hFont }}>{t('about.title')}</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 48 }}>Building accessible legal aid for India</p>

        {[
          { icon: <Scale size={20} color="#1a56db" />, color: '#eff6ff', title: t('about.mission_title'), content: t('about.mission') },
          { icon: <Shield size={20} color="#0e9f6e" />, color: '#f0fdf4', title: t('about.ai_title'), content: t('about.ai_text') },
        ].map((sec, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: sec.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sec.icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: hFont }}>{sec.title}</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, fontFamily: hFont }}>{sec.content}</p>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Code size={18} color="#6d28d9" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{t('about.tech_title')}</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {techStack.map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6d28d9', flexShrink: 0 }} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BookOpen size={18} color="#ff6b35" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{t('about.sources_title')}</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sources.map(s => (
                <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6b35', flexShrink: 0 }} /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a56db, #6d28d9)', borderRadius: 14, padding: 28, color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: hFont }}>{t('about.team_title')}</h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.7, fontFamily: hFont }}>{t('about.team_text')}</p>
        </div>
      </div>
    </div>
  );
}
`);

// ── API ROUTES ───────────────────────────────────────────────────────────────
w('app/api/explain/route.ts',
`import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { situation_slug, language } = await req.json();
  try {
    const url = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/ai/explain';
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ situation_slug, language }) });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
  }
}
`);

w('app/api/generate-document/route.ts',
`import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { template_type, fields, language } = await req.json();
  try {
    const url = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/documents/generate';
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateType: template_type, fields, language }) });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Document generation unavailable' }, { status: 503 });
  }
}
`);

console.log('BATCH 7 DONE');
