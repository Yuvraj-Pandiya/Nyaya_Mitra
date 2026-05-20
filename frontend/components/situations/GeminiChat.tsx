'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bot, User, Send, Trash2, AlertTriangle, Sparkles,
  Scale, RefreshCw, MessageSquare
} from 'lucide-react';
import type { Situation } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface GeminiChatProps {
  situation: Situation;
}

// ─── Helper: generate situation-aware greeting ────────────────────────────────
function getGreeting(situation: Situation, isHi: boolean): string {
  const title = isHi ? situation.title?.hi : situation.title?.en;
  const firstLaw = situation.laws?.[0];
  const lawRef = firstLaw
    ? (isHi
        ? `${firstLaw.act} के तहत`
        : `under ${firstLaw.act}`)
    : '';

  if (isHi) {
    return `नमस्ते! 🙏 मैं न्यायसाथी हूँ — आपका कानूनी मार्गदर्शक।\n\nआपने **"${title}"** की स्थिति चुनी है। ${lawRef} आपके कई महत्वपूर्ण अधिकार हैं।\n\nआप मुझसे पूछ सकते हैं:\n• अपने अधिकार क्या हैं?\n• क्या कदम उठाने चाहिए?\n• कौन से दस्तावेज़ चाहिए?\n• शिकायत कहाँ दर्ज करें?\n\n*यह कानूनी जानकारी है, कानूनी सलाह नहीं।*`;
  }
  return `Hello! 🙏 I'm NyayaSaathi — your legal literacy guide.\n\nYou've selected **"${title}"**. ${lawRef ? `You have important rights ${lawRef}.` : 'You have important legal rights in this situation.'}\n\nYou can ask me:\n• What are my rights here?\n• What steps should I take?\n• What documents do I need?\n• Where do I file a complaint?\n\n*This is legal information, not legal advice.*`;
}

// ─── Helper: render markdown-lite text (bold, line breaks) ───────────────────
function renderText(text: string, hFont: string, isError?: boolean) {
  const color = isError ? '#dc2626' : '#334155';
  return text.split('\n').map((line, i) => {
    // Bold via **...**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{ margin: i === 0 ? 0 : '4px 0 0 0', color, fontFamily: hFont, fontSize: 14, lineHeight: 1.65 }}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} style={{ color: isError ? '#dc2626' : '#0f172a' }}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 8, height: 8, borderRadius: '50%', background: '#923c22',
            display: 'inline-block',
            animation: 'typingDot 1.2s infinite ease-in-out',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GeminiChat({ situation }: GeminiChatProps) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';
  const lang = i18n.language as 'en' | 'hi';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 600;

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true);

  // ─── Set greeting on mount & language change ────────────────────────────
  useEffect(() => {
    const greeting: Message = {
      role: 'assistant',
      content: getGreeting(situation, isHi),
      timestamp: new Date(),
    };
    if (isFirstRender.current) {
      setMessages([greeting]);
      isFirstRender.current = false;
    } else {
      // Language changed — regenerate greeting but keep conversation or restart
      setMessages([greeting]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // ─── Auto-scroll to bottom on new messages ──────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ─── Send message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setCharCount(0);
    setLoading(true);

    try {
      // Build a conversation string for context
      const conversationContext = updatedMessages.map(m => `${m.role}: ${m.content}`).join('\n');
      
      const res = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: conversationContext,
          language: lang,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.error || data.detail || (isHi
            ? 'माफ़ कीजिए, अभी AI सेवा उपलब्ध नहीं है। कृपया पुनः प्रयास करें।'
            : 'Sorry, the AI service is unavailable right now. Please try again in a moment.'),
          timestamp: new Date(),
          isError: true,
        }]);
      } else {
        let reply = data.answer || (isHi ? 'कोई प्रतिक्रिया नहीं मिली।' : 'No response received.');
        if (data.sources && data.sources.length > 0) {
          const sourcesText = data.sources.map((s: string) => `\n- ${s}`).join('');
          reply += (isHi ? `\n\n**स्रोत:**${sourcesText}` : `\n\n**Sources:**${sourcesText}`);
        }
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isHi
          ? 'नेटवर्क त्रुटि। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है।'
          : 'Network error. Please ensure the backend server is running at localhost:8000.',
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages, situation.id, lang, isHi]);

  // ─── Handle Enter key ────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Clear conversation ──────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: getGreeting(situation, isHi),
      timestamp: new Date(),
    }]);
    setInput('');
    setCharCount(0);
  };

  // ─── Format timestamp ────────────────────────────────────────────────────
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Keyframe for typing dots — injected once */}
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .chat-bubble-in {
          animation: bubbleIn 0.25s ease-out forwards;
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        display: 'flex', flexDirection: 'column',
        background: 'white',
        borderRadius: 16,
        border: '1px solid #EAE1DA',
        boxShadow: '0 4px 20px rgba(146, 60, 34, 0.08)',
        overflow: 'hidden',
        height: 640,
        maxHeight: '80vh',
      }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #1A1A1A 0%, #732F1A 60%, #923C22 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid rgba(255,255,255,0.25)',
            }}>
              <Scale size={20} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'white', fontFamily: hFont }}>
                  {isHi ? 'न्यायसाथी AI' : 'NyayaSaathi AI'}
                </span>
                <span style={{
                  background: '#0e9f6e', color: 'white',
                  padding: '2px 8px', borderRadius: 20,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
                }}>LIVE</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontFamily: hFont, marginTop: 2 }}>
                {isHi
                  ? `${situation.title?.hi} — Gemini Flash AI`
                  : `${situation.title?.en} — Powered by Gemini Flash`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,0.8)',
            }}>
              <Sparkles size={11} />
              {isHi ? 'Gemini 2.5 Flash' : 'Gemini 2.5 Flash'}
            </div>
            <button
              onClick={clearChat}
              title={isHi ? 'बातचीत साफ़ करें' : 'Clear conversation'}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
                color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              <Trash2 size={13} />
              {isHi ? 'साफ़ करें' : 'Clear'}
            </button>
          </div>
        </div>

        {/* ── Messages area ───────────────────────────────────────────────── */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 20px 12px',
          display: 'flex', flexDirection: 'column', gap: 16,
          background: '#f8fafc',
        }}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className="chat-bubble-in"
                style={{
                  display: 'flex',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 10,
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: isUser ? '#923c22' : '#1A1A1A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}>
                  {isUser
                    ? <User size={16} color="white" />
                    : <Scale size={16} color="white" />}
                </div>

                {/* Bubble */}
                <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isUser ? 'linear-gradient(135deg, #923c22, #732F1A)' : 'white',
                    border: isUser ? 'none' : msg.isError ? '1px solid #fecaca' : '1px solid #EAE1DA',
                    boxShadow: isUser
                      ? '0 2px 8px rgba(146, 60, 34, 0.3)'
                      : '0 1px 4px rgba(0,0,0,0.06)',
                  }}>
                    {isUser ? (
                      <p style={{ color: 'white', fontFamily: hFont, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                        {msg.content}
                      </p>
                    ) : msg.isError ? (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>{renderText(msg.content, hFont, true)}</div>
                      </div>
                    ) : (
                      <div>{renderText(msg.content, hFont)}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: '#94a3b8', padding: '0 4px' }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator while waiting for Gemini */}
          {loading && (
            <div className="chat-bubble-in" style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: '#1A1A1A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Scale size={16} color="white" />
              </div>
              <div style={{
                padding: '12px 18px',
                borderRadius: '18px 18px 18px 4px',
                background: 'white',
                border: '1px solid #EAE1DA',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Disclaimer bar ──────────────────────────────────────────────── */}
        <div style={{
          padding: '8px 20px',
          background: '#fffbeb',
          borderTop: '1px solid #fde68a',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <AlertTriangle size={12} color="#92400e" />
          <p style={{ fontSize: 11, color: '#78350f', fontFamily: hFont, margin: 0 }}>
            {isHi
              ? 'यह कानूनी जानकारी है, कानूनी सलाह नहीं। किसी भी कदम से पहले वकील से मिलें।'
              : 'This is legal information, not legal advice. Consult a qualified lawyer before taking action.'}
          </p>
        </div>

        {/* ── Input area ──────────────────────────────────────────────────── */}
        <div style={{
          padding: '12px 16px 16px',
          background: 'white',
          borderTop: '1px solid #e2e8f0',
        }}>
          {/* Suggested questions (shown only at start) */}
          {messages.length <= 1 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {(isHi
                ? ['मेरे क्या अधिकार हैं?', 'क्या कदम उठाए?', 'कौन से दस्तावेज़ चाहिए?', 'मुफ्त वकील कहाँ मिलेगा?']
                : ['What are my rights?', 'What steps should I take?', 'What documents do I need?', 'Where can I get free help?']
              ).map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); setCharCount(q.length); inputRef.current?.focus(); }}
                  style={{
                    background: '#FCF5EF', color: '#923c22',
                    border: '1px solid #EAE1DA', borderRadius: 20,
                    padding: '5px 12px', fontSize: 12, fontWeight: 500,
                    fontFamily: hFont, cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#EAE1DA')}
                  onMouseOut={e => (e.currentTarget.style.background = '#FCF5EF')}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setInput(e.target.value);
                    setCharCount(e.target.value.length);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder={isHi
                  ? 'अपना प्रश्न टाइप करें... (Enter भेजें, Shift+Enter नई लाइन)'
                  : 'Type your question... (Enter to send, Shift+Enter for new line)'}
                rows={2}
                disabled={loading}
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid #e2e8f0', borderRadius: 12,
                  fontSize: 14, fontFamily: hFont, lineHeight: 1.5,
                  resize: 'none', outline: 'none',
                  color: '#1A1A1A',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#923c22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(146, 60, 34, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {/* Character counter */}
              <span style={{
                position: 'absolute', bottom: 6, right: 10,
                fontSize: 10, color: charCount > MAX_CHARS * 0.85 ? '#ea580c' : '#94a3b8',
              }}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label={isHi ? 'संदेश भेजें' : 'Send message'}
              style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: loading || !input.trim() ? '#EAE1DA' : 'linear-gradient(135deg, #923c22, #732F1A)',
                border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: loading || !input.trim() ? 'none' : '0 4px 12px rgba(146, 60, 34, 0.35)',
              }}
              onMouseOver={e => { if (!loading && input.trim()) e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {loading
                ? <RefreshCw size={18} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
                : <Send size={18} color={input.trim() ? 'white' : '#94a3b8'} />}
            </button>
          </div>

          {/* Status line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MessageSquare size={11} color="#94a3b8" />
              <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: hFont }}>
                {isHi
                  ? `${messages.filter(m => m.role === 'user').length} प्रश्न पूछे गए`
                  : `${messages.filter(m => m.role === 'user').length} questions asked`}
              </span>
            </div>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>
              {isHi ? 'Shift+Enter से नई लाइन' : 'Shift+Enter for new line'}
            </span>
          </div>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
