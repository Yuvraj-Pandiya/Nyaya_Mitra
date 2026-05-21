# NyayaMitra — Production Readiness Plan & RAG Deep Dive

This document details how the PDF RAG (Retrieval-Augmented Generation) pipeline operates, how database persistence works, and the complete step-by-step requirements to move every component from local development to a production environment.

---

## 🔍 Part 1: How the RAG Pipeline Works & What is Stored

When you upload a PDF through the Knowledge Base interface, the FastAPI Python backend (`backend-python-rag`) runs it through the ingestion pipeline:

```mermaid
flowchart TD
    A[User Uploads PDF] --> B[ocr_service: Extract Text]
    B -->|Has Text Layer| C[Extract native characters]
    B -->|Scanned PDF / Images| D[OCR Fallback via Tesseract]
    C --> E[chunking_service: Segment Text]
    D --> E
    E -->|Split into overlapping segments| F[embedding_service: Generate Vector]
    F -->|Call Gemini gemini-embedding-2| G[core/vector_store: Upsert to ChromaDB]
```

### What is Stored in the Vector Database?
For every extracted text segment (chunk), the local persistent database stores:

| Field | Data Type | Description | Example / Format |
|---|---|---|---|
| **ID** | `String` | Unique identifier generated per chunk to prevent duplicates on re-upload | `"[filename]_chunk_[index]"` |
| **Document** | `String` | The actual raw text content of that chunk | `"The Tenant shall pay rent on the 1st of..."` |
| **Embedding** | `Array[Float]` | A 768-dimensional vector representation of the semantic meaning | `[0.0125, -0.0482, 0.9841, ...]` |
| **Metadata** | `JSON` | Accompanying context details for source tracking | `{"filename": "rent_agreement.pdf", "chunk_index": 0, "char_count": 850}` |

---

## 💾 Part 2: Will My Uploaded Data Remain in Production?

### ⚠️ The Current Status (Local Dev)
Right now, both backends use local storage:
1. **Java Backend:** Uses **H2 In-Memory Database**. All users, situations, and lawyers are stored in RAM. **When you restart the Java backend, this data resets and seeds fresh from JSON files.**
2. **Python Backend:** Uses **ChromaDB Local Persistent Storage** (saved inside `backend-python-rag/data/chromadb`). The documents you upload **will persist** on your local machine across Python server restarts.

### 🌐 The Production Reality
If you deploy this application to cloud hosting platforms:
* **Java Backend:** Must be switched to a permanent database (e.g. **Supabase PostgreSQL**). Otherwise, users' registrations and data will be lost on every deployment or server restart.
* **Python Backend:** Serverless hosting (like Vercel, Render, or AWS Lambda) uses **ephemeral (temporary) file systems**. This means any files written to `data/chromadb` will be **deleted** when the container sleeps or restarts.
* **The Solution:** For production, you must use a hosted vector database.
  * **Option A (Recommended): pgvector in Supabase.** Since you already have a Supabase Postgres database, you can enable `pgvector` and store your document embeddings directly alongside user data in PostgreSQL.
  * **Option B: Managed Vector Host.** Store your embeddings on a free tier of a managed vector service (like Pinecone, Qdrant, or Chroma Cloud).

---

## 🗺️ Part 3: Production Readiness Checklist

To transition **NyayaMitra** from a local hackathon prototype to a secure, stable production application, the following issues must be resolved:

### 1. Database Migration (Java)
* Move the Spring Boot datasource from H2 to PostgreSQL by restoring the `.env` settings in `backend-java`.
* Implement a database migration tool like **Flyway** or **Liquibase** to manage schemas and seed the initial production records automatically instead of relying on Java application-start seeder logs.

### 2. Vector DB Migration (Python)
* Update `backend-python-rag/core/vector_store.py` to point to a cloud-based vector store (managed Chroma instance, Pinecone, or Supabase pgvector) rather than a local sqlite file.

### 3. Hosted OCR Configuration
* The uploader currently relies on PyTesseract. In a cloud environment, you must install the Tesseract system binaries on the container.
* To make deployments lightweight, switch `ocr_service.py` to use a cloud API (like **Google Cloud Vision API**, **AWS Textract**, or **OCR.space**) for scanning PDFs.

### 4. JWT Authentication Polish
* Right now, the JWT token lasts 24 hours. For security, implement **Refresh Tokens** stored in HTTP-Only cookies to protect against token hijacking.

### 5. CORS Policies Whitelisting
* In `backend-java/src/main/resources/application.yml` and `backend-python-rag/main.py`, replace `allowed-origins: http://localhost:3000` with the actual production domain where the frontend is hosted (e.g. Vercel URL).

### 6. Centralized Logging & Error Tracking
* Set up an APM tool (like **Sentry** or **Loggly**) on both backends to capture LLM API errors or database connection drops.

---

## 🚀 Part 4: Production Deployment Requirements (Step-by-Step)

This section documents **everything** needed to move NyayaMitra from local development to a production environment. It covers all three services, every dependency, and all configuration changes required.

### 📐 Current Architecture Summary

| Component | Technology | Local Port | Local Storage |
|---|---|---|---|
| **Frontend** | Next.js 16 + React 19 + TailwindCSS 4 | `localhost:3000` | None (stateless) |
| **Java Backend** | Spring Boot + Flyway + JPA | `localhost:5000` | H2 In-Memory DB |
| **Python RAG Backend** | FastAPI + Uvicorn | `localhost:8000` | ChromaDB local persistent (`data/chromadb/`) |
| **OCR Engine** | PyTesseract (Tesseract-OCR system binary) | N/A | Hardcoded path: `C:\Program Files\Tesseract-OCR\tesseract.exe` |
| **Embedding Model** | Gemini `gemini-embedding-2` (768 dims) | N/A | Gemini API (remote) |
| **Generation Model** | Gemini `gemini-3.5-flash` | N/A | Gemini API (remote) |

---

### 🔧 Step 1: Database Migration — H2 → PostgreSQL

#### What Changes
The Java backend currently uses an H2 in-memory database. All user registrations, situations, lawyers, and case data are lost on every restart. Production requires a persistent PostgreSQL database.

#### Files to Modify

**`backend-java/src/main/resources/application.yml`** — Update the datasource block:
```yaml
# Current (local dev):
datasource:
  url: ${DB_URL:jdbc:h2:mem:nyayamitra;DB_CLOSE_DELAY=-1}
  username: ${DB_USERNAME:sa}
  password: ${DB_PASSWORD:}
  driver-class-name: ${DB_DRIVER:org.h2.Driver}

# Production: Set these via environment variables
# DB_URL=jdbc:postgresql://<host>:5432/<dbname>
# DB_USERNAME=<username>
# DB_PASSWORD=<password>
# DB_DRIVER=org.postgresql.Driver
# DDL_AUTO=validate
# FLYWAY_ENABLED=true
```

#### Steps Required
1. **Provision a PostgreSQL database** (Supabase, Railway, AWS RDS, or Neon).
2. **Set environment variables** `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER` on the hosting platform.
3. **Set `DDL_AUTO=validate`** so Hibernate no longer auto-creates tables (Flyway manages the schema).
4. **Set `FLYWAY_ENABLED=true`** to activate Flyway migrations.
5. **Verify** the existing migration script `db/migration/V1__create_schema.sql` runs cleanly on the target PostgreSQL instance.
6. **Disable the H2 console** by setting `spring.h2.console.enabled=false` or removing the block entirely.

#### Dependency Note
The `pom.xml` must include the PostgreSQL JDBC driver. Verify this dependency exists:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

### 🔧 Step 2: Vector Database Migration — Local ChromaDB → Cloud

#### What Changes
ChromaDB currently writes to `backend-python-rag/data/chromadb/` on the local filesystem. Cloud hosting platforms use ephemeral file systems — this data will be deleted on every restart or cold start.

#### Files to Modify

**`backend-python-rag/core/vector_store.py`** — Replace `PersistentClient` with a cloud-hosted solution:

| Option | What to Change |
|---|---|
| **Supabase pgvector** | Replace ChromaDB entirely with `langchain_community.vectorstores.SupabaseVectorStore` or raw `psycopg2` + pgvector queries. Enable the `vector` extension in your Supabase project. |
| **Chroma Cloud** | Replace `chromadb.PersistentClient(path=...)` with `chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)` pointing to a managed Chroma instance. |
| **Pinecone** | Replace ChromaDB with `langchain_pinecone.PineconeVectorStore`. Requires a Pinecone API key and index configured for 768 dimensions. |

#### Steps Required
1. **Choose a hosted vector DB provider** and provision the instance.
2. **Update `vector_store.py`** to connect via HTTP/API instead of local file path.
3. **Update `embedding_service.py`** if the vector DB expects a different insert format.
4. **Update `routers/search.py`** if the query interface changes (e.g., pgvector uses SQL instead of `.query()`).
5. **Add new environment variables** for the vector DB connection (see Step 6 below).
6. **Re-ingest all PDFs** after migration — the old local ChromaDB data does not transfer automatically.

#### Critical Constraint
All embeddings must remain **768-dimensional** (`output_dimensionality=768` on `gemini-embedding-2`). The target vector DB index must be configured for this dimension.

---

### 🔧 Step 3: Tesseract OCR Deployment

#### What Changes
The OCR service currently has a **hardcoded Windows path** to the Tesseract binary:
```python
# ocr_service.py line 6-8
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)
```
This path does not exist on Linux-based cloud containers.

#### Option A: Install Tesseract in the Container (Simple)

**Steps Required:**
1. **Create a `Dockerfile`** for the Python RAG backend that installs Tesseract:
   ```dockerfile
   FROM python:3.11-slim

   # Install Tesseract OCR + language data
   RUN apt-get update && apt-get install -y \
       tesseract-ocr \
       tesseract-ocr-hin \
       tesseract-ocr-eng \
       libgl1-mesa-glx \
       poppler-utils \
       && rm -rf /var/lib/apt/lists/*

   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Update `ocr_service.py`** to remove the hardcoded Windows path:
   ```python
   import os
   import platform

   if platform.system() == "Windows":
       pytesseract.pytesseract.tesseract_cmd = (
           r"C:\Program Files\Tesseract-OCR\tesseract.exe"
       )
   # On Linux/Docker, tesseract is in PATH by default after apt install
   ```

3. **Add Hindi language data** (`tesseract-ocr-hin`) since the OCR uses `lang="eng+hin"`.

4. **Container image size impact:** Tesseract + language packs add ~100–150 MB to the container image.

#### Option B: Cloud OCR API (Lightweight)

**Steps Required:**
1. **Replace PyTesseract calls** in `ocr_service.py` with a cloud OCR API:
   - **Google Cloud Vision API** — Best accuracy for Hindi + English mixed documents.
   - **AWS Textract** — Good for structured documents.
   - **OCR.space API** — Free tier available, simple REST API.
2. **Remove `pytesseract` and `pillow`** from `requirements.txt`.
3. **Add the cloud SDK** (e.g., `google-cloud-vision`) to `requirements.txt`.
4. **Add the API key/credentials** as an environment variable.

---

### 🔧 Step 4: Frontend Deployment

#### What Changes
The Next.js 16 frontend is a stateless SPA that communicates with both backends via API calls.

#### Files to Modify
Any file that references `localhost:5000` (Java backend) or `localhost:8000` (Python backend) must use environment variables instead.

#### Steps Required
1. **Set `NEXT_PUBLIC_API_URL`** environment variable on the hosting platform pointing to the production Java backend URL.
2. **Set `NEXT_PUBLIC_RAG_API_URL`** environment variable pointing to the production Python RAG backend URL.
3. **Update `NEXT_PUBLIC_GEMINI_API_KEY`** — the frontend uses `@google/generative-ai` SDK directly for some features. This key must be set as an environment variable, **never hardcoded**.
4. **Build and deploy:**
   ```bash
   npm run build   # Creates the production .next/ bundle
   npm run start   # Starts the production server
   ```
5. **Recommended hosting:** Vercel (zero-config for Next.js), Netlify, or Cloudflare Pages.

---

### 🔧 Step 5: Java Backend Deployment

#### What Changes
The Spring Boot backend needs a production-ready JAR build and a hosted environment.

#### Steps Required
1. **Build the production JAR:**
   ```bash
   cd backend-java
   mvn clean package -DskipTests
   # Output: target/nyayamitra-backend-0.0.1-SNAPSHOT.jar
   ```
2. **Create a `Dockerfile`** (if not deploying to a JVM-native host):
   ```dockerfile
   FROM eclipse-temurin:21-jre-alpine
   WORKDIR /app
   COPY target/*.jar app.jar
   EXPOSE 5000
   ENTRYPOINT ["java", "-jar", "app.jar"]
   ```
3. **Set all required environment variables** on the hosting platform (see Step 6).
4. **Recommended hosting:** Railway, Render, AWS Elastic Beanstalk, or Google Cloud Run.

---

### 🔧 Step 6: Python RAG Backend Deployment

#### What Changes
The FastAPI microservice needs a production ASGI server and containerization.

#### Steps Required
1. **Create a `Dockerfile`** (see Step 3 for Tesseract-inclusive version).
2. **Use Gunicorn + Uvicorn workers** for production instead of raw `uvicorn --reload`:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```
3. **Add `gunicorn`** to `requirements.txt`.
4. **Lock CORS origins** in `main.py`:
   ```python
   # Replace allow_origins=["*"] with:
   allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")]
   ```
5. **Recommended hosting:** Railway, Render, Google Cloud Run, or AWS ECS.

---

### 🔧 Step 7: Complete Environment Variables Reference

#### Java Backend (`backend-java`)

| Variable | Local Default | Production Value | Required |
|---|---|---|---|
| `DB_URL` | `jdbc:h2:mem:nyayamitra` | `jdbc:postgresql://<host>:5432/<dbname>` | ✅ |
| `DB_USERNAME` | `sa` | PostgreSQL username | ✅ |
| `DB_PASSWORD` | *(empty)* | PostgreSQL password | ✅ |
| `DB_DRIVER` | `org.h2.Driver` | `org.postgresql.Driver` | ✅ |
| `DDL_AUTO` | `update` | `validate` | ✅ |
| `FLYWAY_ENABLED` | `false` | `true` | ✅ |
| `GEMINI_API_KEY` | *(from .env)* | Valid Gemini API key | ✅ |
| `JWT_SECRET` | `nyayamitra_super_secret_...` | Strong random 256-bit key | ✅ |
| `FRONTEND_URL` | `http://localhost:3000` | Production frontend domain (e.g. `https://nyayamitra.vercel.app`) | ✅ |

#### Python RAG Backend (`backend-python-rag`)

| Variable | Local Default | Production Value | Required |
|---|---|---|---|
| `GEMINI_API_KEY` | *(from .env)* | Valid Gemini API key | ✅ |
| `GOOGLE_API_KEY` | *(alternative to above)* | Same key (either variable works) | ⬜ |
| `FRONTEND_URL` | `*` (all origins) | Production frontend domain | ✅ |
| `CHROMA_HOST` | N/A (local persistent) | Cloud ChromaDB host (if using Chroma Cloud) | Depends on vector DB choice |
| `CHROMA_PORT` | N/A | Cloud ChromaDB port | Depends on vector DB choice |
| `SUPABASE_URL` | N/A | Supabase project URL (if using pgvector) | Depends on vector DB choice |
| `SUPABASE_KEY` | N/A | Supabase service role key | Depends on vector DB choice |
| `HOST` | `0.0.0.0` | `0.0.0.0` | ⬜ |
| `PORT` | `8000` | Platform-assigned or `8000` | ⬜ |

#### Frontend (`frontend`)

| Variable | Local Default | Production Value | Required |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Production Java backend URL | ✅ |
| `NEXT_PUBLIC_RAG_API_URL` | `http://localhost:8000` | Production Python RAG backend URL | ✅ |
| `NEXT_PUBLIC_GEMINI_API_KEY` | *(from code/env)* | Valid Gemini API key | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | *(from code/env)* | Google Maps API key (for lawyer locator) | ✅ |

---

### 🔧 Step 8: Infrastructure Requirements

#### Minimum Production Infrastructure

| Service | Recommended Provider | Tier | Estimated Cost |
|---|---|---|---|
| **Frontend Hosting** | Vercel / Netlify | Free tier | $0 |
| **Java Backend Hosting** | Railway / Render | Free–Starter tier | $0–$7/mo |
| **Python RAG Backend Hosting** | Railway / Render | Free–Starter tier | $0–$7/mo |
| **PostgreSQL Database** | Supabase / Neon / Railway | Free tier (500 MB) | $0 |
| **Vector Database** | Supabase pgvector / Pinecone | Free tier | $0 |
| **Gemini API** | Google AI Studio | Free tier (60 RPM) | $0 |
| **Domain Name** | Namecheap / Cloudflare | Annual | ~$10/yr |

#### System Dependencies per Container

| Dependency | Component | Why It's Needed |
|---|---|---|
| **Java 21 JRE** | Java Backend | Spring Boot runtime |
| **Python 3.11** | Python RAG Backend | FastAPI + LangChain runtime |
| **Tesseract OCR** | Python RAG Backend | PDF image → text extraction |
| **tesseract-ocr-eng** | Python RAG Backend | English language data |
| **tesseract-ocr-hin** | Python RAG Backend | Hindi language data |
| **poppler-utils** | Python RAG Backend | PDF rendering for pdfplumber |
| **libgl1-mesa-glx** | Python RAG Backend | OpenCV/Pillow image processing dependency |
| **Node.js 20+** | Frontend | Next.js build and SSR runtime |

---

### 🔧 Step 9: Security Hardening for Production

| Item | Current State | Production Requirement |
|---|---|---|
| **JWT Secret** | Hardcoded fallback: `nyayamitra_super_secret_key_change_in_production_2024` | Generate a cryptographically random 256-bit secret. Set via `JWT_SECRET` env var. |
| **CORS Origins** | Java: `http://localhost:3000`, Python: `*` (all origins) | Restrict to exact production frontend domain only. |
| **API Key Exposure** | Gemini key in `.env` file and potentially in frontend bundle | Use server-side proxying for API keys. Never expose keys in `NEXT_PUBLIC_*` variables if avoidable. |
| **H2 Console** | Enabled at `/h2-console` | Disable entirely (`spring.h2.console.enabled=false`). |
| **HTTPS** | Not enforced | Enforce HTTPS on all endpoints. Most hosting platforms handle this automatically. |
| **Rate Limiting** | None | Add rate limiting middleware to both backends to prevent abuse. |
| **Helmet Headers** | None | Add security headers (CSP, X-Frame-Options, etc.) to the frontend and backend responses. |

---

### 🔧 Step 10: Deployment Steps (Ordered Sequence)

Execute these steps in order to deploy NyayaMitra to production:

#### Phase A: Database & Infrastructure Setup
1. **Provision a PostgreSQL database** on Supabase (or your chosen provider).
2. **Enable the `vector` extension** in PostgreSQL if using pgvector for embeddings:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. **Copy the database connection credentials** (URL, username, password).
4. **Verify the Flyway migration** runs against the production database by running it locally with production credentials first.

#### Phase B: Backend Deployment
5. **Deploy the Java Backend:**
   - Set all Java environment variables (see Step 7 table above).
   - Build the JAR: `mvn clean package -DskipTests`.
   - Deploy the JAR or Docker image to Railway/Render/Cloud Run.
   - Verify `/api-docs` loads and health checks pass.

6. **Deploy the Python RAG Backend:**
   - Build the Docker image with Tesseract (see Step 3 Dockerfile).
   - Set all Python environment variables (see Step 7 table above).
   - Deploy to Railway/Render/Cloud Run.
   - Verify `/ping` returns `{"status": "ok"}`.

7. **Note the production URLs** for both backends (e.g., `https://nyayamitra-api.railway.app` and `https://nyayamitra-rag.railway.app`).

#### Phase C: Frontend Deployment
8. **Set environment variables** on Vercel/Netlify:
   - `NEXT_PUBLIC_API_URL` → Java backend production URL
   - `NEXT_PUBLIC_RAG_API_URL` → Python RAG backend production URL
   - `NEXT_PUBLIC_GEMINI_API_KEY` → Gemini API key
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` → Google Maps API key
9. **Push to the Git repository** — Vercel/Netlify auto-builds from the `frontend/` directory.
10. **Note the production frontend URL** (e.g., `https://nyayamitra.vercel.app`).

#### Phase D: Cross-Service Configuration
11. **Update CORS on both backends** to use the production frontend URL:
    - Java: Set `FRONTEND_URL` env var.
    - Python: Set `FRONTEND_URL` env var and update `main.py` to read it.
12. **Redeploy both backends** with the updated CORS configuration.

#### Phase E: Data Seeding & Verification
13. **Verify database seeding:** Check that Flyway migrations ran and seed data (situations, lawyers, law sections) is populated.
14. **Re-ingest legal PDFs** via the Knowledge Base upload interface on the production frontend.
15. **Test the full flow end-to-end:**
    - User registration → Login → Dashboard loads.
    - Upload a PDF → OCR + chunking + embedding succeeds.
    - Ask a legal question → RAG retrieval + Gemini generation returns a grounded answer.
    - Chatbot → Multi-turn conversation works.
    - Rights explanation → Returns structured JSON response.
    - Document translation → Simplification works in Hindi and English.

---

### 📋 Quick Reference: Files Requiring Production Changes

| File | Change Required |
|---|---|
| `backend-java/src/main/resources/application.yml` | Set `gemini.model` to `gemini-3.5-flash`. All other values are already environment-variable driven. |
| `backend-java/src/main/java/.../AiService.java` | Update default fallback from `gemini-1.5-flash` to `gemini-3.5-flash`. |
| `backend-python-rag/services/ocr_service.py` | Remove/conditionally set hardcoded Windows Tesseract path. |
| `backend-python-rag/core/vector_store.py` | Replace `PersistentClient(path=...)` with cloud vector DB connection. |
| `backend-python-rag/main.py` | Replace `allow_origins=["*"]` with environment variable. |
| `backend-python-rag/requirements.txt` | Add `gunicorn`. Optionally replace `pytesseract` with cloud OCR SDK. |
| `frontend/.env.local` | Set all `NEXT_PUBLIC_*` variables to production URLs and keys. |
