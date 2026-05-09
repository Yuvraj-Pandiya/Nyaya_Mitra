'use client';
import { useTranslation } from 'react-i18next';
import { Scale, Shield, BookOpen, Code } from 'lucide-react';

const techStack = ['Next.js 14 (App Router)', 'TypeScript', 'i18next (Hindi + English)', 'jsPDF (document generation)', 'Java + Spring Boot (backend)', 'MongoDB Atlas', 'Google Gemini Flash (AI)', '@react-google-maps/api'];
const sources = ['IndiaCode (indiacode.nic.in)', 'NALSA (nalsa.gov.in)', 'Consumer Helpline (consumerhelpline.gov.in)', 'RTI Online (rtionline.gov.in)', 'Ministry of Law and Justice'];

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  return (
    <div style={{ padding: '48px 0 80px', background: '#FCF5EF', minHeight: '100vh' }}>
      <div className="page-container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#923c22', marginBottom: 8, fontFamily: hFont }}>{t('about.title')}</h1>
        <p style={{ fontSize: 14, color: '#6A564A', marginBottom: 48, fontFamily: hFont }}>
          {isHi ? 'भारत में सुलभ कानूनी सहायता का निर्माण' : 'Building accessible legal aid for India'}
        </p>

        {[
          { icon: <Scale size={20} color="#923c22" />, color: '#EAE1DA', title: t('about.mission_title'), content: t('about.mission') },
          { icon: <Shield size={20} color="#455B3C" />, color: '#E0ECD6', title: t('about.ai_title'), content: t('about.ai_text') },
        ].map((sec, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #EAE1DA', borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: sec.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sec.icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', fontFamily: hFont }}>{sec.title}</h2>
            </div>
            <p style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 1.8, fontFamily: hFont }}>{sec.content}</p>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: 'white', border: '1px solid #EAE1DA', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Code size={18} color="#923c22" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', fontFamily: hFont }}>{t('about.tech_title')}</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {techStack.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4A4A4A', fontFamily: hFont }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#923c22', flexShrink: 0 }} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'white', border: '1px solid #EAE1DA', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BookOpen size={18} color="#455B3C" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', fontFamily: hFont }}>{t('about.sources_title')}</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sources.map(s => (
                <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4A4A4A', fontFamily: hFont }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#455B3C', flexShrink: 0 }} /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team CTA — earthen gradient */}
        <div style={{ background: 'linear-gradient(135deg, #923c22, #455B3C)', borderRadius: 16, padding: 32, color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, fontFamily: hFont }}>{t('about.team_title')}</h2>
          <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.7, fontFamily: hFont }}>{t('about.team_text')}</p>
        </div>
      </div>
    </div>
  );
}
