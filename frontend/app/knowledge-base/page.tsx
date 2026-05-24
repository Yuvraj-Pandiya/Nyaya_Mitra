'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Database, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function KnowledgeBasePage() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<{ count?: number, status?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  // Fetch initial stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000';
      const res = await fetch(`${pythonBackendUrl}/ingest/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError(isHi ? 'कृपया केवल PDF फ़ाइलें अपलोड करें।' : 'Please upload PDF files only.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000';
      const res = await fetch(`${pythonBackendUrl}/ingest`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await res.json();
      setUploadResult(data);
      // Refresh stats after successful upload
      fetchStats();
    } catch (err: any) {
      setError(err.message || (isHi ? 'फ़ाइल अपलोड विफल' : 'File upload failed'));
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ background: '#FCF5EF', minHeight: 'calc(100vh - 60px)', padding: '40px 20px', fontFamily: hFont }}>
      <div className="page-container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#923c22', marginBottom: 12 }}>
            {isHi ? 'ज्ञान भंडार (Knowledge Base)' : 'Knowledge Base'}
          </h1>
          <p style={{ fontSize: 16, color: '#5A5A5A', maxWidth: 600, margin: '0 auto' }}>
            {isHi 
              ? 'चैटबॉट को और अधिक बुद्धिमान बनाने के लिए कानूनी दस्तावेज़, केस कानून या दंड संहिताएं अपलोड करें। सिस्टम दस्तावेज़ों को सीखेगा और उन्हें उत्तर उत्पन्न करने के लिए उपयोग करेगा।' 
              : 'Upload legal documents, case laws, or penal codes to make the chatbot smarter. The system will learn from the documents and use them to generate answers.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          
          {/* Upload Section */}
          <div style={{ 
            background: 'white', 
            borderRadius: 16, 
            padding: 32, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            border: '1px solid #EAE1DA'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#3A3A3A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <UploadCloud size={24} color="#923c22" />
              {isHi ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}
            </h2>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? '#923c22' : '#EAE1DA'}`,
                borderRadius: 12,
                padding: '40px 20px',
                textAlign: 'center',
                background: isDragging ? '#FCF5EF' : '#fafafa',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="application/pdf"
                style={{ display: 'none' }} 
              />
              
              <div style={{ 
                background: '#FCF5EF', 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <FileText size={32} color="#923c22" />
              </div>
              
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#3A3A3A', marginBottom: 8 }}>
                {isHi ? 'फ़ाइल चुनने के लिए क्लिक करें या यहाँ खींचें' : 'Click to select or drag file here'}
              </h3>
              <p style={{ fontSize: 14, color: '#777' }}>
                {isHi ? 'केवल PDF फ़ाइलें समर्थित हैं' : 'Only PDF files are supported'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ 
                marginTop: 16, 
                padding: 16, 
                background: '#FFF0F0', 
                border: '1px solid #FFD6D6', 
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: '#D32F2F'
              }}>
                <AlertCircle size={20} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{error}</span>
              </div>
            )}

            {/* Uploading State */}
            {isUploading && (
              <div style={{ 
                marginTop: 24, 
                padding: 20, 
                background: '#FCF5EF', 
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12
              }}>
                <Loader2 size={28} color="#923c22" className="spinner" />
                <span style={{ fontSize: 15, fontWeight: 500, color: '#3A3A3A' }}>
                  {isHi ? 'दस्तावेज़ को संसाधित किया जा रहा है... (इसमें कुछ समय लग सकता है)' : 'Processing document... (this might take a while)'}
                </span>
                <span style={{ fontSize: 13, color: '#777', textAlign: 'center' }}>
                  {isHi ? 'हम पाठ निकाल रहे हैं, इसे खंडों में विभाजित कर रहे हैं, और AI के लिए एम्बेडिंग उत्पन्न कर रहे हैं।' : 'Extracting text, chunking, and generating embeddings for AI.'}
                </span>
              </div>
            )}

            {/* Success State */}
            {uploadResult && !isUploading && (
              <div style={{ 
                marginTop: 24, 
                padding: 20, 
                background: '#F0FFF4', 
                border: '1px solid #C6F6D5', 
                borderRadius: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <CheckCircle size={24} color="#38A169" />
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#276749' }}>
                    {isHi ? 'दस्तावेज़ सफलतापूर्वक सीख लिया गया!' : 'Document successfully learned!'}
                  </span>
                </div>
                
                <div style={{ background: 'white', padding: 16, borderRadius: 8, fontSize: 14, color: '#4A5568' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid #EDF2F7', paddingBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>{isHi ? 'फ़ाइल का नाम' : 'Filename'}</span>
                    <span>{uploadResult.filename}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid #EDF2F7', paddingBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>{isHi ? 'पाठ की लंबाई' : 'Text Length'}</span>
                    <span>{uploadResult.text_length} characters</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>{isHi ? 'ज्ञान खंड' : 'Knowledge Chunks'}</span>
                    <span style={{ fontWeight: 600, color: '#923c22' }}>{uploadResult.chunks_stored} added</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div style={{ 
            background: 'white', 
            borderRadius: 16, 
            padding: 32, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            border: '1px solid #EAE1DA',
            display: 'flex',
            alignItems: 'center',
            gap: 24
          }}>
            <div style={{ 
              background: '#FCF5EF', 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Database size={40} color="#923c22" />
            </div>
            
            <div>
              <h3 style={{ fontSize: 16, color: '#5A5A5A', marginBottom: 4, fontWeight: 500 }}>
                {isHi ? 'वर्तमान ज्ञान का आकार' : 'Current Knowledge Base Size'}
              </h3>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#923c22', letterSpacing: '-1px' }}>
                {stats?.count !== undefined ? stats.count : '...'} <span style={{ fontSize: 18, fontWeight: 500, color: '#777', letterSpacing: 'normal' }}>{isHi ? 'खंड (chunks)' : 'chunks'}</span>
              </div>
              <p style={{ fontSize: 14, color: '#777', marginTop: 4 }}>
                {isHi 
                  ? 'चैटबॉट अब इन दस्तावेज़ों से उत्तर देने में सक्षम है।' 
                  : 'The chatbot is now able to answer questions based on these indexed documents.'}
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
