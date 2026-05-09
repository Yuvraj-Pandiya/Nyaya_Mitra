# NyayaMitra — AI-Enhanced Legal Aid Platform for First-Generation Litigants

**Live Working Demo Link:** https://project-legal-o8gx.vercel.app/

**Screenshots / Screen Recording:**
<img width="1919" height="906" alt="Screenshot 2026-04-01 151421" src="https://github.com/user-attachments/assets/66be4d7e-2a1c-493f-8314-5de9d1d2bc4c" />
Video Link - https://drive.google.com/file/d/16jZc6bzrzVmW7RAoTZ9VGD_YB8O0mVpA/view?usp=sharing
---

## 👥 Team Details

**Project Title:** NyayaMitra — AI-Enhanced Legal Aid Platform for First-Generation Litigants  
**Team Name:** Team Fusion Optimizer
**Team Members:**
- Swayam Garg
- Yuvraj Pandiya
- Ajay Sahani
- Nikhil Singh Rajput

---

## 🎯 Problem Statement (WD-04)

India has over **45 million pending court cases**, leaving first-generation litigants overwhelmed by legal jargon and complex procedures. **NyayaMitra** bridges this gap by providing a guided, bilingual (Hindi + English) legal aid experience.

When a user selects a life situation (e.g. Landlord Dispute, Consumer Complaint, FIR Filing), the platform:

1. **Explains Legal Rights** in plain language using Google Gemini AI, alongside the actual law text.
2. Generates an interactive **Document Checklist** and **Step-by-Step Procedure**.
3. Shows a **Map-Based Legal Aid Directory** of nearby pro bono lawyers and NALSA clinics.
4. Produces a **Filled-In Legal Document** (RTI, FIR Draft, Consumer Complaint) as a downloadable PDF.

---

## 🏗 Architecture

### System Diagram

```mermaid
graph TD
    Client[Browser / Mobile UI]
    NextJS["Next.js 16 Frontend (React 19 + TypeScript)"]
    SpringBoot["Java Spring Boot 3 Backend (Port 5000)"]
    H2[("H2 In-Memory DB (dev) / PostgreSQL (prod)")]
    Gemini[Google Gemini 1.5 Flash API]
    Maps[Google Maps API]
    jsPDF[jsPDF — Client-Side PDF Generation]

    Client <-->|Bilingual UI| NextJS
    NextJS <-->|REST API / JWT Auth| SpringBoot
    SpringBoot <-->|JPA / Hibernate| H2
    SpringBoot <-->|AI Prompts| Gemini
    NextJS <-->|Geolocation + Maps| Maps
    NextJS -->|Document Generation| jsPDF
```

### 2. System Workflow / User Flow

*Eraser Prompt for diagram generation:*<br/>
<img width="1164" height="605" alt="Screenshot 2026-04-01 144958" src="https://github.com/user-attachments/assets/a9992d19-d705-4424-833a-e5ec705a1bca" />

### Request Flow

```text
User → Situation Selector → Rights Explainer (Gemini AI)
     → Step-by-Step Procedure → Document Checklist
     → [Generate PDF Document] OR [Find Pro Bono Lawyer on Map]
```

---

## 📁 Folder Structure

```text
hackathon3/
├── backend-java/                      # ✅ ACTIVE BACKEND — Spring Boot 3 / Java 21
│   ├── src/main/java/com/nyayamitra/
│   │   ├── controller/                # REST Controllers (AI, Auth, Lawyers, Situations)
│   │   ├── service/                   # Business logic (AiService, AuthService, ...)
│   │   ├── entity/                    # JPA Entities (Situation, Lawyer, AppUser, ...)
│   │   ├── repository/                # Spring Data JPA Repositories
│   │   ├── dto/                       # Request / Response DTOs
│   │   ├── security/                  # JWT filter, JwtUtils, SecurityConfig
│   │   ├── config/                    # CORS, Swagger / OpenAPI config
│   │   └── exception/                 # Global exception handler
│   ├── src/main/resources/
│   │   ├── application.yml            # Server config (port, DB, JWT, Gemini)
│   │   └── data/                      # Seed JSON data (situations, lawyers)
│   └── pom.xml                        # Maven build — Spring Boot 3.2.5, Java 21
│
└── frontend/                          # Next.js 16 (React 19) App
    ├── app/                           # App Router pages
    │   ├── page.tsx                   # Home / Landing
    │   ├── situations/                # Situation list + detail pages
    │   ├── generate/[slug]/           # Document generation wizard
    │   ├── lawyers/                   # Pro bono lawyer map
    │   └── about/                     # About page
    ├── components/                    # Reusable UI components
    ├── data/                          # Static situation JSON (client-side fallback)
    ├── lib/
    │   └── pdfGenerator.ts            # jsPDF — RTI, FIR, Consumer Complaint, Checklist
    ├── types/index.ts                 # Shared TypeScript interfaces (DocumentFormData, ...)
    └── locales/                       # i18next dictionaries (en, hi)
```

---

## ⚙️ Setup & Installation

### Prerequisites

| Requirement | Version |
|---|---|
| **Java (JDK)** | 21+ |
| **Maven** | Bundled via `mvnw` wrapper |
| **Node.js** | 18+ |
| **npm** | 9+ |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Swayam7Garg/Project_Legal.git
cd Project_Legal
```

---

### Step 2 — Backend Setup (Java Spring Boot)

```bash
cd backend-java

# Windows
mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```

> The backend starts on **http://localhost:5000**  
> H2 Console (dev): **http://localhost:5000/h2-console**  
> Swagger UI: **http://localhost:5000/swagger-ui.html**  
> API Docs: **http://localhost:5000/api-docs**

**Optional — configure environment variables** (see section below) before running if you need Gemini AI features or PostgreSQL.

---

### Step 3 — Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

> Frontend runs on **http://localhost:3000**

---

## 🔑 Environment Variables

### `backend-java/src/main/resources/application.yml` (or as OS env vars)

| Variable | Default (dev) | Description |
|---|---|---|
| `DB_URL` | `jdbc:h2:mem:nyayamitra` | JDBC URL — use PostgreSQL URL in prod |
| `DB_USERNAME` | `sa` | Database username |
| `DB_PASSWORD` | *(empty)* | Database password |
| `DB_DRIVER` | `org.h2.Driver` | Use `org.postgresql.Driver` for prod |
| `JWT_SECRET` | *(dev key bundled)* | **Change before production** |
| `GEMINI_API_KEY` | *(bundled dev key)* | Google Gemini API key |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |

**For PostgreSQL in production**, override:
```bash
export DB_URL=jdbc:postgresql://host:5432/nyayamitra
export DB_USERNAME=postgres
export DB_PASSWORD=yourpassword
export DB_DRIVER=org.postgresql.Driver
export JWT_SECRET=your_very_long_random_secret
export GEMINI_API_KEY=your_gemini_key
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

---

## 🌐 API Endpoints

All endpoints are documented interactively at **http://localhost:5000/swagger-ui.html**.

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/api/situations` | List all legal situations (summary) | Public |
| `GET` | `/api/situations/{id}` | Full situation detail by slug | Public |
| `GET` | `/api/lawyers` | Search pro-bono lawyers (`?city=&state=&specialization=`) | Public |
| `GET` | `/api/lawyers/city/{city}` | All lawyers in a city | Public |
| `POST` | `/api/ai/explain-rights` | Gemini AI — explain rights for a situation | Public |
| `POST` | `/api/ai/analyze-case` | Gemini AI — analyze user's legal position | Public |
| `POST` | `/api/ai/chat` | Gemini AI — multi-turn legal chatbot | Public |
| `POST` | `/api/ai/translate-document` | Gemini AI — simplify legal document text | Public |
| `POST` | `/api/auth/register` | Register a new user (returns JWT) | Public |
| `POST` | `/api/auth/login` | Login (returns JWT) | Public |
| `GET` | `/api/health` | Health check | Public |

---

## 🗄 Database Schema

```mermaid
erDiagram
    SITUATION {
        string slug PK
        string category
        string title_en
        string title_hi
        string description_en
        string description_hi
        string template_type
    }
    LAWYER {
        string id PK
        string name
        string city
        string state
        string phone
        boolean pro_bono
        double lat
        double lng
    }
    APP_USER {
        long id PK
        string username UK
        string email UK
        string password
        set roles
        boolean enabled
    }
    CHECKLIST_ITEM {
        long id PK
        string item_en
        string item_hi
        boolean required
    }

    SITUATION ||--o{ CHECKLIST_ITEM : "has"
    SITUATION ||--o{ LAWYER : "matched by specialization"
```

---

## 🔐 Security & Auth

- **Spring Security + JWT** (JJWT 0.12.5) protects admin-level routes.
- All core public-good features (situations, lawyers, AI, PDF generation) are **publicly accessible** — no login required — to maximize reach for marginalized communities.
- The `ROLE_ADMIN` role is reserved for future content administration (updating lawyers, situations).
- JWT tokens expire after **24 hours** (configurable via `jwt.expiration-ms`).

---

## 📝 Sample Test Inputs

### AI Document Simplification (`POST /api/ai/translate-document`)
```json
{
  "documentText": "Whoever, being in any manner entrusted with property, dishonestly misappropriates or converts to his own use that property, commits criminal breach of trust. (IPC Section 405)",
  "lang": "en"
}
```

### Legal Chatbot (`POST /api/ai/chat`)
```json
{
  "situationId": "landlord-dispute",
  "messages": [
    { "role": "user", "content": "My landlord is refusing to return my security deposit of ₹20,000. What are my rights?" }
  ],
  "lang": "hi"
}
```

### Lawyer Search
```
GET http://localhost:5000/api/lawyers?city=Indore&specialization=Consumer%20Rights
```

---

## 🤖 AI & Ethics Declaration

### AI Usage
- **Google Gemini 1.5 Flash** — Used via direct REST calls (`RestTemplate`) for:
  - Legal rights explanation in plain Hindi/English
  - Multi-turn legal chatbot
  - Legal document simplification
- **GitHub Copilot / AI Assistants** — Used for boilerplate generation, debugging, and refactoring during development.
- **Strict Prompt Constraints:** System instructions ensure the LLM never halluccinates laws, targets an 8th-grade reading level, and always declares: *"This is legal information, not legal advice."*

### Data Sources
- **Real Legal Sources:** Laws, rights, and NALSA structures are referenced from [IndiaCode](https://indiacode.nic.in) and [NALSA](https://nalsa.gov.in).
- **Synthetic Data:** Lawyer directory entries (specifically Indore, MP names/numbers) use synthetic data for safe demo testing. Delhi entries map to real public NALSA addresses.

---

## 🏆 Domain-Specific Highlights (WD-04 Criteria)

| Criterion | Implementation |
|---|---|
| **Bilingual Support** | Full Hindi + English UI via `react-i18next`; all AI responses also bilingual |
| **Legal Document Generation** | Client-side jsPDF — RTI, FIR Draft, Consumer Complaint, Labour Rights |
| **Role-Based Access** | Public for all core features; JWT-protected for future admin role |
| **Map Integration** | `@react-google-maps/api` with lawyer markers and proximity filters |
| **Database** | H2 (dev) / PostgreSQL (prod) via Spring Data JPA |
| **Swagger / OpenAPI** | Full API documentation at `/swagger-ui.html` |
