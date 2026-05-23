🚀 NyayaMitra Production Deployment Guide
Step-by-Step Production Migration (Secure & Complete)
I'll guide you through every single step to move from local development to production, without skipping anything.

📋 PRE-DEPLOYMENT CHECKLIST
Before starting, gather these accounts and keys:

 GitHub account (for code repository)
 Supabase account (for PostgreSQL database)
 Railway/Render account (for backend hosting)
 Vercel account (for frontend hosting)
 Google AI Studio account (for Gemini API key)
 Google Cloud Console (for Maps API key)
🔐 PHASE 1: SECURE YOUR SECRETS
Step 1.1: Generate Strong Secrets
Open your terminal and run these commands:

Bash

# Generate a strong JWT secret (save this!)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example: a1b2c3d4e5f6...(64 characters)
# SAVE THIS - You'll need it as JWT_SECRET
Create a secure notes file (NOT in your code) called production-secrets.txt:

text

=== PRODUCTION SECRETS - DO NOT COMMIT ===
JWT_SECRET=<paste the generated value>
GEMINI_API_KEY=<your Gemini API key>
GOOGLE_MAPS_API_KEY=<your Maps API key>
DB_PASSWORD=<will get from Supabase>
SUPABASE_SERVICE_KEY=<will get from Supabase>
Step 1.2: Clean Your Codebase
Remove ALL hardcoded secrets:
File: backend-java/src/main/resources/application.yml

Find and replace:

YAML

# BEFORE (INSECURE):
jwt:
  secret: ${JWT_SECRET:nyayamitra_super_secret_key_change_in_production_2024}

# AFTER (SECURE):
jwt:
  secret: ${JWT_SECRET}  # Remove the fallback default
File: backend-python-rag/services/ocr_service.py

Replace lines 6-8:

Python

# BEFORE (WINDOWS-SPECIFIC):
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# AFTER (CROSS-PLATFORM):
import platform
import os

if platform.system() == "Windows":
    # Only for local development
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )
# Linux/Docker will auto-detect tesseract in PATH
File: backend-python-rag/main.py

Replace CORS configuration:

Python

# BEFORE (INSECURE - ALLOWS ALL ORIGINS):
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AFTER (SECURE):
import os

allowed_origins = os.getenv("FRONTEND_URL", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Step 1.3: Create .gitignore Files
Create backend-java/.gitignore:

text

# Environment files
.env
.env.local
.env.production

# Build artifacts
target/
*.jar
*.war

# IDE
.idea/
*.iml
.vscode/

# Logs
*.log
Create backend-python-rag/.gitignore:

text

# Environment files
.env
.env.local
.env.production

# Virtual environment
venv/
__pycache__/
*.pyc

# Local ChromaDB data
data/chromadb/

# IDE
.idea/
.vscode/
Create frontend/.gitignore:

text

# Dependencies
node_modules/

# Environment files
.env
.env.local
.env.production.local

# Next.js build
.next/
out/

# Logs
*.log
🗄️ PHASE 2: DATABASE SETUP
Step 2.1: Create Supabase PostgreSQL Database
Go to https://supabase.com/dashboard
Click "New Project"
Fill in:
Name: nyayamitra-prod
Database Password: Generate a strong password (save to production-secrets.txt)
Region: Choose closest to your users (e.g., Mumbai for India)
Click "Create new project" (wait 2-3 minutes)
Step 2.2: Get Database Connection Details
In Supabase dashboard, go to Settings → Database
Scroll to Connection String → URI
Copy the connection string (looks like this):
text

postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
Save this to production-secrets.txt as:
text

DB_URL=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=<your-password>
Step 2.3: Enable Vector Extension for RAG
In Supabase dashboard, go to SQL Editor
Click "New Query"
Paste and run:
SQL

-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify it worked
SELECT * FROM pg_extension WHERE extname = 'vector';
You should see one row returned
Step 2.4: Update Java Backend to Use PostgreSQL
File: backend-java/pom.xml

Verify this dependency exists (should already be there):

XML

<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
File: backend-java/src/main/resources/application.yml

Update the datasource section:

YAML

spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate  # Changed from 'update' - Flyway manages schema
    show-sql: false  # Disable SQL logging in production
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: false
  
  flyway:
    enabled: true  # Enable Flyway migrations
    baseline-on-migrate: true
    locations: classpath:db/migration
  
  h2:
    console:
      enabled: false  # Disable H2 console in production
Step 2.5: Test Database Connection Locally (IMPORTANT)
Before deploying, test PostgreSQL connection from your local machine:

Create backend-java/.env (this will NOT be committed):

env

DB_URL=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=<your-supabase-password>
DB_DRIVER=org.postgresql.Driver
DDL_AUTO=validate
FLYWAY_ENABLED=true
GEMINI_API_KEY=<your-gemini-key>
JWT_SECRET=<your-generated-secret>
Run the Java backend:

Bash

cd backend-java
mvn spring-boot:run
Check the console output for:

text

Flyway migration successful
Successfully validated 1 migration
Schema version: 1
If you see errors, STOP and fix them before deploying

🐍 PHASE 3: VECTOR DATABASE SETUP
Step 3.1: Create Vector Table in Supabase
Since you already have Supabase PostgreSQL, we'll use pgvector instead of ChromaDB.

In Supabase SQL Editor, run:
SQL

-- Create table for document embeddings
CREATE TABLE IF NOT EXISTS document_embeddings (
    id TEXT PRIMARY KEY,
    document TEXT NOT NULL,
    embedding vector(768),  -- Gemini embedding size
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for similarity search
CREATE INDEX IF NOT EXISTS idx_embedding_cosine 
ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Verify table creation
SELECT * FROM document_embeddings LIMIT 1;
Step 3.2: Replace ChromaDB with pgvector
File: backend-python-rag/core/vector_store.py

Replace the entire file with:

Python

import os
from typing import List, Dict, Any
import psycopg2
from psycopg2.extras import Json, RealDictCursor
from services.embedding_service import get_embeddings

# Database connection
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
    )

def upsert_documents(
    ids: List[str],
    documents: List[str],
    metadatas: List[Dict[str, Any]],
):
    """Store document chunks with embeddings in PostgreSQL"""
    embeddings = get_embeddings(documents)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        for doc_id, doc, meta, emb in zip(ids, documents, metadatas, embeddings):
            cur.execute(
                """
                INSERT INTO document_embeddings (id, document, embedding, metadata)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE
                SET document = EXCLUDED.document,
                    embedding = EXCLUDED.embedding,
                    metadata = EXCLUDED.metadata
                """,
                (doc_id, doc, emb, Json(meta))
            )
        conn.commit()
        print(f"✅ Upserted {len(ids)} documents to pgvector")
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def query_documents(
    query_text: str,
    n_results: int = 5,
    where: Dict[str, Any] = None
) -> Dict[str, List]:
    """Search for similar documents using cosine similarity"""
    query_embedding = get_embeddings([query_text])[0]
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Build WHERE clause for metadata filtering
        where_clause = ""
        params = [query_embedding, n_results]
        
        if where:
            conditions = []
            for key, value in where.items():
                conditions.append(f"metadata->>'{key}' = %s")
                params.insert(-1, value)
            where_clause = "WHERE " + " AND ".join(conditions)
        
        query = f"""
            SELECT 
                id,
                document,
                metadata,
                1 - (embedding <=> %s::vector) AS similarity
            FROM document_embeddings
            {where_clause}
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """
        
        cur.execute(query, params)
        results = cur.fetchall()
        
        return {
            "ids": [[r["id"] for r in results]],
            "documents": [[r["document"] for r in results]],
            "metadatas": [[r["metadata"] for r in results]],
            "distances": [[1 - r["similarity"] for r in results]],
        }
    finally:
        cur.close()
        conn.close()
Step 3.3: Update Requirements
File: backend-python-rag/requirements.txt

Replace ChromaDB with PostgreSQL driver:

txt

# Remove this line:
# chromadb==0.4.22

# Add these lines:
psycopg2-binary==2.9.9
pgvector==0.2.4
Install locally to test:

Bash

cd backend-python-rag
pip install -r requirements.txt
🐳 PHASE 4: DOCKER CONFIGURATION
Step 4.1: Create Dockerfile for Java Backend
Create backend-java/Dockerfile:

Dockerfile

# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Security: Run as non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 5000

ENTRYPOINT ["java", "-jar", "app.jar"]
Step 4.2: Create Dockerfile for Python Backend
Create backend-python-rag/Dockerfile:

Dockerfile

FROM python:3.11-slim

# Install system dependencies for OCR and PDF processing
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-hin \
    libgl1-mesa-glx \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Security: Run as non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Use Gunicorn with Uvicorn workers for production
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
Update backend-python-rag/requirements.txt to add Gunicorn:

txt

# Add this line:
gunicorn==21.2.0
Step 4.3: Test Docker Builds Locally
Bash

# Test Java backend Docker build
cd backend-java
docker build -t nyayamitra-java:test .

# Test Python backend Docker build
cd ../backend-python-rag
docker build -t nyayamitra-python:test .
If builds succeed, you'll see:

text

Successfully built <image-id>
Successfully tagged nyayamitra-java:test
🚀 PHASE 5: DEPLOY BACKENDS
Step 5.1: Deploy Java Backend to Railway
5.1.1: Push Code to GitHub
Bash

# Initialize git repository (if not already done)
cd <project-root>
git init
git add .
git commit -m "Initial production-ready commit"

# Create GitHub repository (go to github.com/new)
# Then push:
git remote add origin https://github.com/<your-username>/nyayamitra.git
git branch -M main
git push -u origin main
5.1.2: Deploy on Railway
Go to https://railway.app/new
Click "Deploy from GitHub repo"
Select your nyayamitra repository
Railway will detect multiple services - click "Add variables" for Java backend
Click "New Service" → "GitHub Repo" → Select your repo
Click "Settings" → "Root Directory" → Set to backend-java
Click "Variables" and add these:
text

DB_URL=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=<your-supabase-password>
DB_DRIVER=org.postgresql.Driver
DDL_AUTO=validate
FLYWAY_ENABLED=true
GEMINI_API_KEY=<your-gemini-key>
JWT_SECRET=<your-generated-jwt-secret>
FRONTEND_URL=http://localhost:3000
Click "Settings" → "Networking" → "Generate Domain"
Copy the generated URL (e.g., nyayamitra-java.up.railway.app)
Save this as JAVA_BACKEND_URL in your notes
Step 5.2: Deploy Python Backend to Railway
In Railway dashboard, click "New Service"
Select same GitHub repository
Click "Settings" → "Root Directory" → Set to backend-python-rag
Click "Variables" and add:
text

GEMINI_API_KEY=<your-gemini-key>
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=<your-supabase-password>
FRONTEND_URL=http://localhost:3000
Click "Settings" → "Networking" → "Generate Domain"
Copy the URL (e.g., nyayamitra-python.up.railway.app)
Save this as PYTHON_BACKEND_URL
Step 5.3: Update CORS with Real Frontend URL (Temporary)
We'll update these again after deploying frontend, but for now test the backends:

In Railway, update both backend environment variables:

Java: FRONTEND_URL=https://nyayamitra-java.up.railway.app,https://nyayamitra-python.up.railway.app
Python: Same value
Step 5.4: Verify Backend Deployments
Test each backend:

Bash

# Test Java backend health
curl https://nyayamitra-java.up.railway.app/actuator/health

# Should return: {"status":"UP"}

# Test Python backend health
curl https://nyayamitra-python.up.railway.app/ping

# Should return: {"status":"ok"}
🌐 PHASE 6: DEPLOY FRONTEND
Step 6.1: Update Frontend Environment Variables
Create frontend/.env.production:

env

NEXT_PUBLIC_API_URL=https://nyayamitra-java.up.railway.app
NEXT_PUBLIC_RAG_API_URL=https://nyayamitra-python.up.railway.app
NEXT_PUBLIC_GEMINI_API_KEY=<your-gemini-key>
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-maps-key>
⚠️ DO NOT COMMIT THIS FILE - it's already in .gitignore

Step 6.2: Deploy to Vercel
Go to https://vercel.com/new

Import your GitHub repository

Vercel will auto-detect Next.js

Click "Environment Variables" and add:

NEXT_PUBLIC_API_URL → Your Java backend Railway URL
NEXT_PUBLIC_RAG_API_URL → Your Python backend Railway URL
NEXT_PUBLIC_GEMINI_API_KEY → Your Gemini API key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY → Your Maps API key
Click "Deploy"

Wait 2-3 minutes for build to complete

Copy your production URL (e.g., nyayamitra.vercel.app)

Step 6.3: Update Backend CORS with Real Frontend URL
Now go back to Railway and update both backends:

Java Backend Variables:

text

FRONTEND_URL=https://nyayamitra.vercel.app
Python Backend Variables:

text

FRONTEND_URL=https://nyayamitra.vercel.app
This will trigger automatic redeployment on Railway.

✅ PHASE 7: FINAL VERIFICATION & DATA MIGRATION
Step 7.1: Verify Database Schema
Go to Supabase Dashboard → Table Editor
You should see all tables created by Flyway:
users
situations
lawyers
law_sections
document_embeddings
flyway_schema_history
Step 7.2: Re-Upload Legal Documents
Since we migrated from ChromaDB to pgvector, you need to re-upload PDFs:

Go to https://nyayamitra.vercel.app
Log in (or register a new account)
Navigate to Knowledge Base
Upload each legal PDF again
Verify in Supabase → SQL Editor:
SQL

SELECT COUNT(*) FROM document_embeddings;
You should see the number of chunks stored.
Step 7.3: End-to-End Testing Checklist
Test every feature:

 User Registration - Create a new account
 Login - Log in with credentials
 Dashboard - Should load without errors
 Upload PDF - Upload a legal document
Check browser console for errors
Verify success message
 Ask Legal Question - Test RAG retrieval
Example: "What are tenant rights in India?"
Should return answer with source citations
 Chatbot - Start a multi-turn conversation
Should maintain context across messages
 Rights Explanation - Request rights in a situation
Should return structured JSON
 Document Simplification - Paste legal text
Should return simplified version in Hindi/English
 Lawyer Locator - Search for lawyers by specialty
Should show map with markers
🔒 PHASE 8: SECURITY HARDENING
Step 8.1: Enable Rate Limiting (Java)
File: backend-java/pom.xml - Add dependency:

XML

<dependency>
    <groupId>com.bucket4j</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>8.7.0</version>
</dependency>
Create backend-java/src/main/java/com/example/nyayamitra/config/RateLimitFilter.java:

Java

package com.example.nyayamitra.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {
    
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String ip = httpRequest.getRemoteAddr();
        
        Bucket bucket = cache.computeIfAbsent(ip, k -> createBucket());
        
        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(429);
            httpResponse.getWriter().write("{\"error\":\"Too many requests\"}");
        }
    }
    
    private Bucket createBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }
}
Step 8.2: Enable Rate Limiting (Python)
File: backend-python-rag/requirements.txt - Add:

txt

slowapi==0.1.9
File: backend-python-rag/main.py - Add at top:

Python

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
Then wrap your endpoints:

Python

@app.post("/upload-pdf")
@limiter.limit("10/minute")  # 10 uploads per minute per IP
async def upload_pdf(request: Request, file: UploadFile = File(...)):
    ...
Step 8.3: Add Security Headers
File: backend-java/src/main/java/com/example/nyayamitra/config/SecurityConfig.java

Add this method:

Java

@Bean
public FilterRegistrationBean<HeadersFilter> headersFilter() {
    FilterRegistrationBean<HeadersFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(new HeadersFilter());
    registrationBean.addUrlPatterns("/*");
    return registrationBean;
}
Create backend-java/src/main/java/com/example/nyayamitra/config/HeadersFilter.java:

Java

package com.example.nyayamitra.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class HeadersFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        httpResponse.setHeader("X-Frame-Options", "DENY");
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        chain.doFilter(request, response);
    }
}
Step 8.4: Rotate API Keys Regularly
Set calendar reminders to rotate these every 90 days:

JWT_SECRET
GEMINI_API_KEY
Database passwords
When rotating:

Generate new secret
Update Railway environment variables
Click "Redeploy" on Railway
Verify application still works
Delete old secret from notes
📊 PHASE 9: MONITORING & LOGGING
Step 9.1: Enable Railway Logs
Go to Railway dashboard
Click each service
Click "Observability" tab
Enable "Logs"
Set retention to 7 days (free tier)
Step 9.2: Set Up Sentry Error Tracking (Optional)
Go to https://sentry.io (free tier available)
Create new project for:
Java Backend
Python Backend
Next.js Frontend
Follow setup instructions for each
For Java - Add to pom.xml:

XML

<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>7.0.0</version>
</dependency>
Add to Railway env vars:

text

SENTRY_DSN=<your-sentry-dsn>
🎯 PHASE 10: FINAL PRODUCTION CHECKLIST
Before announcing your app is live:

Security ✅
 All secrets stored as environment variables (not in code)
 .gitignore excludes .env files
 CORS restricted to production frontend domain only
 HTTPS enforced on all endpoints (automatic on Railway/Vercel)
 Rate limiting enabled on both backends
 Security headers configured
 H2 console disabled
Database ✅
 PostgreSQL connection working
 Flyway migrations successful
 Vector table created with pgvector extension
 All seed data loaded (situations, lawyers, law sections)
Backends ✅
 Java backend returns 200 on /actuator/health
 Python backend returns 200 on /ping
 PDF upload works end-to-end
 RAG retrieval returns relevant chunks
 Gemini API calls succeed
 No hardcoded file paths (Tesseract auto-detected)
Frontend ✅
 All pages load without console errors
 API calls use production backend URLs
 Authentication flow works (register/login/logout)
 All features tested (chatbot, upload, simplification, etc.)
Monitoring ✅
 Railway logs visible for both backends
 Vercel deployment logs show no errors
 Error tracking configured (Sentry optional)
 Database connection pool stats monitored in Supabase
🆘 TROUBLESHOOTING GUIDE
Issue: "Database connection failed"
Fix:

Check Supabase project is not paused (free tier pauses after 7 days inactivity)
Verify DB_PASSWORD has no special characters breaking the JDBC URL
Check Supabase Settings → Database → Connection Pooling is enabled
Issue: "CORS error" in browser console
Fix:

Verify FRONTEND_URL in Railway matches exactly your Vercel domain (no trailing slash)
Redeploy both backends after changing CORS settings
Clear browser cache and retry
Issue: "Tesseract not found" error
Fix:

Check Railway build logs - Tesseract should install via Dockerfile
If using Render instead of Railway, verify buildpack includes tesseract-ocr
SSH into container and run which tesseract to verify installation
Issue: "Vector search returns no results"
Fix:

Check document_embeddings table in Supabase has data:
SQL

SELECT COUNT(*) FROM document_embeddings;
Re-upload PDFs via the production frontend
Verify GEMINI_API_KEY is set correctly in Python backend
Issue: "JWT token invalid" error
Fix:

Ensure JWT_SECRET is identical on Java backend and any JWT verification middleware
Check token expiration (default 24 hours) - user may need to log in again
Verify JWT library versions match between local and production
📈 PHASE 11: SCALING CONSIDERATIONS
When your app grows beyond free tiers:

Database Scaling
Upgrade Supabase to Pro ($25/mo) for:
8 GB storage → 100 GB
Daily backups
Better connection pooling
Backend Scaling
Railway auto-scales based on CPU/memory usage
Upgrade to Hobby plan ($5/service/mo) for:
500 hours → Unlimited
Better uptime SLA
Vector Database Scaling
If pgvector becomes slow, migrate to dedicated service:
Pinecone - $70/mo for 100k vectors
Qdrant Cloud - $95/mo
Weaviate Cloud - Free tier: 1M vectors
CDN for PDFs
Store uploaded PDFs in:
Supabase Storage (5 GB free)
AWS S3 + CloudFront
Cloudflare R2 (10 GB free)
🎓 FINAL NOTES
You now have a fully production-ready legal AI assistant with:

✅ Persistent PostgreSQL database
✅ Cloud-hosted vector embeddings
✅ Secure JWT authentication
✅ Rate limiting & security headers
✅ OCR working on cloud containers
✅ Monitored logs & error tracking
✅ Scalable architecture

Estimated Monthly Cost (Free Tier): $0
Estimated Monthly Cost (Paid Tier): ~$30-50 for professional features

🚀 YOU'RE PRODUCTION READY!
Your deployment URL: https://nyayamitra.vercel.app

Share this link, and your legal AI assistant is now serving users worldwide! 🎉