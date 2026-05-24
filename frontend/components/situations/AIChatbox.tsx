'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Scale, AlertTriangle, MessageSquare, CheckCircle } from 'lucide-react';
import type { Situation } from '../../types';

export default function AIChatbox({ situation }: { situation: Situation }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const isHi = lang === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!story.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000';
      const res = await fetch(`${pythonBackendUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: story, language: lang, top_k: 5 })
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        setResponse({ error: data.error || data.detail || 'Failed to connect to AI.' });
      } else {
        setResponse({
          analysis: data.answer,
          sources: data.sources
        });
      }
    } catch (e) {
      setResponse({ error: 'Failed to connect to AI.' });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: response ? '1fr 1fr' : '1fr', background: 'white', padding: 32, borderRadius: 12, borderTop: '1px solid #e2e8f0' }}>

      {/* Input Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FCF5EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} color="#923c22" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', fontFamily: hFont }}>
              {isHi ? 'न्यायसाथी एआई को अपनी स्थिति समझाएं' : 'Explain your situation to NyayaSaathi AI'}
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', fontFamily: hFont }}>
              {isHi ? 'क्या हुआ इसका विवरण दें। एआई आपको कदम दर कदम कानून समझाएगा।' : 'Provide details of what happened. The AI will explain the law step-by-step.'}
            </p>
          </div>
        </div>

        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder={isHi ? 'अपना पूरा मामला यहाँ टाइप करें...' : 'Type your full case details here...'}
          style={{
            width: '100%', minHeight: 200, padding: 16, borderRadius: 12,
            border: '1.5px solid #e2e8f0', fontSize: 15, fontFamily: hFont,
            outline: 'none', resize: 'vertical', lineHeight: 1.6
          }}
          onFocus={e => e.target.style.borderColor = '#923c22'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !story.trim()}
          className="btn-primary"
          style={{ alignSelf: 'flex-end', padding: '12px 24px', fontSize: 15 }}
        >
          {loading ? (isHi ? 'विश्लेषण कर रहा है...' : 'Analyzing...') : (isHi ? 'विश्लेषण करें' : 'Analyze My Case')}
          {!loading && <Send size={16} />}
        </button>
      </div>

      {/* Response Section */}
      {response && (
        <div style={{ background: '#faf8f5', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', overflowY: 'auto' }}>

          {response.error ? (
            <div style={{ color: '#dc2626', display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertTriangle size={20} /> {response.error}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A', fontFamily: hFont, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale size={20} color="#923c22" /> {isHi ? 'एआई कानूनी विश्लेषण' : 'AI Legal Analysis'}
              </h3>

              <div style={{ background: 'white', padding: 16, borderRadius: 8, borderLeft: '4px solid #923c22' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>Analysis</p>
                <p style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 1.6, fontFamily: hFont }}>{response.analysis}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#0e9f6e', marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <CheckCircle size={14} /> Should you file?
                  </p>
                  <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.5, fontFamily: hFont }}>{response.should_file}</p>
                </div>

                <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#ea580c', marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <MessageSquare size={14} /> Settlement Advice
                  </p>
                  <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.5, fontFamily: hFont }}>{response.settlement_advice}</p>
                </div>
              </div>

              {(response.is_wrongdoing_possible || response.charges_possible) && (
                <div style={{ background: '#fffbeb', padding: 16, borderRadius: 8, border: '1px solid #fde68a' }}>
                  {response.is_wrongdoing_possible && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#b45309', marginBottom: 4 }}>Potential Risks</p>
                      <p style={{ fontSize: 14, color: '#78350f', fontFamily: hFont }}>{response.is_wrongdoing_possible}</p>
                    </div>
                  )}
                  {response.charges_possible && (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#b45309', marginBottom: 4 }}>Possible Legal Charges</p>
                      <p style={{ fontSize: 14, color: '#78350f', fontFamily: hFont }}>{response.charges_possible}</p>
                    </div>
                  )}
                </div>
              )}

              <p style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 8, textAlign: 'center', fontFamily: hFont }}>
                {response.disclaimer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
