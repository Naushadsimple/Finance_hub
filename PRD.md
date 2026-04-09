================================================================================
                        FINANCE HUB — PRODUCT REQUIREMENTS DOCUMENT
                                        PRD v1.0
                          Web Portal — Financial Services Platform
================================================================================

  Document Version : v1.0 — Initial Release
  Date             : April 2026
  Project Name     : Finance Hub Web Portal
  Status           : Approved for Development
  Tech Stack       : React · Supabase (Supabase MCP already connected) · PostgreSQL · Tailwind CSS · GSAP
  Theme            : Sky Blue (#0EA5E9) & White — Responsive, Mobile-First
  Security Level   : Multi-User · Role-Based Access · Encrypted via .env

================================================================================
                              EXECUTIVE SUMMARY
================================================================================

Finance Hub is a multi-user financial services web portal offering clients a
secure dashboard to track fixed-return investments (1% monthly / 12% annually),
view and download investment certificates, and manage their profiles.

The platform also serves as a lead-generation tool, capturing prospective
investor inquiries via a public landing page.

IMPORTANT ARCHITECTURE DECISION:
  The Admin Portal and User Portal are TWO COMPLETELY SEPARATE React projects.
  They share the same Supabase backend (same DB + Auth) but are:
    - Developed independently
    - Deployed independently (different domains/subdomains)
    - Have no shared codebase

  finance-hub-user/   → Deployed on: app.financehub.com   (or user.financehub.com)
  finance-hub-admin/  → Deployed on: admin.financehub.com
  
  Both projects read from the same Supabase project but use different
  RLS policies to enforce access control.

================================================================================
                         TABLE OF CONTENTS
================================================================================

  1.  Introduction & Goals
  2.  User Personas & Roles
  3.  Project Structure (Separate Repos)
  4.  Functional Requirements
        4.1  Authentication
        4.2  Public Landing Page (User App)
        4.3  User Dashboard Pages
        4.4  Admin Panel Pages
  5.  UI/UX Requirements
  6.  GSAP Animation Specifications
  7.  Database Schema (Supabase / PostgreSQL)
  8.  Security Requirements (RLS + .env)
  9.  API Routes
  10. Feature Priority Matrix
  11. Tech Stack
  12. Code Quality & Optimization
  13. Non-Functional Requirements
  14. Sprint Plan
  15. Open Questions & Risks
  16. Document Approval

================================================================================
  SECTION 1 — INTRODUCTION & GOALS
================================================================================

1.1 PROBLEM STATEMENT
----------------------
Existing clients lack a centralized digital platform to:
  - Monitor their investments and monthly returns
  - Access and download official investment certificates
  - View their registered profile information

Simultaneously, there is no structured system to capture and manage prospective
investor leads, leading to missed business opportunities.

1.2 GOALS & SUCCESS METRICS
-----------------------------

  GOAL                                   SUCCESS METRIC
  ─────────────────────────────────────  ──────────────────────────────────────
  Client self-service portal             100% of clients can access dashboard
  Lead capture automation                All form submissions stored in DB
  Certificate availability               Downloadable within 2 clicks
  Security compliance                    Zero unauthorized cross-user data reads
  Performance                            LCP < 2s on 4G, Lighthouse score >= 90
  Responsiveness                         Fully functional from 320px to 2560px
  Separate hosting                       Admin and user apps independently live

1.3 SCOPE
----------

IN SCOPE:
  - finance-hub-user/  → Client-facing app (public landing + authenticated dashboard)
  - finance-hub-admin/ → Admin-only app (full CRUD on clients, investments, leads)
  - Shared Supabase backend (same project, same DB)
  - Investment certificate storage (Supabase Storage Buckets)
  - GSAP-powered animations and micro-interactions
  - Fully responsive mobile-first design
  - All secrets managed via .env files

OUT OF SCOPE:
  - Payment gateway or fund transfer
  - Mobile native app (iOS/Android)
  - Real-time trading or live market feeds
  - Third-party KYC integration (Phase 2)
  - Shared codebase / monorepo between admin and user

================================================================================
  SECTION 2 — USER PERSONAS & ROLES
================================================================================

  ROLE               ACCESS LEVEL     KEY ACTIONS                       APP
  ─────────────────  ───────────────  ────────────────────────────────  ────────────────────────
  Authenticated      Read-only        View investments, download         finance-hub-user/
  Client             (own data only)  certificates, update profile,      (financehub.com)
                                      raise support tickets

  Admin              Full CRUD        Manage clients, upload certs,      finance-hub-admin/
                                      create investments, view leads,    (financehubadmin.com)
                                      change lead statuses, export CSV

  Public Visitor     None             View landing page, submit lead     finance-hub-user/
                     (anon key)       inquiry form                       (financehub.com)

================================================================================
  SECTION 3 — PROJECT STRUCTURE (SEPARATE REPOSITORIES)
================================================================================

  BOTH projects connect to the SAME Supabase backend.
  Both have their OWN .env.local file with the same Supabase credentials.
  They are deployed to different domains.

────────────────────────────────────────────────────────────────────────────────
  3.1  finance-hub-user/   (User + Public App)
────────────────────────────────────────────────────────────────────────────────

  finance-hub-user/
  ├── public/
  │   └── favicon.ico
  ├── src/
  │   ├── assets/
  │   │   └── logo.svg
  │   │
  │   ├── auth/                          ← Authentication pages (shared between public + user)
  │   │   ├── SignIn.jsx
  │   │   ├── SignUp.jsx
  │   │   ├── ForgotPassword.jsx
  │   │   └── ProtectedRoute.jsx         ← Redirects to /sign-in if no session
  │   │
  │   ├── public/                        ← NO AUTH required pages
  │   │   ├── LandingPage.jsx            ← Hero + Services + Calculator + Lead Form
  │   │   ├── LeadForm.jsx               ← Standalone lead inquiry component
  │   │   ├── ServiceSection.jsx
  │   │   ├── HeroSection.jsx
  │   │   ├── InvestmentCalculator.jsx
  │   │   └── PublicHeader.jsx           ← "Finance Hub" branding, Sign In button
  │   │
  │   ├── user/                          ← AUTH required — role must be 'client'
  │   │   ├── layout/
  │   │   │   ├── UserLayout.jsx         ← Sidebar + Header wrapper
  │   │   │   └── UserSidebar.jsx        ← My Investments | Certificates | Support
  │   │   │
  │   │   ├── pages/
  │   │   │   ├── UserDashboard.jsx      ← Overview KPI cards
  │   │   │   ├── MyInvestments.jsx      ← Investment history + interest summary
  │   │   │   ├── Certificates.jsx       ← List + download signed URL
  │   │   │   ├── Profile.jsx            ← View + edit phone/address
  │   │   │   └── Support.jsx            ← FAQs + Support ticket form
  │   │   │
  │   │   └── components/
  │   │       ├── InvestmentCard.jsx
  │   │       ├── InterestSummary.jsx
  │   │       ├── CertificateCard.jsx
  │   │       └── SupportTicketForm.jsx
  │   │
  │   ├── hooks/                         ← Custom React hooks
  │   │   ├── useProfile.js
  │   │   ├── useInvestments.js
  │   │   ├── useCertificates.js
  │   │   └── useSupport.js
  │   │
  │   ├── lib/
  │   │   └── supabaseClient.js          ← Supabase init — reads VITE_SUPABASE_URL etc.
  │   │
  │   ├── store/
  │   │   └── authStore.js               ← Zustand: session, user, role
  │   │
  │   ├── utils/
  │   │   ├── formatCurrency.js          ← ₹ Indian number formatting
  │   │   └── calculateInterest.js       ← 1% monthly interest logic
  │   │
  │   ├── constants/
  │   │   └── index.js                   ← MONTHLY_RATE=0.01, BUCKET_NAME, etc.
  │   │
  │   ├── App.jsx                        ← React Router routes for user app
  │   └── main.jsx
  │
  ├── .env.local                         ← SECRET — NEVER commit to Git
  ├── .env.example                       ← Template — safe to commit
  ├── .gitignore                         ← Must include: .env.local
  ├── tailwind.config.js
  ├── vite.config.js
  └── package.json

  .env.local (finance-hub-user):
  ─────────────────────────────
  VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
  VITE_APP_NAME=Finance Hub
  VITE_APP_URL=https://app.financehub.com
  VITE_STORAGE_BUCKET=certificates
  VITE_MONTHLY_RATE=0.01

  .env.example (finance-hub-user):
  ─────────────────────────────────
  VITE_SUPABASE_URL=your_supabase_url_here
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
  VITE_APP_NAME=Finance Hub
  VITE_APP_URL=your_app_url_here
  VITE_STORAGE_BUCKET=certificates
  VITE_MONTHLY_RATE=0.01


────────────────────────────────────────────────────────────────────────────────
  3.2  finance-hub-admin/  (Admin-Only App)
────────────────────────────────────────────────────────────────────────────────

  finance-hub-admin/
  ├── public/
  │   └── favicon.ico
  ├── src/
  │   ├── assets/
  │   │   └── logo.svg
  │   │
  │   ├── auth/                          ← Admin login ONLY — no public sign-up
  │   │   ├── AdminSignIn.jsx            ← Email + password login
  │   │   └── AdminProtectedRoute.jsx    ← Checks session AND role === 'admin'
  │   │                                     If not admin → redirect to /unauthorized
  │   │
  │   ├── pages/                         ← All pages require role === 'admin'
  │   │   ├── AdminDashboard.jsx         ← KPI cards + charts + recent activity
  │   │   ├── Clients.jsx                ← All clients list with search + filters
  │   │   ├── ClientDetail.jsx           ← Individual client profile + investments
  │   │   ├── Investments.jsx            ← Create / edit / close investments
  │   │   ├── Certificates.jsx           ← Upload + manage certificates
  │   │   ├── Leads.jsx                  ← Leads table + status update + export CSV
  │   │   ├── Settings.jsx               ← App settings, admin user management
  │   │   └── Unauthorized.jsx           ← Shown to non-admin users who land here
  │   │
  │   ├── components/
  │   │   ├── layout/
  │   │   │   ├── AdminLayout.jsx        ← Sidebar + topbar wrapper
  │   │   │   └── AdminSidebar.jsx       ← Full nav: Dashboard | Clients |
  │   │   │                                  Investments | Certificates | Leads | Settings
  │   │   ├── ClientsTable.jsx
  │   │   ├── InvestmentForm.jsx
  │   │   ├── CertificateUploader.jsx    ← Drag & drop upload to Supabase Storage
  │   │   ├── LeadsTable.jsx
  │   │   ├── LeadStatusBadge.jsx
  │   │   ├── KpiCard.jsx
  │   │   └── ActivityFeed.jsx
  │   │
  │   ├── hooks/
  │   │   ├── useClients.js
  │   │   ├── useInvestments.js          ← Admin version — can see all users
  │   │   ├── useCertificates.js         ← Admin version — upload + manage
  │   │   └── useLeads.js
  │   │
  │   ├── lib/
  │   │   └── supabaseClient.js          ← Same pattern, different .env values
  │   │
  │   ├── store/
  │   │   └── adminAuthStore.js
  │   │
  │   ├── utils/
  │   │   ├── formatCurrency.js
  │   │   ├── exportToCSV.js             ← Leads export utility
  │   │   └── calculateInterest.js
  │   │
  │   ├── constants/
  │   │   └── index.js
  │   │
  │   ├── App.jsx                        ← React Router routes for admin app
  │   └── main.jsx
  │
  ├── .env.local                         ← SECRET — NEVER commit to Git
  ├── .env.example                       ← Template — safe to commit
  ├── .gitignore                         ← Must include: .env.local
  ├── tailwind.config.js
  ├── vite.config.js
  └── package.json

  .env.local (finance-hub-admin):
  ─────────────────────────────────
  VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
  VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...   ← ADMIN ONLY
  VITE_APP_NAME=Finance Hub Admin
  VITE_APP_URL=https://admin.financehub.com
  VITE_USER_APP_URL=https://app.financehub.com
  VITE_STORAGE_BUCKET=certificates
  VITE_MONTHLY_RATE=0.01

  .env.example (finance-hub-admin):
  ──────────────────────────────────
  VITE_SUPABASE_URL=your_supabase_url_here
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
  VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
  VITE_APP_NAME=Finance Hub Admin
  VITE_APP_URL=your_admin_url_here
  VITE_USER_APP_URL=your_user_app_url_here
  VITE_STORAGE_BUCKET=certificates
  VITE_MONTHLY_RATE=0.01

  IMPORTANT:
    SERVICE_ROLE_KEY is ONLY in the admin app .env.
    It is NEVER included in finance-hub-user/.env.local
    It bypasses RLS — must be used only in Supabase Edge Functions
    or server-side admin operations, NEVER directly in React components.

================================================================================
  SECTION 4 — FUNCTIONAL REQUIREMENTS
================================================================================

4.1 AUTHENTICATION
-------------------

  finance-hub-user/ (client auth):
    - Sign-Up: Email + password via Supabase Auth
    - Sign-In: Email + password; session stored by Supabase JS v2 (in-memory)
    - Forgot Password: Supabase magic-link email reset flow
    - On Sign-Up: DB trigger creates a profiles row with role = 'client'
    - ProtectedRoute: Checks for active session — redirects to /sign-in if none
    - Session Timeout: Auto sign-out after 60 minutes of inactivity
    - No admin login exists in this app

  finance-hub-admin/ (admin auth):
    - Sign-In ONLY: No sign-up page — admins are created manually via Supabase Studio
    - AdminProtectedRoute: Checks session AND verifies profiles.role === 'admin'
    - If role !== 'admin': User sees /unauthorized page (not a redirect to user app)
    - Session Timeout: Auto sign-out after 30 minutes of inactivity (stricter for admin)


4.2 PUBLIC LANDING PAGE  (finance-hub-user/  —  route: /)
-----------------------------------------------------------

  PublicHeader:
    - "Finance Hub" logo/branding on top-left
    - Sign In button (top-right) → /sign-in
    - Smooth scroll navigation links

  HeroSection:
    - Full-width animated banner (GSAP fade-in + stagger on load)
    - Headline: "Earn 1% Monthly Returns on Your Investment"
    - Subheadline: "Safe. Transparent. Growing."
    - CTA button: "Start Investing" → smooth scroll to lead form
    - CTA button: "Sign In to Dashboard" → /sign-in

  ServiceSection:
    - How It Works: 3-step visual flow
        Step 1: Invest your capital
        Step 2: Earn 1% every month (12% per year)
        Step 3: Track everything on your dashboard
    - Trust badges: Total AUM, Active Clients, Years of Operation

  InvestmentCalculator:
    - Interactive slider: Investment amount (₹10,000 – ₹50,00,000)
    - Display: Monthly return, Annual return, 3-year projection
    - Live calculation using MONTHLY_RATE constant from .env

  LeadForm (route: / — section):
    - Fields: Full Name, Phone Number, Email ID, Proposed Investment Amount (₹)
    - Validation: React Hook Form + Zod (client-side) + duplicate email check (server-side)
    - On Submit: INSERT into leads table (anon key allowed for this table only via RLS)
    - Success: GSAP checkmark draw animation + toast notification
    - Form resets after successful submission
    - Rate limited: 3 submissions per IP per hour (Supabase Edge Function middleware)


4.3 USER DASHBOARD  (finance-hub-user/  —  requires auth, role = 'client')
-----------------------------------------------------------------------------

  Sidebar Navigation (UserSidebar):
    - "Finance Hub" branding at top
    - My Investments
    - Certificates
    - Support
    - Profile (icon at bottom)
    - Sign Out (icon at bottom)
    - On mobile: collapses to bottom navigation bar

  4.3.1 USER DASHBOARD — /user/dashboard
    - Welcome message with user's name
    - KPI Cards (GSAP stagger fade-in on load):
        Total Principal Invested (₹)
        Monthly Interest Earned (principal × 1%)
        Annual Projected Return (principal × 12%)
        Active Investments Count
    - Number count-up animation on all KPI values (GSAP ticker)
    - Recent Activity: Latest 3 investment entries

  4.3.2 MY INVESTMENTS — /user/investments
    - Investment Summary Card:
        Principal Amount (₹)
        Monthly Interest (₹) — principal × MONTHLY_RATE
        Annual Interest (₹) — principal × 12 × MONTHLY_RATE
        Start Date, Tenure (months), Maturity Date
        Status Badge: Active (green) | Matured (blue) | Pending (orange)
    - Investment History Table:
        All rows from investments table where user_id = current user
        Columns: Date, Principal (₹), Monthly Return (₹), Status, Tenure
    - Note: Users can ONLY view — no create/edit access

  4.3.3 CERTIFICATES — /user/certificates
    - Certificate Cards listing all certificates linked to user
    - Each card shows: Certificate Number, Issued Date, Related Investment
    - Preview: Inline PDF embed or image thumbnail
    - Download Button: Fetches a signed Supabase Storage URL
        URL expires after 60 minutes (regenerated on each download click)
        Path format: certificates/clients/{userId}/{filename}
    - Empty state if no certificates uploaded yet

  4.3.4 PROFILE — /user/profile
    - Display: Full Name, Email, Phone, Address, Client Code, Registration Date
    - Editable fields: Phone Number, Address only
    - Email change requires admin intervention (display note to user)
    - Save triggers PATCH to profiles table (user can only update own row via RLS)

  4.3.5 SUPPORT — /user/support
    - FAQ Accordion (GSAP animated expand/collapse)
    - Support Ticket Form:
        Fields: Subject (dropdown), Message
        On Submit: INSERT into support_tickets table
    - Contact Info: Admin WhatsApp link, Admin Email link


4.4 ADMIN PANEL  (finance-hub-admin/  —  requires role = 'admin')
------------------------------------------------------------------

  Sidebar Navigation (AdminSidebar):
    - "Finance Hub Admin" branding at top
    - Dashboard
    - Clients
    - Investments
    - Certificates
    - Leads
    - Settings
    - Sign Out

  4.4.1 ADMIN DASHBOARD — /dashboard
    - KPI Cards:
        Total Registered Clients
        Total AUM (₹) — SUM of all profiles.total_investment
        New Leads This Month — COUNT from leads where this month
        Active Investments — COUNT where status = 'active'
    - Charts (Recharts):
        Monthly new clients bar chart (last 6 months)
        Leads by status pie chart
    - Recent Activity Feed: Last 10 admin actions from audit_logs

  4.4.2 CLIENT MANAGEMENT — /clients
    - Data Table: All clients (id, name, email, phone, total_investment, status, created_at)
    - Search by name or email
    - Filter by: Active/Inactive, Investment range
    - Actions per row: View Detail | Deactivate | View Investments
    - /clients/:id — Client Detail Page:
        Full profile info
        All investments for this client
        All certificates for this client
        Button to Add Investment / Upload Certificate

  4.4.3 INVESTMENT MANAGEMENT — /investments
    - Table: All investments across all clients
    - Filter by: Client, Status, Date range
    - Create New Investment form:
        Fields: Select Client (dropdown), Principal Amount (₹),
                Start Date, Tenure (months), Notes
        Auto-calculates: Maturity Date, Monthly Return
        On Save: INSERT into investments + UPDATE profiles.total_investment
    - Edit Investment: Update principal, tenure, notes, status
    - Close Investment: Set status = 'withdrawn', update total_investment

  4.4.4 CERTIFICATE MANAGEMENT — /certificates
    - Upload Certificate:
        Select Client (dropdown)
        Select Related Investment (optional dropdown)
        Certificate Number (text input)
        Issue Date
        File Upload (PDF or image, max 10MB)
        File stored to Supabase Storage: certificates/clients/{userId}/{filename}
        On Upload: INSERT into certificates table
    - Certificate Table: All certificates with client name, cert number, date, file link
    - Replace / Delete certificate
    - Preview certificate inline

  4.4.5 LEADS MANAGEMENT — /leads
    - Data Table:
        Columns: Name, Phone, Email, Proposed Amount (₹), Status, Submitted Date, Notes
    - Status values: New | Contacted | Converted | Lost
    - Update lead status inline (dropdown or modal)
    - Add Admin Notes field per lead
    - Filter by: Status, Date range, Amount range
    - Export to CSV button: Downloads filtered leads as .csv file
    - Color-coded rows: New (sky blue), Contacted (orange), Converted (green), Lost (gray)

  4.4.6 SETTINGS — /settings
    - View/edit app configuration (admin display name, contact info)
    - Admin User Management: List of admin accounts, add new admin by email
    - Audit Log table: Shows all admin actions with timestamp and user

================================================================================
  SECTION 5 — UI/UX REQUIREMENTS
================================================================================

5.1 DESIGN SYSTEM TOKENS
--------------------------

  TOKEN                VALUE                    USAGE
  ─────────────────────────────────────────────────────────────────────────
  Primary Color        #0EA5E9 (sky-500)        CTA buttons, active nav
  Primary Dark         #0369A1 (sky-700)        Headings, links, hover
  Primary Light        #E0F2FE (sky-100)        Card backgrounds, badges
  Background           #FFFFFF                  Page & card surface
  Text Primary         #1E293B (slate-800)      Body text, labels
  Text Secondary       #64748B (slate-500)      Subtitles, placeholders
  Success              #22C55E (green-500)      Active status, success
  Warning              #F97316 (orange-500)     Pending status, alerts
  Error                #EF4444 (red-500)        Errors, validation msgs
  Font: Headings       Inter / Arial Bold       H1–H4
  Font: Body           Inter / Arial Regular    Paragraphs, inputs
  Border Radius        0.75rem (12px)           Cards, modals, inputs
  Box Shadow           0 4px 24px rgba(14,165,233,0.08)  Cards

5.2 HEADER LAYOUT
------------------

  Both Apps:
    - "Finance Hub" branding always on the TOP-LEFT
    - User App header: Logo | Nav Links | Sign In / User Avatar
    - Admin App header: Logo | "Admin Panel" label | Admin Avatar | Sign Out

5.3 RESPONSIVE BREAKPOINTS
----------------------------

  BREAKPOINT    WIDTH        LAYOUT BEHAVIOR
  ──────────────────────────────────────────────────────────────────────
  Mobile        < 640px      Single column; sidebar → bottom nav bar
  Tablet        640–1024px   2-col grid; sidebar icon-only mode
  Desktop       1024–1440px  Full sidebar (240px) + main content
  Wide          > 1440px     Container max 1280px centered

================================================================================
  SECTION 6 — GSAP ANIMATION SPECIFICATIONS
================================================================================

  All GSAP code must follow these rules:
    - Use gsap.context() for scoped animations inside React components
    - Kill all GSAP contexts and ScrollTrigger instances in useEffect cleanup
    - Add will-change: transform to all GSAP-animated elements
    - Import only what is needed: import { gsap } from 'gsap'

  ANIMATION             TRIGGER           GSAP TECHNIQUE
  ──────────────────────────────────────────────────────────────────────────────
  Hero text             Page load         gsap.from stagger 0.15s, y:40, opacity:0
  KPI cards             Page load         gsap.from stagger 0.1s, y:30, opacity:0
  Feature sections      Scroll            ScrollTrigger, start:'top 80%', fade+slideUp
  Number count-up       Dashboard load    gsap ticker, count from 0 to value, 1.5s
  Sidebar nav hover     Mouse enter       gsap.to, scale:1.02, duration:0.2, ease:power2
  Card hover            Mouse enter       gsap.to, y:-4, shadow lift, duration:0.2
  Page transitions      Route change      gsap.context fade + translateY between routes
  Modal open            State change      gsap clip-path reveal, not opacity-only
  Lead form success     Submit success    SVG checkmark draw animation (DrawSVGPlugin)
  FAQ accordion         Click             gsap.to height 0 → auto, ease:power2.inOut
  CTA scroll            Button click      gsap.to window.scrollY, smooth, duration:1

================================================================================
  SECTION 7 — DATABASE SCHEMA (Supabase / PostgreSQL)
================================================================================

  NOTE: Both apps (user + admin) connect to the SAME Supabase project.
  RLS policies control who can see what data.

7.1 TABLE: profiles
--------------------
  (Extends auth.users — created by DB trigger on new Supabase Auth user)

  COLUMN            TYPE              CONSTRAINTS                DESCRIPTION
  ────────────────────────────────────────────────────────────────────────────────
  id                UUID              PK, FK → auth.users        Matches Auth user ID
  full_name         TEXT              NOT NULL                   Client's full name
  email             TEXT              NOT NULL, UNIQUE           Synced from auth.users
  phone             TEXT              NOT NULL                   Mobile number
  address           TEXT              NULLABLE                   Residential address
  role              TEXT              DEFAULT 'client'           'client' or 'admin'
  total_investment  NUMERIC(12,2)     DEFAULT 0                  Current principal (₹)
  client_code       TEXT              UNIQUE, AUTO-GEN           Format: FH-XXXXX
  is_active         BOOLEAN           DEFAULT true               Admin can deactivate
  created_at        TIMESTAMPTZ       DEFAULT now()              Account creation time
  updated_at        TIMESTAMPTZ       AUTO-UPDATE                Last update time

  DB Trigger (auto-create profile on sign-up):
    CREATE OR REPLACE FUNCTION handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO profiles (id, email, full_name, role)
      VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'client');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();


7.2 TABLE: investments
-----------------------

  COLUMN            TYPE              CONSTRAINTS                DESCRIPTION
  ────────────────────────────────────────────────────────────────────────────────
  id                UUID              PK, gen_random_uuid()      Investment record ID
  user_id           UUID              FK → profiles.id, NOT NULL Client who owns this
  principal         NUMERIC(12,2)     NOT NULL, > 0              Amount invested (₹)
  monthly_rate      NUMERIC(5,4)      DEFAULT 0.01               1% = stored as 0.0100
  start_date        DATE              NOT NULL                   Investment start date
  tenure_months     INTEGER           NOT NULL, > 0              Duration in months
  maturity_date     DATE              GENERATED                  start + tenure_months
  status            TEXT              DEFAULT 'active'           active|matured|withdrawn
  notes             TEXT              NULLABLE                   Admin notes
  created_at        TIMESTAMPTZ       DEFAULT now()              Record creation time

  INDEX: CREATE INDEX ON investments(user_id);
  INDEX: CREATE INDEX ON investments(status);


7.3 TABLE: certificates
------------------------

  COLUMN            TYPE              CONSTRAINTS                DESCRIPTION
  ────────────────────────────────────────────────────────────────────────────────
  id                UUID              PK, gen_random_uuid()      Certificate record ID
  user_id           UUID              FK → profiles.id, NOT NULL Certificate owner
  investment_id     UUID              FK → investments.id, NULL  Related investment
  certificate_number TEXT             NOT NULL, UNIQUE           Issued cert number
  file_path         TEXT              NOT NULL                   Path in Storage bucket
  file_name         TEXT              NOT NULL                   Original file name
  issued_date       DATE              NOT NULL                   Date cert was issued
  uploaded_by       UUID              FK → profiles.id           Admin who uploaded
  created_at        TIMESTAMPTZ       DEFAULT now()              Upload timestamp

  INDEX: CREATE INDEX ON certificates(user_id);

  Storage Bucket: certificates
    - Visibility: PRIVATE (no public access)
    - File path convention: clients/{userId}/{certificate_number}_{filename}
    - Access: Signed URLs only (60-minute expiry, generated on demand)


7.4 TABLE: leads
-----------------

  COLUMN            TYPE              CONSTRAINTS                DESCRIPTION
  ────────────────────────────────────────────────────────────────────────────────
  id                UUID              PK, gen_random_uuid()      Lead record ID
  full_name         TEXT              NOT NULL                   Prospect's name
  email             TEXT              NOT NULL                   Prospect's email
  phone             TEXT              NOT NULL                   Mobile number
  proposed_amount   NUMERIC(12,2)     NOT NULL, > 0              Intended investment (₹)
  status            TEXT              DEFAULT 'new'              new|contacted|converted|lost
  admin_notes       TEXT              NULLABLE                   Internal notes by admin
  ip_address        INET              NULLABLE                   For spam prevention
  submitted_at      TIMESTAMPTZ       DEFAULT now()              Form submission time
  updated_at        TIMESTAMPTZ       AUTO-UPDATE                Last status change time

  INDEX: CREATE INDEX ON leads(status);
  INDEX: CREATE INDEX ON leads(submitted_at);


7.5 TABLE: support_tickets
---------------------------

  COLUMN            TYPE              CONSTRAINTS                DESCRIPTION
  ────────────────────────────────────────────────────────────────────────────────
  id                UUID              PK, gen_random_uuid()      Ticket ID
  user_id           UUID              FK → profiles.id, NOT NULL Client who raised it
  subject           TEXT              NOT NULL                   Category / subject
  message           TEXT              NOT NULL                   Client's message
  status            TEXT              DEFAULT 'open'             open|in_progress|closed
  admin_reply       TEXT              NULLABLE                   Admin response
  created_at        TIMESTAMPTZ       DEFAULT now()              Submission time


7.6 TABLE: audit_logs
----------------------
  (Admin-only visibility — tracks all admin actions)

  COLUMN            TYPE              CONSTRAINTS                DESCRIPTION
  ────────────────────────────────────────────────────────────────────────────────
  id                UUID              PK, gen_random_uuid()      Log entry ID
  admin_id          UUID              FK → profiles.id           Admin who took action
  action            TEXT              NOT NULL                   e.g. 'CREATE_INVESTMENT'
  target_table      TEXT              NOT NULL                   e.g. 'investments'
  target_id         UUID              NULLABLE                   ID of affected record
  details           JSONB             NULLABLE                   Snapshot of changes
  created_at        TIMESTAMPTZ       DEFAULT now()              Action timestamp

================================================================================
  SECTION 8 — SECURITY REQUIREMENTS
================================================================================

8.1 ROW-LEVEL SECURITY (RLS) POLICIES
---------------------------------------

  !! CRITICAL: RLS must be enabled on ALL tables !!
  ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
  ALTER TABLE investments        ENABLE ROW LEVEL SECURITY;
  ALTER TABLE certificates       ENABLE ROW LEVEL SECURITY;
  ALTER TABLE leads              ENABLE ROW LEVEL SECURITY;
  ALTER TABLE support_tickets    ENABLE ROW LEVEL SECURITY;
  ALTER TABLE audit_logs         ENABLE ROW LEVEL SECURITY;

  TABLE              OPERATION          POLICY
  ──────────────────────────────────────────────────────────────────────────────
  profiles           SELECT             auth.uid() = id
                                        OR (SELECT role FROM profiles WHERE id=auth.uid()) = 'admin'
  profiles           UPDATE             auth.uid() = id  (own row only)
  profiles           INSERT             Only via trigger (no direct user insert)
  profiles           DELETE             Role = 'admin' only

  investments        SELECT             auth.uid() = user_id
                                        OR (SELECT role FROM profiles WHERE id=auth.uid()) = 'admin'
  investments        INSERT             Role = 'admin' only
  investments        UPDATE             Role = 'admin' only
  investments        DELETE             Role = 'admin' only

  certificates       SELECT             auth.uid() = user_id
                                        OR (SELECT role FROM profiles WHERE id=auth.uid()) = 'admin'
  certificates       INSERT             Role = 'admin' only
  certificates       UPDATE             Role = 'admin' only
  certificates       DELETE             Role = 'admin' only

  leads              INSERT             Public (anon key) — allows form submission
  leads              SELECT             Role = 'admin' only
  leads              UPDATE             Role = 'admin' only
  leads              DELETE             Role = 'admin' only

  support_tickets    SELECT             auth.uid() = user_id
                                        OR role = 'admin'
  support_tickets    INSERT             auth.uid() IS NOT NULL (any logged-in user)
  support_tickets    UPDATE             Role = 'admin' only (for admin_reply + status)

  audit_logs         SELECT             Role = 'admin' only
  audit_logs         INSERT             Role = 'admin' only (or via Edge Function)
  audit_logs         UPDATE/DELETE      NONE — immutable log


8.2 ENVIRONMENT VARIABLES
--------------------------

  finance-hub-user/.env.local (NEVER commit):
  ─────────────────────────────────────────────
  VITE_SUPABASE_URL              → Your Supabase project URL
  VITE_SUPABASE_ANON_KEY         → Public anon key (safe for browser, RLS enforces access)
  VITE_APP_NAME                  → Finance Hub
  VITE_APP_URL                   → https://app.financehub.com
  VITE_STORAGE_BUCKET            → certificates
  VITE_MONTHLY_RATE              → 0.01

  finance-hub-admin/.env.local (NEVER commit):
  ──────────────────────────────────────────────
  VITE_SUPABASE_URL              → Same Supabase project URL
  VITE_SUPABASE_ANON_KEY         → Same anon key
  VITE_SUPABASE_SERVICE_ROLE_KEY → Service role key (ADMIN ONLY — bypasses RLS)
  VITE_APP_NAME                  → Finance Hub Admin
  VITE_APP_URL                   → https://admin.financehub.com
  VITE_USER_APP_URL              → https://app.financehub.com
  VITE_STORAGE_BUCKET            → certificates
  VITE_MONTHLY_RATE              → 0.01

  .gitignore (both apps must have this):
  ───────────────────────────────────────
  .env.local
  .env.*.local
  node_modules/
  dist/
  .DS_Store


8.3 ADDITIONAL SECURITY RULES
-------------------------------

  1. SERVICE_ROLE_KEY Rule:
       - Only used in Supabase Edge Functions (server-side)
       - NEVER called directly in React component code
       - Even though it is in admin .env, treat it as server-only

  2. JWT / Session:
       - Stored in-memory by Supabase JS v2 (not localStorage)
       - Admin sessions expire after 30 minutes of inactivity
       - User sessions expire after 60 minutes of inactivity

  3. CORS:
       - Supabase project allowlist: only app.financehub.com + admin.financehub.com
       - No wildcard (*) origins

  4. Input Sanitization:
       - All form inputs sanitized before DB insert
       - No raw HTML stored in DB
       - Zod schema validation on all forms

  5. Rate Limiting (Lead Form):
       - 3 submissions per IP per hour
       - Enforced via Supabase Edge Function before INSERT into leads

  6. Storage Bucket:
       - certificates bucket: PRIVATE
       - Signed URLs expire in 60 minutes
       - Regenerated fresh on every download click
       - Path: certificates/clients/{userId}/{filename}

  7. Admin Role Assignment:
       - Role 'admin' can NEVER be self-assigned via sign-up
       - Only set via: Supabase Studio SQL → UPDATE profiles SET role='admin' WHERE email='...'
       - Or via a separate one-time admin seed script

  8. HTTPS:
       - Enforced via Vercel/Netlify deployment settings
       - All HTTP traffic auto-redirected to HTTPS

  9. Audit Logging:
       - Every admin CREATE, UPDATE, DELETE action logged to audit_logs table
       - Audit logs are immutable (no UPDATE or DELETE policy)

================================================================================
  SECTION 9 — ROUTES
================================================================================

9.1 finance-hub-user/ ROUTES
------------------------------

  ROUTE                  AUTH REQUIRED     COMPONENT / DESCRIPTION
  ─────────────────────────────────────────────────────────────────────────────
  /                      None              Public landing page (hero + form)
  /sign-in               None              Sign In page
  /sign-up               None              Sign Up page
  /forgot-password       None              Password reset email page
  /user/dashboard        Yes (client)      Investment overview + KPI cards
  /user/investments      Yes (client)      Investment history table + interest
  /user/certificates     Yes (client)      Certificate list + signed download
  /user/profile          Yes (client)      View + edit profile
  /user/support          Yes (client)      FAQ accordion + support ticket form


9.2 finance-hub-admin/ ROUTES
-------------------------------

  ROUTE                  AUTH REQUIRED     COMPONENT / DESCRIPTION
  ─────────────────────────────────────────────────────────────────────────────
  /sign-in               None              Admin login page only (no sign-up)
  /unauthorized          None              Shown if non-admin tries to access
  /dashboard             Yes (admin)       KPI overview + charts + activity feed
  /clients               Yes (admin)       All clients table with search/filter
  /clients/:id           Yes (admin)       Individual client detail + investments
  /investments           Yes (admin)       All investments + create/edit form
  /certificates          Yes (admin)       Upload + manage certificates
  /leads                 Yes (admin)       Leads table + status + CSV export
  /settings              Yes (admin)       App config + admin user management


9.3 SUPABASE API CALLS
-----------------------

  METHOD    ENDPOINT                              AUTH        DESCRIPTION
  ──────────────────────────────────────────────────────────────────────────────
  GET       /profiles?id=eq.{uid}                User/Admin  Fetch own profile
  PATCH     /profiles?id=eq.{uid}                User        Update phone/address
  GET       /investments?user_id=eq.{uid}         User        Own investments only
  GET       /investments                          Admin       All investments
  POST      /investments                          Admin       Create new investment
  PATCH     /investments?id=eq.{id}              Admin       Edit investment
  GET       /certificates?user_id=eq.{uid}        User        Own certificates only
  GET       /certificates                         Admin       All certificates
  POST      /certificates                         Admin       Link cert to client
  POST      /leads                                Public      Submit lead form
  GET       /leads                                Admin       All leads
  PATCH     /leads?id=eq.{id}                    Admin       Update lead status
  POST      /support_tickets                      User        Submit support ticket
  GET       /support_tickets?user_id=eq.{uid}     User        Own tickets only
  GET       /support_tickets                      Admin       All tickets
  GET       /storage/v1/object/sign/...           User/Admin  Get signed cert URL
  POST      /storage/v1/object/certificates/...   Admin       Upload certificate file

================================================================================
  SECTION 10 — FEATURE PRIORITY MATRIX
================================================================================

  FEATURE                                 PRIORITY   COMPLEXITY   SPRINT
  ──────────────────────────────────────────────────────────────────────────────
  Authentication (Sign-in/Sign-up)        P0         Medium       Sprint 1
  Protected Route + Role Guard            P0         Medium       Sprint 1
  DB Schema + RLS Policies                P0         High         Sprint 1
  .env setup for both apps                P0         Low          Sprint 1
  Public Landing Page + Hero              P0         Low          Sprint 1
  Lead Generation Form → DB              P0         Low          Sprint 1
  User Dashboard — Investment KPIs        P0         Medium       Sprint 2
  Certificate List + Signed Download      P0         Medium       Sprint 2
  User Profile View + Edit               P1         Low          Sprint 2
  Admin Dashboard Overview               P1         Medium       Sprint 3
  Admin Client Management                P1         Medium       Sprint 3
  Admin Investment CRUD                  P1         High         Sprint 3
  Admin Certificate Upload               P1         Medium       Sprint 3
  Admin Leads Table + Status             P1         Medium       Sprint 4
  GSAP Scroll + Page Animations          P2         Medium       Sprint 4
  Investment Calculator (Landing)        P2         Low          Sprint 4
  Support Ticket System                  P2         Medium       Sprint 5
  Leads CSV Export                       P2         Low          Sprint 5
  Audit Log Table                        P3         High         Sprint 6
  Rate Limiting (Edge Function)          P3         High         Sprint 6

  LEGEND:
    P0 = Must Have (Launch Blocker)
    P1 = High Value
    P2 = Enhancement
    P3 = Nice-to-Have

================================================================================
  SECTION 11 — TECH STACK
================================================================================

  LAYER                TECHNOLOGY               PURPOSE
  ──────────────────────────────────────────────────────────────────────────────
  Frontend Framework   React 18 + Vite          Component-based SPA, fast HMR
  Styling              Tailwind CSS v3           Utility-first responsive styling
  Animations           GSAP 3 + ScrollTrigger   All animations and interactions
  Routing              React Router v6           Client-side routing + protected routes
  Forms                React Hook Form + Zod     Type-safe form validation
  State Management     Zustand                  Auth state, global UI state
  Backend / DB         Supabase (PostgreSQL)    Database, Auth, Storage, Edge Functions
  Authentication       Supabase Auth            JWT, email+password, magic link
  File Storage         Supabase Buckets         Private certificate PDF/image storage
  Charts               Recharts                 Admin dashboard data visualizations
  Icons                Lucide React             Consistent icon set
  HTTP Client          Supabase JS Client v2    Type-safe DB queries from React
  Linting              ESLint + Prettier        Code quality and formatting
  Environment          Vite .env.local          Secure secret management
  Hosting (User App)   Vercel                   app.financehub.com
  Hosting (Admin App)  Vercel (separate proj)   admin.financehub.com

================================================================================
  SECTION 12 — CODE QUALITY & OPTIMIZATION
================================================================================

12.1 PERFORMANCE RULES
------------------------
  - Code Splitting: React.lazy() + Suspense for heavy pages (each page = separate chunk)
  - Memoization: React.memo on list components; useMemo for interest calculations
  - Virtual Scroll: react-window for tables with 100+ rows (leads/clients tables)
  - Image Optimization: Compress certificate thumbnails via Supabase Transform API
  - Supabase Queries: Select only needed columns → .select('id, full_name, total_investment')
  - DB Indexes: Add indexes on user_id (investments, certificates), status, email
  - Bundle Size: Tree-shake all libraries — import { gsap } from 'gsap' not import gsap

12.2 ARCHITECTURE RULES
-------------------------
  - Custom Hooks: All Supabase data-fetching in dedicated hooks (useProfile, useInvestments)
  - Separation: UI components, business logic, and API calls in separate layers
  - Constants File: All magic numbers in constants/index.js
      MONTHLY_RATE = 0.01
      BUCKET_NAME = 'certificates'
      SESSION_TIMEOUT_USER = 3600
      SESSION_TIMEOUT_ADMIN = 1800
  - Error Boundaries: Wrap major route sections in React Error Boundary
  - Loading States: Every async op must show skeleton loader (never blank screen)
  - TypeScript: Define types for all Supabase table rows in types/database.ts

12.3 SECURITY CODE RULES
--------------------------
  - Never hardcode any key/URL in source code — always from import.meta.env.VITE_*
  - Service role key only used in Supabase Edge Functions, not in React components
  - supabaseClient.js must read from env vars:
      import { createClient } from '@supabase/supabase-js'
      export const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      )
  - Admin RLS bypass only via service role in Edge Function, not client-side

================================================================================
  SECTION 13 — NON-FUNCTIONAL REQUIREMENTS
================================================================================

  CATEGORY         REQUIREMENT                    TARGET
  ────────────────────────────────────────────────────────────────────────────
  Performance      LCP (Largest Contentful Paint)  < 2.5s on 4G
  Performance      TTI (Time to Interactive)        < 3.5s
  Performance      Lighthouse Score                 >= 90 (Performance + A11y)
  Availability     Uptime (Supabase)                99.9% (Supabase SLA)
  Security         Auth token storage               In-memory (not localStorage)
  Security         HTTPS enforcement                All pages HTTPS only
  Security         RLS violations                   Zero unauthorized reads allowed
  Scalability      Concurrent users                 500+ (Supabase handles ~50k req/day)
  Accessibility    WCAG standard                    AA — ARIA labels, focus states
  Browser Support  Target browsers                  Chrome 90+, Firefox 88+, Safari 14+
  Maintainability  Code coverage                    >= 70% for critical logic
  Mobile           Minimum screen                   Fully functional at 320px width

================================================================================
  SECTION 14 — SPRINT PLAN  (6 Sprints × 2 Weeks = 12 Weeks Total)
================================================================================

  SPRINT    THEME                     DELIVERABLES
  ────────────────────────────────────────────────────────────────────────────
  Sprint 1  Foundation + Auth         Vite + Tailwind setup for both apps,
  (Week 1-2)                          Supabase project init, all DB tables + RLS,
                                      Auth pages (sign-in/sign-up), Protected routes,
                                      .env.local setup, folder structure finalized

  Sprint 2  User Portal Core          User Dashboard with KPI cards,
  (Week 3-4)                          My Investments page, Certificates page
                                      (view + signed download), Profile page,
                                      User sidebar navigation, Skeleton loaders

  Sprint 3  Admin Portal Core         Admin Dashboard with KPIs + Recharts,
  (Week 5-6)                          Admin Client list + detail view,
                                      Admin Investment CRUD form,
                                      Admin Certificate Upload to Supabase Storage

  Sprint 4  Public Site + Leads       Landing page (hero + services + calculator),
  (Week 7-8)                          Lead form with validation + Supabase insert,
                                      Admin Leads table with status management,
                                      GSAP hero animations + scroll effects

  Sprint 5  Polish + Support          Support ticket system, GSAP micro-interactions
  (Week 9-10)                         on all cards/buttons, full mobile responsiveness
                                      audit, Toast notifications, Error boundaries,
                                      FAQ accordion with GSAP animations

  Sprint 6  Security + Deploy         Rate limiting Edge Function for lead form,
  (Week 11-12)                        Audit log implementation, Full RLS policy audit,
                                      Performance optimization pass,
                                      Vercel deployment for both apps,
                                      Final UAT + bug fixes

================================================================================
  SECTION 15 — OPEN QUESTIONS & RISKS
================================================================================

15.1 OPEN QUESTIONS
--------------------
  1. Who generates the certificate PDF — auto-generated from a template, or
     created externally and uploaded by admin?
  2. Should clients receive email notifications when a certificate is uploaded
     or a new investment is created?
  3. Is 2FA / OTP login required for admin users for extra security?
  4. Should the landing page investment calculator pull MONTHLY_RATE from DB
     dynamically, or is it a hardcoded constant?
  5. What Indian currency format is preferred — ₹1,00,000 or ₹100,000?
  6. Should the admin app be accessible from the public internet, or IP-restricted?

15.2 RISK REGISTER
-------------------

  RISK                                    SEVERITY   MITIGATION
  ────────────────────────────────────────────────────────────────────────────
  SERVICE_ROLE_KEY exposed in browser     Critical   Use Edge Functions only; never
  bundle                                             put it in React component code
  Cross-user data leak (missing RLS)      Critical   Full RLS audit before prod deploy
  Admin role self-assignment via sign-up  Critical   Role only set via SQL / seed script
  GSAP commercial license missing         Medium     Purchase GSAP Business Green license
  Supabase free tier row/storage limits   Medium     Plan Pro upgrade as clients scale
  Lead form spam / bot submissions        Low        Honeypot field + rate limit Edge Fn
  Both apps share same Supabase key       Low        Anon key is safe; only RLS matters

================================================================================
  SECTION 16 — DOCUMENT APPROVAL
================================================================================

  ROLE              NAME                      SIGNATURE / DATE
  ──────────────────────────────────────────────────────────────────────────────
  Product Owner     ______________________    ______________________
  Tech Lead         ______________________    ______________________
  Design Lead       ______________________    ______________________
  Security Review   ______________________    ______________________

================================================================================
  © 2026 Finance Hub — All Rights Reserved | CONFIDENTIAL
  PRD v1.0 | finance-hub-user + finance-hub-admin | Supabase Backend
================================================================================