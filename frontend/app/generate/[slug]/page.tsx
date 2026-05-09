'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Copy, Check, Scale } from 'lucide-react';
import DocumentForm from '../../../components/generate/DocumentForm';
import DocumentPreview, { makeComplaintText, makeRTIText, makeFIRText, makeConsumerText } from '../../../components/generate/DocumentPreview';
import { generateComplaintPDF, generateRTIPDF, generateFIRDraftPDF, generateConsumerComplaintPDF } from '../../../lib/pdfGenerator';
import ProgressStepper from '../../../components/shared/ProgressStepper';
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
  'labor-rights': 'Minimum Wages Act 1948 (Section 3), Payment of Wages Act 1936 (Section 5)',
};

const docTitles: Record<string, { en: string; hi: string }> = {
  'landlord-dispute':     { en: 'Complaint Letter to Local Authority',       hi: 'स्थानीय प्राधिकरण को शिकायत पत्र' },
  'consumer-complaint':   { en: 'Consumer Complaint Letter',                  hi: 'उपभोक्ता शिकायत पत्र' },
  'workplace-harassment': { en: 'Workplace Harassment Complaint',             hi: 'कार्यस्थल उत्पीड़न शिकायत' },
  'fir-filing':           { en: 'FIR Draft / Police Complaint',               hi: 'FIR मसौदा / पुलिस शिकायत' },
  'rti-application':      { en: 'RTI Application',                            hi: 'सूचना का अधिकार आवेदन' },
  'domestic-violence':    { en: 'Complaint to Protection Officer',            hi: 'संरक्षण अधिकारी को शिकायत' },
  'property-dispute':     { en: 'Property Encroachment Complaint',            hi: 'संपत्ति अतिक्रमण शिकायत' },
  'labor-rights':         { en: 'Wage / Labour Rights Complaint',             hi: 'वेतन / श्रम अधिकार शिकायत' },
};

const EMPTY: DocumentFormData = { 
  name: '', address: '', phone: '', date: '', incidentDate: '', description: '', 
  amount: '', respondentName: '', respondentAddress: '', authority: '', infoRequested: '',
  incidentTime: '', incidentLocation: '', accusedNames: '', witnessNames: '', evidenceList: '', complainantId: ''
};

export default function GeneratePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const situation = situationsData.find(s => s.id === slug);
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<DocumentFormData>(EMPTY);
  const [copied, setCopied] = useState(false);
  const lang = i18n.language as 'en' | 'hi';
  const isHi = lang === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';
  const templateType = situation?.templateType || 'complaint';

  const docTitleObj = docTitles[slug] ?? { en: 'Legal Complaint Letter', hi: 'कानूनी शिकायत पत्र' };
  const docTitle = docTitleObj[lang];
  const lawCite = lawCitations[slug] || 'applicable law';

  const stepLabels = [
    isHi ? 'व्यक्तिगत विवरण' : t('generate.step1'),
    isHi ? 'घटना विवरण'       : t('generate.step2'),
    isHi ? 'पूर्वावलोकन'       : t('generate.step3'),
  ];

  const docText = templateType === 'rti'
    ? makeRTIText(fields)
    : templateType === 'fir'
    ? makeFIRText(fields)
    : templateType === 'consumer'
    ? makeConsumerText(fields)
    : makeComplaintText(fields, docTitle, lawCite);

  const handleChange = (key: keyof DocumentFormData, val: string) =>
    setFields(prev => ({ ...prev, [key]: val }));

  const handleDownload = () => {
    if (templateType === 'rti') {
      generateRTIPDF(fields);
    } else if (templateType === 'fir') {
      generateFIRDraftPDF(fields);
    } else if (templateType === 'consumer') {
      generateConsumerComplaintPDF(fields);
    } else {
      generateComplaintPDF(fields, docTitle, lawCite);
    }
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

  const steps = [
    { label: isHi ? 'स्थितियां' : 'Situations',      href: '/situations',              done: true,  active: false },
    { label: situation.title[lang],                   href: `/situations/${slug}/explain`, done: true,  active: false },
    { label: isHi ? 'जरूरी दस्तावेज़' : 'Checklist', href: `/situations/${slug}/explain`, done: true,  active: false },
    { label: isHi ? 'दस्तावेज़ बनाएं' : 'Generate',  href: '#',                        done: false, active: true  },
  ];

  // ── Shared earthen button styles ──────────────────────────────────────────
  const btnPrimary: React.CSSProperties = {
    background: '#923c22', color: 'white', border: 'none',
    padding: '10px 22px', borderRadius: 24, fontWeight: 700, fontSize: 14,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    gap: 8, fontFamily: hFont,
  };
  const btnSecondary: React.CSSProperties = {
    background: 'white', color: '#923c22', border: '1.5px solid #EAE1DA',
    padding: '10px 22px', borderRadius: 24, fontWeight: 600, fontSize: 14,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    gap: 8, fontFamily: hFont,
  };

  return (
    <div style={{ background: '#FCF5EF', minHeight: '100vh' }}>
      <ProgressStepper steps={steps} />

      <div style={{ padding: '32px 0 64px' }}>
        <div className="page-container">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <Link href={`/situations/${slug}/explain`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#923c22', textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16,
            }}>
              <ArrowLeft size={14} /> {isHi ? 'अधिकारों पर वापस जाएं' : 'Back to Rights'}
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EAE1DA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale size={22} color="#923c22" />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', fontFamily: hFont }}>
                  {isHi ? 'दस्तावेज़ बनाएं' : t('generate.page_title')}
                </h1>
                <p style={{ fontSize: 13, color: '#6A564A', fontFamily: hFont }}>{docTitle}</p>
              </div>
            </div>
          </div>

          {/* ── Step indicator ──────────────────────────────────────────── */}
          <div style={{
            display: 'flex', marginBottom: 32,
            background: 'white', border: '1px solid #EAE1DA', borderRadius: 12,
            overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            {stepLabels.map((sl, i) => (
              <div key={i} style={{
                flex: 1, padding: '14px 16px', textAlign: 'center',
                fontSize: 13, fontWeight: 600, fontFamily: hFont,
                background: step === i + 1 ? '#923c22' : step > i + 1 ? '#E0ECD6' : 'white',
                color:      step === i + 1 ? 'white'   : step > i + 1 ? '#455B3C' : '#A0A0A0',
                borderRight: i < 2 ? '1px solid #EAE1DA' : 'none',
                transition: 'all 0.25s',
              }}>
                {i + 1}. {sl}
              </div>
            ))}
          </div>

          {/* ── Form + Preview ──────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: step === 3 ? '1fr' : '1fr 1fr', gap: 24 }}>
            {step < 3 ? (
              <>
                {/* Left: form */}
                <div style={{ background: 'white', border: '1px solid #EAE1DA', borderRadius: 16, padding: 28 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 20, fontFamily: hFont, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#923c22', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>
                      {step}
                    </span>
                    {stepLabels[step - 1]}
                  </h2>
                  <DocumentForm fields={fields} step={step} templateType={templateType} onChange={handleChange} />
                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    {step > 1 && (
                      <button style={btnSecondary} onClick={() => setStep(s => s - 1)}>
                        <ArrowLeft size={14} /> {isHi ? 'वापस' : t('generate.back')}
                      </button>
                    )}
                    <button style={btnPrimary} onClick={() => setStep(s => Math.min(3, s + 1))}>
                      {isHi ? 'आगला' : t('generate.next')} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right: preview */}
                <div style={{ background: 'white', border: '1px solid #EAE1DA', borderRadius: 16, padding: 28 }}>
                  <DocumentPreview fields={fields} templateType={templateType} situationTitle={docTitle} lawCitation={lawCite} />
                </div>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                {/* Full preview */}
                <div style={{ background: 'white', border: '1px solid #EAE1DA', borderRadius: 16, padding: 28 }}>
                  <DocumentPreview fields={fields} templateType={templateType} situationTitle={docTitle} lawCitation={lawCite} />
                </div>

                {/* Action panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: 'white', border: '1px solid #EAE1DA', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: hFont, color: '#1A1A1A' }}>
                      {isHi ? 'डाउनलोड और शेयर' : 'Download & Share'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button style={{ ...btnPrimary, width: '100%', justifyContent: 'center' }} onClick={handleDownload}>
                        <Download size={15} />
                        {isHi ? 'PDF डाउनलोड करें' : t('generate.download_pdf')}
                      </button>
                      <button style={{ ...btnSecondary, width: '100%', justifyContent: 'center' }} onClick={handleCopy}>
                        {copied
                          ? <><Check size={15} /> {isHi ? 'कॉपी हो गया!' : t('generate.copied')}</>
                          : <><Copy size={15} /> {isHi ? 'क्लिपबोर्ड पर कॉपी करें' : t('generate.copy')}</>}
                      </button>
                      <button style={{ ...btnSecondary, width: '100%', justifyContent: 'center', fontSize: 12 }} onClick={() => setStep(1)}>
                        <ArrowLeft size={14} /> {isHi ? 'विवरण संपादित करें' : 'Edit Details'}
                      </button>
                    </div>
                  </div>

                  <div style={{ background: '#FCF5EF', border: '1px solid #EAE1DA', borderRadius: 12, padding: 14 }}>
                    <p style={{ fontSize: 11, color: '#6A564A', lineHeight: 1.6, fontFamily: hFont }}>
                      {isHi
                        ? 'यह एक टेम्पलेट है। जमा करने से पहले समीक्षा करें। यह कानूनी सलाह नहीं है।'
                        : t('generate.disclaimer')}
                    </p>
                  </div>

                  <Link href="/lawyers" style={{
                    background: '#455B3C', color: 'white', border: 'none',
                    padding: '12px 20px', borderRadius: 24, fontWeight: 700,
                    fontSize: 14, textDecoration: 'none', textAlign: 'center',
                    display: 'block', fontFamily: hFont,
                  }}>
                    {isHi ? 'निःशुल्क वकील खोजें' : 'Find a Pro Bono Lawyer'}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {step < 3 && (
            <p style={{ fontSize: 11, color: '#A0A0A0', marginTop: 16, textAlign: 'center', fontFamily: hFont }}>
              {isHi ? 'यह एक टेम्पलेट है। जमा करने से पहले समीक्षा करें।' : t('generate.disclaimer')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
