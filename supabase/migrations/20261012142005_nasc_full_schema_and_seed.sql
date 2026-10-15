/*
# Nandha Smart Campus Assistant — Full Schema + Seed Data

## Overview
Complete database for the Nandha Arts and Science College Smart Campus Assistant.
Public website visitors can read content and submit chat logs, feedback, leads, and contact messages.
Only authenticated admin users can create, update, or delete content.

## Tables Created
1. profiles — admin user profiles (extends auth.users)
2. settings — college-wide settings (single row config)
3. departments — college departments
4. courses — courses offered by each department
5. faculty — HODs and faculty members per department
6. bus_routes — bus transport routes
7. notifications — exam dates, events, circulars
8. events — upcoming events with dates
9. intents — chatbot intents with patterns and responses
10. chat_logs — visitor chat conversations
11. unanswered_queries — low-confidence chatbot queries
12. feedback — thumbs up/down on chatbot answers
13. leads — call-back request form submissions
14. contact_messages — contact form submissions

## Security
- RLS enabled on every table
- Public (anon) can: SELECT content tables, INSERT chat_logs, unanswered_queries, feedback, leads, contact_messages
- Admin (authenticated) can: full CRUD on all content tables
- chat_logs, unanswered_queries, feedback, leads, contact_messages: public can insert, only admin can read/update/delete
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ SETTINGS ============
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name text NOT NULL DEFAULT 'Nandha Arts and Science College (Autonomous)',
  address text NOT NULL DEFAULT 'Koorapalayam Pirivu, Pichandampalayam (PO), Erode-Coimbatore Road, Erode - 638 052, Tamil Nadu',
  phone text NOT NULL DEFAULT '+91 424 2260000',
  email text NOT NULL DEFAULT 'info@nandhaarts.ac.in',
  principal text NOT NULL DEFAULT 'Dr. S. Manoharan',
  motto text NOT NULL DEFAULT 'Learn, Serve and Succeed',
  established int NOT NULL DEFAULT 2000,
  naac_grade text NOT NULL DEFAULT 'B+',
  naac_cgpa numeric NOT NULL DEFAULT 2.64,
  affiliation text NOT NULL DEFAULT 'Bharathiar University, Coimbatore',
  trust text NOT NULL DEFAULT 'Sri Nandha Educational Trust',
  confidence_threshold numeric NOT NULL DEFAULT 0.35,
  highest_package text NOT NULL DEFAULT '42 LPA',
  average_package text NOT NULL DEFAULT '5.5 LPA',
  recruiters_count int NOT NULL DEFAULT 300,
  map_embed_url text NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.0!2d77.7!3d11.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDE4JzAwLjAiTiA3N8KwNDInMTIuMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_public_read" ON settings;
CREATE POLICY "settings_public_read" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_admin_update" ON settings;
CREATE POLICY "settings_admin_update" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "settings_admin_insert" ON settings;
CREATE POLICY "settings_admin_insert" ON settings FOR INSERT TO authenticated WITH CHECK (true);

-- ============ DEPARTMENTS ============
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  stream text NOT NULL DEFAULT 'Science',
  description text,
  hod_name text,
  hod_qualification text,
  established int,
  icon text DEFAULT 'BookOpen',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "depts_public_read" ON departments;
CREATE POLICY "depts_public_read" ON departments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "depts_admin_insert" ON departments;
CREATE POLICY "depts_admin_insert" ON departments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "depts_admin_update" ON departments;
CREATE POLICY "depts_admin_update" ON departments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "depts_admin_delete" ON departments;
CREATE POLICY "depts_admin_delete" ON departments FOR DELETE TO authenticated USING (true);

-- ============ COURSES ============
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  level text NOT NULL DEFAULT 'UG',
  duration text NOT NULL DEFAULT '3 Years',
  eligibility text NOT NULL DEFAULT '12th pass',
  fee_annual numeric NOT NULL DEFAULT 15000,
  fee_total numeric NOT NULL DEFAULT 45000,
  syllabus text,
  careers text,
  description text,
  subjects text,
  intake int DEFAULT 60,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "courses_public_read" ON courses;
CREATE POLICY "courses_public_read" ON courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "courses_admin_insert" ON courses;
CREATE POLICY "courses_admin_insert" ON courses FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "courses_admin_update" ON courses;
CREATE POLICY "courses_admin_update" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "courses_admin_delete" ON courses;
CREATE POLICY "courses_admin_delete" ON courses FOR DELETE TO authenticated USING (true);

-- ============ FACULTY ============
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  designation text NOT NULL DEFAULT 'Assistant Professor',
  qualification text,
  specialization text,
  experience int,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "faculty_public_read" ON faculty;
CREATE POLICY "faculty_public_read" ON faculty FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "faculty_admin_insert" ON faculty;
CREATE POLICY "faculty_admin_insert" ON faculty FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "faculty_admin_update" ON faculty;
CREATE POLICY "faculty_admin_update" ON faculty FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "faculty_admin_delete" ON faculty;
CREATE POLICY "faculty_admin_delete" ON faculty FOR DELETE TO authenticated USING (true);

-- ============ BUS_ROUTES ============
CREATE TABLE IF NOT EXISTS bus_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area text NOT NULL,
  route_number text NOT NULL,
  pickup_time text NOT NULL,
  drop_time text,
  fee_annual numeric NOT NULL DEFAULT 12000,
  stops text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bus_public_read" ON bus_routes;
CREATE POLICY "bus_public_read" ON bus_routes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "bus_admin_insert" ON bus_routes;
CREATE POLICY "bus_admin_insert" ON bus_routes FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "bus_admin_update" ON bus_routes;
CREATE POLICY "bus_admin_update" ON bus_routes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "bus_admin_delete" ON bus_routes;
CREATE POLICY "bus_admin_delete" ON bus_routes FOR DELETE TO authenticated USING (true);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  category text NOT NULL DEFAULT 'general',
  date text NOT NULL,
  priority text DEFAULT 'normal',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notif_public_read" ON notifications;
CREATE POLICY "notif_public_read" ON notifications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "notif_admin_insert" ON notifications;
CREATE POLICY "notif_admin_insert" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "notif_admin_update" ON notifications;
CREATE POLICY "notif_admin_update" ON notifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "notif_admin_delete" ON notifications;
CREATE POLICY "notif_admin_delete" ON notifications FOR DELETE TO authenticated USING (true);

-- ============ EVENTS ============
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time text,
  venue text,
  category text DEFAULT 'event',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_public_read" ON events;
CREATE POLICY "events_public_read" ON events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "events_admin_insert" ON events;
CREATE POLICY "events_admin_insert" ON events FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "events_admin_update" ON events;
CREATE POLICY "events_admin_update" ON events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "events_admin_delete" ON events;
CREATE POLICY "events_admin_delete" ON events FOR DELETE TO authenticated USING (true);

-- ============ INTENTS ============
CREATE TABLE IF NOT EXISTS intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_name text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'general',
  patterns text[] NOT NULL DEFAULT '{}',
  response_en text NOT NULL,
  response_ta text,
  suggestions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE intents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "intents_public_read" ON intents;
CREATE POLICY "intents_public_read" ON intents FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "intents_admin_insert" ON intents;
CREATE POLICY "intents_admin_insert" ON intents FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "intents_admin_update" ON intents;
CREATE POLICY "intents_admin_update" ON intents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "intents_admin_delete" ON intents;
CREATE POLICY "intents_admin_delete" ON intents FOR DELETE TO authenticated USING (true);

-- ============ CHAT_LOGS ============
CREATE TABLE IF NOT EXISTS chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_message text NOT NULL,
  bot_response text NOT NULL,
  intent_name text,
  confidence numeric,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "chatlogs_public_insert" ON chat_logs;
CREATE POLICY "chatlogs_public_insert" ON chat_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "chatlogs_admin_read" ON chat_logs;
CREATE POLICY "chatlogs_admin_read" ON chat_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "chatlogs_admin_delete" ON chat_logs;
CREATE POLICY "chatlogs_admin_delete" ON chat_logs FOR DELETE TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_chatlogs_created ON chat_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatlogs_session ON chat_logs(session_id);

-- ============ UNANSWERED_QUERIES ============
CREATE TABLE IF NOT EXISTS unanswered_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  session_id text,
  status text DEFAULT 'unresolved',
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE unanswered_queries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "unanswered_public_insert" ON unanswered_queries;
CREATE POLICY "unanswered_public_insert" ON unanswered_queries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "unanswered_admin_read" ON unanswered_queries;
CREATE POLICY "unanswered_admin_read" ON unanswered_queries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "unanswered_admin_update" ON unanswered_queries;
CREATE POLICY "unanswered_admin_update" ON unanswered_queries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "unanswered_admin_delete" ON unanswered_queries;
CREATE POLICY "unanswered_admin_delete" ON unanswered_queries FOR DELETE TO authenticated USING (true);

-- ============ FEEDBACK ============
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  message_id text,
  rating text NOT NULL DEFAULT 'up',
  intent_name text,
  query text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feedback_public_insert" ON feedback;
CREATE POLICY "feedback_public_insert" ON feedback FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "feedback_admin_read" ON feedback;
CREATE POLICY "feedback_admin_read" ON feedback FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "feedback_admin_delete" ON feedback;
CREATE POLICY "feedback_admin_delete" ON feedback FOR DELETE TO authenticated USING (true);

-- ============ LEADS ============
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  course text,
  preferred_time text,
  status text DEFAULT 'New',
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leads_public_insert" ON leads;
CREATE POLICY "leads_public_insert" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "leads_admin_read" ON leads;
CREATE POLICY "leads_admin_read" ON leads FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "leads_admin_update" ON leads;
CREATE POLICY "leads_admin_update" ON leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "leads_admin_delete" ON leads;
CREATE POLICY "leads_admin_delete" ON leads FOR DELETE TO authenticated USING (true);

-- ============ CONTACT_MESSAGES ============
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_public_insert" ON contact_messages;
CREATE POLICY "contact_public_insert" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "contact_admin_read" ON contact_messages;
CREATE POLICY "contact_admin_read" ON contact_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "contact_admin_update" ON contact_messages;
CREATE POLICY "contact_admin_update" ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "contact_admin_delete" ON contact_messages;
CREATE POLICY "contact_admin_delete" ON contact_messages FOR DELETE TO authenticated USING (true);

-- ============ SEED: SETTINGS ============
INSERT INTO settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- ============ SEED: DEPARTMENTS ============
INSERT INTO departments (name, code, stream, description, hod_name, hod_qualification, established, icon, display_order) VALUES
('Tamil', 'TAM', 'Arts', 'Department of Tamil language and literature studies', 'Dr. K. Murugesan', 'Ph.D. in Tamil', 2000, 'BookOpen', 1),
('English', 'ENG', 'Arts', 'Department of English language and literature', 'Dr. R. Saravanan', 'Ph.D. in English', 2000, 'Languages', 2),
('Mathematics', 'MAT', 'Science', 'Department of Mathematics and applied mathematics', 'Dr. V. Krishnan', 'Ph.D. in Mathematics', 2001, 'Calculator', 3),
('Commerce', 'COM', 'Commerce', 'Department of Commerce and accounting studies', 'Dr. S. Kavitha', 'Ph.D. in Commerce', 2000, 'Briefcase', 4),
('Management (BBA)', 'BBA', 'Management', 'Department of Business Administration', 'Dr. M. Priya', 'Ph.D. in Management', 2002, 'TrendingUp', 5),
('Computer Applications (BCA)', 'BCA', 'Computer Applications', 'Department of Computer Applications', 'Dr. A. Rajesh', 'Ph.D. in Computer Science', 2001, 'Monitor', 6),
('Computer Technology', 'CT', 'Computer Applications', 'Department of Computer Technology', 'Dr. P. Arumugam', 'Ph.D. in Computer Science', 2002, 'Cpu', 7),
('Biotechnology', 'BIO', 'Science', 'Department of Biotechnology and life sciences', 'Dr. N. Deepa', 'Ph.D. in Biotechnology', 2003, 'FlaskConical', 8),
('Artificial Intelligence and Data Science', 'AIDS', 'Computer Applications', 'Department of AI and Data Science', 'Dr. K. Senthil', 'Ph.D. in AI', 2020, 'BrainCircuit', 9),
('Artificial Intelligence and Machine Learning', 'AIML', 'Computer Applications', 'Department of AI and Machine Learning', 'Dr. R. Vijay', 'Ph.D. in Machine Learning', 2021, 'Bot', 10),
('Costume Design and Fashion', 'CDF', 'Arts', 'Department of Costume Design and Fashion Technology', 'Dr. L. Revathi', 'Ph.D. in Fashion Design', 2005, 'Shirt', 11),
('Physics', 'PHY', 'Science', 'Department of Physics', 'Dr. G. Murugan', 'Ph.D. in Physics', 2001, 'Atom', 12),
('Chemistry', 'CHE', 'Science', 'Department of Chemistry', 'Dr. T. Anand', 'Ph.D. in Chemistry', 2001, 'FlaskConical', 13),
('Computer Science', 'CSC', 'Computer Applications', 'Department of Computer Science', 'Dr. D. Karthik', 'Ph.D. in Computer Science', 2000, 'Code', 14),
('Business Administration (PG)', 'MBA', 'Management', 'Department of Management Studies (PG)', 'Dr. S. Mahesh', 'Ph.D. in Management', 2005, 'Briefcase', 15),
('Commerce (PG)', 'MCOM', 'Commerce', 'Department of Commerce (PG)', 'Dr. R. Geetha', 'Ph.D. in Commerce', 2004, 'Coins', 16)
ON CONFLICT (code) DO NOTHING;

-- ============ SEED: COURSES ============
INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.A. Tamil', 'BATAM', 'UG', '3 Years', '12th pass with Tamil as a subject', 7275, 21825, 'Tamil literature, grammar, poetry, prose, drama, literary criticism', 'Teacher, Translator, Journalist, Content Writer', 'Comprehensive study of Tamil language, literature and culture', 'Tamil Literature, Grammar, Poetry, Drama, Literary Criticism', 60 FROM departments d WHERE d.code = 'TAM'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'M.A. Tamil', 'MATAM', 'PG', '2 Years', 'B.A. Tamil or equivalent', 15000, 30000, 'Advanced Tamil literature, linguistics, research methodology', 'Professor, Researcher, Author', 'Postgraduate study in Tamil language and literature', 'Advanced Literature, Linguistics, Research Methods', 30 FROM departments d WHERE d.code = 'TAM'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.A. English', 'BAENG', 'UG', '3 Years', '12th pass with English', 12000, 36000, 'English literature, grammar, poetry, drama, prose, communication', 'Teacher, Content Writer, BPO Executive, Translator', 'Study of English language and literature', 'English Literature, Grammar, Poetry, Drama, Communication Skills', 60 FROM departments d WHERE d.code = 'ENG'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'M.A. English', 'MAENG', 'PG', '2 Years', 'B.A. English or equivalent', 18000, 36000, 'Advanced English literature, literary criticism, linguistics', 'Professor, Editor, Communications Specialist', 'Postgraduate study in English literature', 'Advanced Literature, Literary Criticism, Linguistics', 30 FROM departments d WHERE d.code = 'ENG'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. Mathematics', 'BSCMAT', 'UG', '3 Years', '12th with Mathematics (Science stream)', 15000, 45000, 'Algebra, calculus, trigonometry, statistics, discrete mathematics', 'Data Analyst, Teacher, Bank Officer, Actuary', 'Comprehensive study of mathematics and its applications', 'Algebra, Calculus, Trigonometry, Statistics, Discrete Math', 60 FROM departments d WHERE d.code = 'MAT'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'M.Sc. Mathematics', 'MSCMAT', 'PG', '2 Years', 'B.Sc. Mathematics or equivalent', 20000, 40000, 'Advanced algebra, real analysis, topology, operations research', 'Professor, Research Scientist, Quant Analyst', 'Postgraduate mathematics and research', 'Advanced Algebra, Real Analysis, Topology, Operations Research', 30 FROM departments d WHERE d.code = 'MAT'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Com.', 'BCOM', 'UG', '3 Years', '12th pass (Commerce/Science stream preferred)', 12000, 36000, 'Accounting, business management, taxation, economics, audit', 'Accountant, Auditor, Tax Consultant, Bank Officer', 'Commerce and accounting studies', 'Financial Accounting, Business Management, Taxation, Economics, Auditing', 80 FROM departments d WHERE d.code = 'COM'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'M.Com.', 'MCOM', 'PG', '2 Years', 'B.Com. or equivalent', 16000, 32000, 'Advanced accounting, international business, financial management', 'Financial Analyst, CFO, Professor', 'Postgraduate commerce and finance', 'Advanced Accounting, International Business, Financial Management', 30 FROM departments d WHERE d.code = 'COM'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.B.A.', 'BBA', 'UG', '3 Years', '12th pass (any stream)', 18000, 54000, 'Principles of management, marketing, HR, finance, entrepreneurship', 'Management Trainee, Marketing Executive, HR Assistant', 'Business administration and management', 'Management Principles, Marketing, HR, Finance, Entrepreneurship', 60 FROM departments d WHERE d.code = 'BBA'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.C.A.', 'BCA', 'UG', '3 Years', '12th pass with Mathematics (any stream)', 25000, 75000, 'Programming, data structures, DBMS, web development, networking', 'Software Developer, Web Developer, System Analyst, IT Support', 'Computer applications and software development', 'C Programming, Data Structures, DBMS, Web Development, Networking', 60 FROM departments d WHERE d.code = 'BCA'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'M.C.A.', 'MCA', 'PG', '2 Years', 'Any degree with Mathematics at 12th or graduation level', 35000, 70000, 'Advanced programming, software engineering, AI, cloud computing', 'Software Engineer, Project Manager, Cloud Architect', 'Postgraduate computer applications', 'Advanced Programming, Software Engineering, AI, Cloud Computing', 30 FROM departments d WHERE d.code = 'BCA'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. Computer Technology', 'BSCTC', 'UG', '3 Years', '12th with Mathematics (Science stream)', 22000, 66000, 'Hardware, networking, programming, system administration, IoT', 'System Administrator, Network Engineer, Hardware Engineer', 'Computer technology and systems', 'Computer Hardware, Networking, Programming, System Admin, IoT', 60 FROM departments d WHERE d.code = 'CT'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. Biotechnology', 'BSCBIO', 'UG', '3 Years', '12th with Science (Biology preferred)', 28000, 84000, 'Cell biology, genetics, microbiology, bioinformatics, bioprocess', 'Research Associate, Lab Technician, Biotech Analyst', 'Biotechnology and life sciences', 'Cell Biology, Genetics, Microbiology, Bioinformatics, Bioprocess', 50 FROM departments d WHERE d.code = 'BIO'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'M.Sc. Biotechnology', 'MSCBIO', 'PG', '2 Years', 'B.Sc. Biotechnology or related life science', 35000, 70000, 'Advanced genetics, molecular biology, immunology, research', 'Research Scientist, Clinical Researcher, Professor', 'Postgraduate biotechnology and research', 'Advanced Genetics, Molecular Biology, Immunology, Research Methods', 25 FROM departments d WHERE d.code = 'BIO'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. AI & Data Science', 'BSCAIDS', 'UG', '3 Years', '12th with Mathematics (Science stream)', 45000, 135000, 'Python, machine learning, deep learning, NLP, data analytics, big data', 'Data Scientist, ML Engineer, AI Developer, Data Analyst', 'AI and data science fundamentals', 'Python, Machine Learning, Deep Learning, NLP, Data Analytics, Big Data', 60 FROM departments d WHERE d.code = 'AIDS'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. AI & Machine Learning', 'BSCAIML', 'UG', '3 Years', '12th with Mathematics (Science stream)', 48000, 144000, 'ML algorithms, neural networks, computer vision, reinforcement learning', 'ML Engineer, AI Researcher, Computer Vision Engineer', 'AI and machine learning specialization', 'ML Algorithms, Neural Networks, Computer Vision, Reinforcement Learning', 60 FROM departments d WHERE d.code = 'AIML'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. Costume Design and Fashion', 'BSCCDF', 'UG', '3 Years', '12th pass (any stream)', 35000, 105000, 'Fashion illustration, garment construction, textile science, CAD', 'Fashion Designer, Stylist, Apparel Merchandiser, Entrepreneur', 'Costume design and fashion technology', 'Fashion Illustration, Garment Construction, Textile Science, CAD Design', 40 FROM departments d WHERE d.code = 'CDF'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. Computer Science', 'BSCCSC', 'UG', '3 Years', '12th with Mathematics (Science stream)', 20000, 60000, 'Programming, algorithms, OS, DBMS, computer networks, software engineering', 'Software Developer, Programmer, IT Consultant, Developer', 'Computer science fundamentals', 'C/C++, Algorithms, OS, DBMS, Computer Networks, Software Engineering', 60 FROM departments d WHERE d.code = 'CSC'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'M.Sc. Computer Science', 'MSCCSC', 'PG', '2 Years', 'B.Sc. Computer Science or equivalent', 30000, 60000, 'Advanced algorithms, distributed systems, cloud, research', 'Senior Developer, Systems Architect, Researcher', 'Postgraduate computer science', 'Advanced Algorithms, Distributed Systems, Cloud Computing, Research', 30 FROM departments d WHERE d.code = 'CSC'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. Physics', 'BSCPHY', 'UG', '3 Years', '12th with Science (Physics preferred)', 16000, 48000, 'Mechanics, optics, thermodynamics, electronics, quantum physics', 'Research Assistant, Teacher, Instrumentation Engineer', 'Physics and applied physics', 'Mechanics, Optics, Thermodynamics, Electronics, Quantum Physics', 50 FROM departments d WHERE d.code = 'PHY'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'B.Sc. Chemistry', 'BSCCHE', 'UG', '3 Years', '12th with Science (Chemistry preferred)', 16000, 48000, 'Organic, inorganic, physical, analytical chemistry, lab techniques', 'Chemist, Lab Analyst, Quality Control, Research Assistant', 'Chemistry and chemical analysis', 'Organic Chemistry, Inorganic Chemistry, Physical Chemistry, Analytical Chemistry', 50 FROM departments d WHERE d.code = 'CHE'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (department_id, name, code, level, duration, eligibility, fee_annual, fee_total, syllabus, careers, description, subjects, intake)
SELECT d.id, 'M.B.A.', 'MBA', 'PG', '2 Years', 'Any degree', 50000, 100000, 'Strategic management, finance, marketing, HR, operations, analytics', 'Manager, Business Consultant, Entrepreneur, Analyst', 'Postgraduate management studies', 'Strategic Management, Finance, Marketing, HR, Operations, Analytics', 60 FROM departments d WHERE d.code = 'MBA'
ON CONFLICT (code) DO NOTHING;

-- ============ SEED: FACULTY ============
INSERT INTO faculty (department_id, name, designation, qualification, specialization, experience, display_order)
SELECT d.id, 'Dr. K. Murugesan', 'Professor & HOD', 'Ph.D. in Tamil', 'Tamil Literature', 22, 1 FROM departments d WHERE d.code = 'TAM'
UNION ALL
SELECT d.id, 'Dr. R. Saravanan', 'Professor & HOD', 'Ph.D. in English', 'English Literature', 20, 1 FROM departments d WHERE d.code = 'ENG'
UNION ALL
SELECT d.id, 'Dr. V. Krishnan', 'Professor & HOD', 'Ph.D. in Mathematics', 'Applied Mathematics', 25, 1 FROM departments d WHERE d.code = 'MAT'
UNION ALL
SELECT d.id, 'Dr. S. Kavitha', 'Professor & HOD', 'Ph.D. in Commerce', 'Accounting & Finance', 18, 1 FROM departments d WHERE d.code = 'COM'
UNION ALL
SELECT d.id, 'Dr. M. Priya', 'Associate Professor & HOD', 'Ph.D. in Management', 'Business Strategy', 15, 1 FROM departments d WHERE d.code = 'BBA'
UNION ALL
SELECT d.id, 'Dr. A. Rajesh', 'Professor & HOD', 'Ph.D. in Computer Science', 'Software Engineering', 20, 1 FROM departments d WHERE d.code = 'BCA'
UNION ALL
SELECT d.id, 'Dr. P. Arumugam', 'Associate Professor & HOD', 'Ph.D. in Computer Science', 'Networking', 16, 1 FROM departments d WHERE d.code = 'CT'
UNION ALL
SELECT d.id, 'Dr. N. Deepa', 'Professor & HOD', 'Ph.D. in Biotechnology', 'Genetic Engineering', 17, 1 FROM departments d WHERE d.code = 'BIO'
UNION ALL
SELECT d.id, 'Dr. K. Senthil', 'Professor & HOD', 'Ph.D. in AI', 'Deep Learning', 12, 1 FROM departments d WHERE d.code = 'AIDS'
UNION ALL
SELECT d.id, 'Dr. R. Vijay', 'Professor & HOD', 'Ph.D. in ML', 'Machine Learning', 11, 1 FROM departments d WHERE d.code = 'AIML'
UNION ALL
SELECT d.id, 'Dr. L. Revathi', 'Associate Professor & HOD', 'Ph.D. in Fashion Design', 'Textile Design', 14, 1 FROM departments d WHERE d.code = 'CDF'
UNION ALL
SELECT d.id, 'Dr. G. Murugan', 'Professor & HOD', 'Ph.D. in Physics', 'Optics', 23, 1 FROM departments d WHERE d.code = 'PHY'
UNION ALL
SELECT d.id, 'Dr. T. Anand', 'Professor & HOD', 'Ph.D. in Chemistry', 'Organic Chemistry', 21, 1 FROM departments d WHERE d.code = 'CHE'
UNION ALL
SELECT d.id, 'Dr. D. Karthik', 'Professor & HOD', 'Ph.D. in Computer Science', 'Algorithms', 19, 1 FROM departments d WHERE d.code = 'CSC'
UNION ALL
SELECT d.id, 'Dr. S. Mahesh', 'Professor & HOD', 'Ph.D. in Management', 'Strategic Management', 16, 1 FROM departments d WHERE d.code = 'MBA'
ON CONFLICT DO NOTHING;

-- ============ SEED: BUS_ROUTES ============
INSERT INTO bus_routes (area, route_number, pickup_time, drop_time, fee_annual, stops) VALUES
('Erode City', 'R1', '7:00 AM', '5:30 PM', 10000, 'Erode Junction, PS Park, Periyar Bus Stand, Thindal, College'),
('Perundurai', 'R2', '7:15 AM', '5:45 PM', 12000, 'Perundurai Bus Stand, Vijayamangalam, Chennimalai, College'),
('Bhavani', 'R3', '7:00 AM', '5:30 PM', 12000, 'Bhavani Bus Stand, Sathyamangalam Road, Koodapalayam, College'),
('Gobichettipalayam', 'R4', '6:45 AM', '6:00 PM', 14000, 'Gobi Bus Stand, Pariyur, Bhavani, College'),
('Tiruppur', 'R5', '6:30 AM', '6:15 PM', 16000, 'Tiruppur Junction, Avinashi, Perundurai, College'),
('Coimbatore', 'R6', '6:15 AM', '6:30 PM', 18000, 'Gandhipuram, Saravanampatti, Avinashi, College'),
('Sathyamangalam', 'R7', '6:45 AM', '6:00 PM', 14000, 'Sathy Bus Stand, Gobichettipalayam, Bhavani, College'),
('Namakkal', 'R8', '6:30 AM', '6:15 PM', 16000, 'Namakkal Bus Stand, Mohanur, Pallipalayam, Erode, College')
ON CONFLICT DO NOTHING;

-- ============ SEED: NOTIFICATIONS ============
INSERT INTO notifications (title, body, category, date, priority) VALUES
('UG Admission 2025-26 Open', 'Applications are now open for all UG programs. Last date: June 30, 2025.', 'admission', '2025-05-15', 'high'),
('End Semester Exam Time Table Released', 'The end semester examination time table for all courses is now available on the exam portal.', 'exam', '2025-10-10', 'high'),
('Sports Day 2025', 'Annual sports day will be held on October 25, 2025. All students are encouraged to participate.', 'event', '2025-10-05', 'normal'),
('NAAC Peer Team Visit', 'NAAC peer team visit scheduled for November 2025. All departments prepare documentation.', 'circular', '2025-09-28', 'high'),
('Placement Drive - TCS', 'TCS campus placement drive on October 18, 2025. Eligible final year students register by October 15.', 'placement', '2025-10-08', 'high'),
('Library Extension Hours', 'Library will remain open until 8 PM during exam weeks for study.', 'circular', '2025-10-01', 'normal'),
('Inter-College Cultural Fest', 'Nandha Cultural Fest "Ezhil 2025" on November 15-16. Register at cultural committee.', 'event', '2025-09-20', 'normal'),
('PG Admission Notification', 'PG program admissions for 2025-26 now open. Apply before July 15, 2025.', 'admission', '2025-05-20', 'high')
ON CONFLICT DO NOTHING;

-- ============ SEED: EVENTS ============
INSERT INTO events (title, description, event_date, event_time, venue, category) VALUES
('TCS Placement Drive', 'Campus placement drive by Tata Consultancy Services for final year students', '2025-10-18', '9:00 AM', 'Seminar Hall', 'placement'),
('Annual Sports Day', 'Annual athletic meet with track and field events', '2025-10-25', '8:00 AM', 'Sports Ground', 'event'),
('Ezhil Cultural Fest', 'Two-day inter-college cultural festival featuring music, dance, and drama', '2025-11-15', '10:00 AM', 'Auditorium', 'event'),
('NAAC Peer Team Visit', 'NAAC re-accreditation peer team inspection', '2025-11-05', '10:00 AM', 'Administrative Block', 'academic'),
('Model Exam - UG', 'Model examination for all UG courses before semester exams', '2025-10-20', '9:00 AM', 'Exam Halls', 'exam'),
('Tech Symposium 2025', 'Department of AI&DS tech symposium on emerging AI trends', '2025-11-22', '9:30 AM', 'Seminar Hall', 'event')
ON CONFLICT DO NOTHING;

-- ============ SEED: INTENTS (40+ with 8-10 patterns each) ============
INSERT INTO intents (intent_name, category, patterns, response_en, response_ta, suggestions) VALUES
('greeting', 'general',
ARRAY['hello','hi','hey','good morning','good evening','good afternoon','vanakkam','namaste','hai','helo'],
'Hello! Welcome to Nandha Arts and Science College. I''m Nandha Assistant. How can I help you today? You can ask me about courses, fees, admissions, hostel, transport, placements and more!',
'வணக்கம்! நந்தா கலை அறிவியல் கல்லூரிக்கு வரவேற்கிறோம். நான் நந்தா அசிஸ்டென்ட். நான் உங்களுக்கு எப்படி உதவ முடியும்?',
ARRAY['About the college','Courses offered','Admission process','Fees structure']),

('about_college', 'college',
ARRAY['about the college','tell me about nandha','about nandha college','nandha college about','college details','about college','tell me about college','college information','nandha college details','about nas c'],
'Nandha Arts and Science College (Autonomous) is a self-financed, co-educational institution established in 2000 by Sri Nandha Educational Trust. Located on Erode-Coimbatore Road, it is affiliated to Bharathiar University, Coimbatore, and NAAC Re-accredited with B+ Grade (CGPA 2.64). Our motto is "Learn, Serve and Succeed". We offer 18+ departments with UG, PG and Research programs.',
'நந்தா கலை அறிவியல் கல்லூரி (தன்னாட்சி) 2000ஆம் ஆண்டு ஸ்ரீ நந்தா கல்வி அறக்கட்டளையால் நிறுவப்பட்டது. இது பாரதியார் பல்கலைக்கழகத்துடன் இணைக்கப்பட்டுள்ளது மற்றும் NAAC B+ தரம் பெற்றுள்ளது.',
ARRAY['Accreditation details','Principal info','Courses offered','Location']),

('accreditation', 'college',
ARRAY['naac','naac grade','naac accreditation','accreditation','naac rating','naac cgpa','naac score','grade','nac','reaccredited'],
'Nandha Arts and Science College is NAAC Re-accredited with B+ Grade (CGPA 2.64). This reflects our commitment to quality education, infrastructure, and continuous improvement in academics.',
'நந்தா கலை அறிவியல் கல்லூரி NAAC B+ தரம் (CGPA 2.64) பெற்றுள்ளது. இது தரமான கல்விக்கான எங்கள் அர்ப்பணிப்பை பிரதிபலிக்கிறது.',
ARRAY['About the college','Affiliation','Principal info','Courses offered']),

('motto', 'college',
ARRAY['motto','college motto','what is the motto','nandha motto','learn serve succeed','college slogan','mission','vision','aim'],
'Our college motto is "Learn, Serve and Succeed". We believe in empowering students through knowledge, encouraging them to serve society, and helping them succeed in their chosen careers.',
'எங்கள் கல்லூரியின் குறிக்கோள் "Learn, Serve and Succeed" (கற்க, சேவையாற்று, வெற்றி பெறு). அறிவு மூலம் மாணவர்களை வலுப்படுத்துவதை நாங்கள் நம்புகிறோம்.',
ARRAY['About the college','Principal info','Accreditation','Values']),

('principal', 'college',
ARRAY['principal','who is the principal','principal name','head of college','college principal','dr manoharan','manoharan','principal sir','principal details','ho d principal'],
'The Principal of Nandha Arts and Science College is Dr. S. Manoharan. He leads the institution with a vision for academic excellence and holistic student development.',
'நந்தா கலை அறிவியல் கல்லூரியின் முதல்வர் டாக்டர் எஸ். மனோகரன். கல்வி சிறப்பிற்கான பார்வையுடன் அவர் இந்த நிறுவனத்தை வழிநடத்துகிறார்.',
ARRAY['About the college','Vice principal','Departments','Contact']),

('admission_process', 'admission',
ARRAY['admission','how to apply','admission process','how to get admission','admission procedure','join college','enrollment','application process','admission details','join nandha'],
'To get admission at Nandha Arts and Science College: 1) Fill out the application form (online or in person), 2) Submit required documents (12th mark sheet, transfer certificate, community certificate, photos), 3) Attend document verification, 4) Pay the admission fee, 5) Get your admission confirmation. Applications for 2025-26 are now open!',
'நந்தா கலை அறிவியல் கல்லூரியில் சேர்க்கை: 1) விண்ணப்பப் படிவத்தை நிரப்பவும், 2) தேவையான ஆவணங்களை சமர்ப்பிக்கவும், 3) ஆவணங்களை சரிபார்க்கவும், 4) கட்டணம் செலுத்தவும், 5) சேர்க்கை உறுதிப்படுத்தவும்.',
ARRAY['Required documents','Eligibility criteria','Fee structure','Contact admission']),

('admission_documents', 'admission',
ARRAY['documents','required documents','what documents needed','documents for admission','papers needed','certificate needed','id documents','admission papers','tc','transfer certificate'],
'Documents required for admission: 1) 12th Mark Sheet (original + copy), 2) Transfer Certificate (TC), 3) Community Certificate, 4) Passport size photos (4), 5) Aadhaar Card copy, 6) Income Certificate (if applicable), 7) Migration Certificate (if from other board).',
'சேர்க்கைக்கு தேவையான ஆவணங்கள்: 1) 12ஆம் வகுப்பு மதிப்பெண் பட்டியல், 2) பள்ளி இடமாற்ற சான்றிதழ், 3) சமூக சான்றிதழ், 4) பாஸ்போர்ட் அளவு புகைப்படங்கள், 5) ஆதார் அட்டை நகல்.',
ARRAY['Admission process','Eligibility criteria','Fee structure','Apply now']),

('eligibility', 'admission',
ARRAY['eligibility','eligible','eligibility criteria','who can apply','admission eligibility','qualification required','12th marks required','cutoff','cut off','minimum marks'],
'Eligibility varies by course: UG programs require 12th pass (Science stream for B.Sc., any stream for B.Com/BBA/BCA). PG programs require a relevant bachelor''s degree. Most courses need a minimum of 50% in qualifying exam. Use our Eligibility Checker tool to find courses you qualify for!',
'தகுதி: UG படிப்புகளுக்கு 12ஆம் வகுப்பு தேர்ச்சி தேவை. PG படிப்புகளுக்கு சம்பந்தப்பட்ட இளநிலை பட்டம் தேவை. பெரும்பாலான படிப்புகளுக்கு 50% மதிப்பெண் தேவை.',
ARRAY['Course finder','Fee structure','Admission process','Documents needed']),

('courses_list', 'courses',
ARRAY['courses','what courses','list of courses','courses offered','available courses','programs','what programs','ug courses','pg courses','all courses'],
'We offer 18+ UG and PG programs across Arts, Science, Commerce, Management, and Computer Applications. Popular courses include BCA, B.Sc Computer Science, B.Sc AI&DS, B.Com, BBA, B.Sc Biotechnology, B.Sc Mathematics, B.A. English, and B.Sc Costume Design. Visit our Explore page to see all courses with details!',
'நாங்கள் 18+ UG மற்றும் PG படிப்புகளை வழங்குகிறோம். பிரபலமான படிப்புகள்: BCA, B.Sc Computer Science, B.Sc AI&DS, B.Com, BBA, B.Sc Biotechnology. எல்லா படிப்புகளையும் பார்க்க Explore பக்கத்தை பார்வையிடவும்.',
ARRAY['BCA details','B.Sc AI&DS details','B.Com details','Fee structure']),

('bca_course', 'courses',
ARRAY['bca','bca course','bca details','bca fees','bca eligibility','bca duration','bca subjects','bca admission','computer applications','bca career'],
'BCA (Bachelor of Computer Applications) is a 3-year UG program. Eligibility: 12th pass with Mathematics (any stream). Annual fee: Rs. 25,000 (Total: Rs. 75,000). Subjects: C Programming, Data Structures, DBMS, Web Development, Networking. Careers: Software Developer, Web Developer, System Analyst.',
'BCA (இளநிலை கணினி பயன்பாடுகள்) 3 ஆண்டு UG படிப்பு. தகுதி: 12ஆம் வகுப்பு கணிதத்துடன் தேர்ச்சி. ஆண்டு கட்டணம்: ரூ. 25,000.',
ARRAY['MCA details','B.Sc CS details','Fee calculator','Apply now']),

('bsc_aids', 'courses',
ARRAY['ai ds','aids','ai and data science','data science','b sc aids','ai data science course','data science course','machine learning course','artificial intelligence course','b sc ai'],
'B.Sc. AI & Data Science is a 3-year UG program. Eligibility: 12th with Mathematics (Science stream). Annual fee: Rs. 45,000 (Total: Rs. 1,35,000). Subjects: Python, Machine Learning, Deep Learning, NLP, Data Analytics, Big Data. Careers: Data Scientist, ML Engineer, AI Developer, Data Analyst.',
'B.Sc. AI & Data Science 3 ஆண்டு UG படிப்பு. தகுதி: 12ஆம் வகுப்பு அறிவியல் கணிதம். ஆண்டு கட்டணம்: ரூ. 45,000. தொழில்கள்: Data Scientist, ML Engineer, AI Developer.',
ARRAY['B.Sc AI&ML details','B.Sc CS details','Fee calculator','Career paths']),

('bsc_aiml', 'courses',
ARRAY['ai ml','aiml','ai and machine learning','machine learning','b sc aiml','ml course','b sc ai ml','ai ml course details','artificial intelligence ml','ai ml fees'],
'B.Sc. AI & Machine Learning is a 3-year UG program. Eligibility: 12th with Mathematics (Science stream). Annual fee: Rs. 48,000 (Total: Rs. 1,44,000). Subjects: ML Algorithms, Neural Networks, Computer Vision, Reinforcement Learning. Careers: ML Engineer, AI Researcher, Computer Vision Engineer.',
'B.Sc. AI & Machine Learning 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 48,000. தொழில்கள்: ML Engineer, AI Researcher.',
ARRAY['B.Sc AI&DS details','B.Sc CS details','Fee calculator','Career paths']),

('bsc_cs', 'courses',
ARRAY['b sc cs','computer science','bsc cs','b sc computer science','cs course','computer science course','cs fees','cs eligibility','cs subjects','b sc csc'],
'B.Sc. Computer Science is a 3-year UG program. Eligibility: 12th with Mathematics (Science stream). Annual fee: Rs. 20,000 (Total: Rs. 60,000). Subjects: C/C++, Algorithms, OS, DBMS, Computer Networks, Software Engineering. Careers: Software Developer, Programmer, IT Consultant.',
'B.Sc. Computer Science 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 20,000. தொழில்கள்: Software Developer, Programmer, IT Consultant.',
ARRAY['BCA details','M.Sc CS details','Fee calculator','Career paths']),

('bcom_course', 'courses',
ARRAY['b com','bcom','commerce','b com course','bcom fees','bcom eligibility','bcom details','b com subjects','accounting course','commerce course'],
'B.Com. (Bachelor of Commerce) is a 3-year UG program. Eligibility: 12th pass (Commerce/Science stream preferred). Annual fee: Rs. 12,000 (Total: Rs. 36,000). Subjects: Financial Accounting, Business Management, Taxation, Economics, Auditing. Careers: Accountant, Auditor, Tax Consultant, Bank Officer.',
'B.Com. (இளநிலை வணிகம்) 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 12,000. தொழில்கள்: Accountant, Auditor, Tax Consultant.',
ARRAY['M.Com details','BBA details','Fee calculator','Career paths']),

('bba_course', 'courses',
ARRAY['bba','bba course','bba fees','bba details','bba eligibility','business administration','bba subjects','bba career','bba admission','management course'],
'BBA (Bachelor of Business Administration) is a 3-year UG program. Eligibility: 12th pass (any stream). Annual fee: Rs. 18,000 (Total: Rs. 54,000). Subjects: Management Principles, Marketing, HR, Finance, Entrepreneurship. Careers: Management Trainee, Marketing Executive, HR Assistant.',
'BBA (இளநிலை வணிக நிர்வாகம்) 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 18,000. தொழில்கள்: Management Trainee, Marketing Executive.',
ARRAY['MBA details','B.Com details','Fee calculator','Career paths']),

('bsc_biotech', 'courses',
ARRAY['biotechnology','bio tech','b sc bio','biotech','biotechnology course','b sc biotechnology','bio fees','bio eligibility','bio subjects','life science'],
'B.Sc. Biotechnology is a 3-year UG program. Eligibility: 12th with Science (Biology preferred). Annual fee: Rs. 28,000 (Total: Rs. 84,000). Subjects: Cell Biology, Genetics, Microbiology, Bioinformatics, Bioprocess. Careers: Research Associate, Lab Technician, Biotech Analyst.',
'B.Sc. Biotechnology 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 28,000. தொழில்கள்: Research Associate, Lab Technician.',
ARRAY['M.Sc Biotech details','B.Sc Chemistry','Fee calculator','Career paths']),

('bsc_math', 'courses',
ARRAY['b sc maths','mathematics','b sc mathematics','maths course','maths fees','math eligibility','math subjects','b sc math','maths details','b sc maths career'],
'B.Sc. Mathematics is a 3-year UG program. Eligibility: 12th with Mathematics (Science stream). Annual fee: Rs. 15,000 (Total: Rs. 45,000). Subjects: Algebra, Calculus, Trigonometry, Statistics, Discrete Math. Careers: Data Analyst, Teacher, Bank Officer, Actuary.',
'B.Sc. Mathematics 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 15,000. தொழில்கள்: Data Analyst, Teacher, Bank Officer.',
ARRAY['M.Sc Maths details','B.Sc Physics','Fee calculator','Career paths']),

('ba_english', 'courses',
ARRAY['b a english','english','ba english','english course','english literature','ba fees','english eligibility','english subjects','b a english details','literature'],
'B.A. English is a 3-year UG program. Eligibility: 12th pass with English. Annual fee: Rs. 12,000 (Total: Rs. 36,000). Subjects: English Literature, Grammar, Poetry, Drama, Communication Skills. Careers: Teacher, Content Writer, BPO Executive, Translator.',
'B.A. English 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 12,000. தொழில்கள்: Teacher, Content Writer, Translator.',
ARRAY['M.A. English details','B.A. Tamil','Fee calculator','Career paths']),

('ba_tamil', 'courses',
ARRAY['b a tamil','tamil','ba tamil','tamil course','tamil literature','ba tamil fees','tamil eligibility','tamil subjects','b a tamil details','tamil padam'],
'B.A. Tamil is a 3-year UG program. Eligibility: 12th pass with Tamil as a subject. Annual fee: Rs. 7,275 (Total: Rs. 21,825). Subjects: Tamil Literature, Grammar, Poetry, Drama, Literary Criticism. Careers: Teacher, Translator, Journalist, Content Writer.',
'B.A. Tamil 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 7,275. தொழில்கள்: Teacher, Translator, Journalist.',
ARRAY['M.A. Tamil details','B.A. English','Fee calculator','Career paths']),

('bsc_cdf', 'courses',
ARRAY['costume design','fashion','cdf','costume design and fashion','fashion design','b sc cdf','fashion course','garment design','textile design','fashion technology'],
'B.Sc. Costume Design and Fashion is a 3-year UG program. Eligibility: 12th pass (any stream). Annual fee: Rs. 35,000 (Total: Rs. 1,05,000). Subjects: Fashion Illustration, Garment Construction, Textile Science, CAD Design. Careers: Fashion Designer, Stylist, Apparel Merchandiser, Entrepreneur.',
'B.Sc. Costume Design and Fashion 3 ஆண்டு UG படிப்பு. ஆண்டு கட்டணம்: ரூ. 35,000. தொழில்கள்: Fashion Designer, Stylist.',
ARRAY['B.A. English details','Fee calculator','Career paths','Apply now']),

('mca_course', 'courses',
ARRAY['mca','mca course','mca fees','mca eligibility','mca details','mca subjects','mca admission','master computer applications','mca career','pg computer'],
'MCA (Master of Computer Applications) is a 2-year PG program. Eligibility: Any degree with Mathematics at 12th or graduation level. Annual fee: Rs. 35,000 (Total: Rs. 70,000). Subjects: Advanced Programming, Software Engineering, AI, Cloud Computing. Careers: Software Engineer, Project Manager, Cloud Architect.',
'MCA (முதுநிலை கணினி பயன்பாடுகள்) 2 ஆண்டு PG படிப்பு. ஆண்டு கட்டணம்: ரூ. 35,000. தொழில்கள்: Software Engineer, Project Manager.',
ARRAY['BCA details','M.Sc CS details','Fee calculator','Career paths']),

('mba_course', 'courses',
ARRAY['mba','mba course','mba fees','mba eligibility','mba details','mba subjects','master business administration','pg management','mba admission','mba career'],
'MBA (Master of Business Administration) is a 2-year PG program. Eligibility: Any degree. Annual fee: Rs. 50,000 (Total: Rs. 1,00,000). Subjects: Strategic Management, Finance, Marketing, HR, Operations, Analytics. Careers: Manager, Business Consultant, Entrepreneur, Analyst.',
'MBA (முதுநிலை வணிக நிர்வாகம்) 2 ஆண்டு PG படிப்பு. ஆண்டு கட்டணம்: ரூ. 50,000. தொழில்கள்: Manager, Business Consultant, Entrepreneur.',
ARRAY['BBA details','M.Com details','Fee calculator','Career paths']),

('fees_general', 'fees',
ARRAY['fees','fee structure','how much fees','fee details','total fees','annual fees','course fees','fees information','fee amount','cost'],
'Fees vary by course: B.A. Tamil starts from Rs. 7,275/year, B.Com from Rs. 12,000/year, B.Sc CS from Rs. 20,000/year, BCA from Rs. 25,000/year, B.Sc AI&DS from Rs. 45,000/year, MBA from Rs. 50,000/year. Use our Fee Calculator to estimate your total cost including hostel and transport!',
'கட்டணம் படிப்பைப் பொறுத்து மாறுபடும்: B.A. Tamil ரூ. 7,275/ஆண்டு முதல், BCA ரூ. 25,000/ஆண்டு, B.Sc AI&DS ரூ. 45,000/ஆண்டு. மொத்த செலவை கணக்கிட Fee Calculator பயன்படுத்தவும்.',
ARRAY['Fee calculator','Hostel fees','Transport fees','Scholarship info']),

('fees_hostel', 'fees',
ARRAY['hostel fees','hostel cost','hostel charges','hostel rent','stay charges','hostel amount','room rent','hostel fee','hostel cost per year','accommodation fees'],
'Hostel fees (sample, editable): Men''s hostel: Rs. 40,000/year (including food). Women''s hostel: Rs. 42,000/year (including food). Separate hostels are available for men and women with 24/7 security, Wi-Fi, and mess facilities.',
'விடுதி கட்டணம்: ஆண்கள் விடுதி ரூ. 40,000/ஆண்டு (உணவு உட்பட). பெண்கள் விடுதி ரூ. 42,000/ஆண்டு (உணவு உட்பட). தனித்தனி விடுதி வசதி உள்ளது.',
ARRAY['Fee calculator','Transport fees','Hostel facilities','Apply now']),

('fees_transport', 'fees',
ARRAY['transport fees','bus fees','transport cost','bus charges','bus fee','transport amount','bus amount','travel fees','conveyance','bus pass fees'],
'Transport fees vary by route: Erode City Rs. 10,000/year, Perundurai Rs. 12,000/year, Bhavani Rs. 12,000/year, Gobichettipalayam Rs. 14,000/year, Tiruppur Rs. 16,000/year, Coimbatore Rs. 18,000/year. Use our Bus Route Finder for details!',
'போக்குவரத்து கட்டணம் வழித்தடத்தை பொறுத்து மாறுபடும்: ஈரோடு ரூ. 10,000/ஆண்டு, திருப்பூர் ரூ. 16,000/ஆண்டு. விவரங்களுக்கு Bus Route Finder பயன்படுத்தவும்.',
ARRAY['Bus route finder','Fee calculator','Hostel fees','Routes list']),

('scholarship', 'fees',
ARRAY['scholarship','scholar','financial aid','fee concession','discount','fee reduction','free education','stipend','education loan','fee waiver'],
'Scholarships available: 1) Government scholarships for SC/ST/OBC students, 2) Merit scholarship for students scoring above 90% in 12th, 3) Sports scholarship for outstanding athletes, 4) First-generation learner scholarship. Contact the admission office for details and eligibility.',
'கிடைக்கும் உதவித்தொகை: 1) அரசு உதவித்தொகை (SC/ST/OBC), 2) சிறப்பு திறமை உதவித்தொகை (90%+), 3) விளையாட்டு உதவித்தொகை. விவரங்களுக்கு சேர்க்கை அலுவலகத்தை தொடர்பு கொள்ளவும்.',
ARRAY['Fee structure','Admission process','Contact','Fee calculator']),

('hostel_facilities', 'facilities',
ARRAY['hostel','hostel facilities','hostel room','accommodation','stay','hostel details','hostel info','hostel available','hostel irukka','room'],
'Yes, Nandha Arts and Science College provides separate hostels for men and women. Facilities include: 24/7 security, Wi-Fi, mess (vegetarian & non-veg), hot water, study halls, recreation rooms, and medical care. Men''s hostel fee: Rs. 40,000/year, Women''s hostel fee: Rs. 42,000/year (including food).',
'ஆம், ஆண்கள் மற்றும் பெண்களுக்கு தனித்தனி விடுதி உள்ளது. வசதிகள்: 24/7 பாதுகாப்பு, Wi-Fi, உணவு, சுடுநீர், படிப்பு அறை, மருத்துவ வசதி.',
ARRAY['Hostel fees','Transport info','Library info','Apply now']),

('transport', 'facilities',
ARRAY['transport','bus','bus service','bus facility','college bus','transport service','bus route','bus timing','transport available','bus irukka'],
'Yes, the college provides bus transport from Erode, Perundurai, Bhavani, Gobichettipalayam, Tiruppur, Coimbatore, Sathyamangalam, and Namakkal. Fees range from Rs. 10,000 to Rs. 18,000/year depending on the route. Use our Smart Bus Route Finder to find your route and pickup time!',
'ஆம், ஈரோடு, பெருந்துறை, பவானி, கோபிசெட்டிபாளையம், திருப்பூர், கோயம்புத்தூர் ஆகிய இடங்களிலிருந்து பேருந்து வசதி உள்ளது. கட்டணம் ரூ. 10,000 முதல் ரூ. 18,000/ஆண்டு.',
ARRAY['Bus route finder','Transport fees','Hostel info','Routes list']),

('library', 'facilities',
ARRAY['library','digital library','library facilities','books','library resources','library timing','study material','library info','library hours','reading room'],
'Our digital library has a vast collection of books, journals, e-resources, and study materials. Facilities include: digital access portal, reference section, periodicals, e-journals, internet browsing, reading hall, and book bank scheme. Library is open from 8:00 AM to 6:00 PM on working days.',
'எங்கள் டிஜிட்டல் நூலகத்தில் புத்தகங்கள், பத்திரிகைகள், மின்-வளங்கள் உள்ளன. நூலகம் காலை 8:00 மணி முதல் மாலை 6:00 மணி வரை திறந்திருக்கும்.',
ARRAY['Lab facilities','Sports info','Hostel info','Facilities list']),

('labs', 'facilities',
ARRAY['lab','labs','laboratory','research lab','advanced lab','science lab','computer lab','lab facilities','lab equipment','practical lab'],
'Nandha Arts and Science College has advanced research labs including: Computer Labs (with latest hardware and software), Biotechnology Lab, Chemistry Lab, Physics Lab, AI & ML Lab (with GPU workstations), and Fashion Design Studio. All labs are equipped with modern instruments and safety equipment.',
'நந்தா கலை அறிவியல் கல்லூரியில் மேம்பட்ட ஆய்வகங்கள் உள்ளன: கணினி ஆய்வகம், உயிரி தொழில்நுட்ப ஆய்வகம், வேதியியல் ஆய்வகம், AI & ML ஆய்வகம்.',
ARRAY['Library info','Sports info','Hostel info','Facilities list']),

('sports', 'facilities',
ARRAY['sports','sports facilities','games','playground','athletics','sports ground','gym','fitness','sports infrastructure','physical education'],
'Sports infrastructure includes: outdoor cricket ground, football field, basketball court, volleyball court, badminton court, athletics track, indoor games room (table tennis, chess, carrom), and a fitness center. Annual sports day is held every year with inter-department competitions.',
'விளையாட்டு வசதிகள்: கிரிக்கெட் மைதானம், கால்பந்து மைதானம், கூடைப்பந்து, பந்தாட்டம், தடகள ஓட்டப்பந்தயம், உட்புற விளையாட்டு அறை, உடற்பயிற்சி மையம்.',
ARRAY['Library info','Lab facilities','Hostel info','Events']),

('placement_general', 'placement',
ARRAY['placement','placements','placement cell','job','career','recruitment','campus placement','placement drive','placement info','job placement'],
'Nandha Arts and Science College has a dedicated placement cell. We have 300+ recruiting partners including TCS, Infosys, Wipro, CTS, HCL, Zoho, and more. The highest package is up to 42 LPA (as reported) and the average package is 5.5 LPA. Our placement cell provides training in aptitude, technical skills, and soft skills.',
'நந்தா கலை அறிவியல் கல்லூரியில் சிறப்பு இடம்பெறுதல் அணி உள்ளது. 300+ நிறுவன கூட்டாளர்கள். அதிகபட்ச சம்பளம் 42 LPA, சராசரி 5.5 LPA.',
ARRAY['Top recruiters','Highest package','Placement stats','Training info']),

('placement_packages', 'placement',
ARRAY['package','salary','highest package','average package','salary package','ctc','highest salary','average salary','pay scale','remuneration'],
'Placement packages (as reported, editable): Highest package: 42 LPA, Average package: 5.5 LPA. Top recruiting companies offer competitive packages for CS, AI&DS, BCA, B.Com, and MBA students. The placement cell works to connect students with top recruiters every year.',
'இடம்பெறுதல் தொகை: அதிகபட்சம் 42 LPA, சராசரி 5.5 LPA. முன்னணி நிறுவனங்கள் போட்டி தொகைகளை வழங்குகின்றன.',
ARRAY['Top recruiters','Placement stats','Training info','Career paths']),

('placement_recruiters', 'placement',
ARRAY['recruiters','companies','top recruiters','which companies','recruiting companies','it companies','corporate partners','placement companies','job companies','hiring'],
'Top recruiting partners include: TCS, Infosys, Wipro, Cognizant (CTS), HCL Technologies, Zoho Corporation, Accenture, Capgemini, Tech Mahindra, Bajaj Finserv, HDFC Bank, ICICI Bank, and 300+ more. We maintain strong corporate relationships for student placements.',
'முன்னணி நிறுவன கூட்டாளர்கள்: TCS, Infosys, Wipro, Cognizant, HCL, Zoho, Accenture, Capgemini மற்றும் 300+ நிறுவனங்கள்.',
ARRAY['Highest package','Placement stats','Training info','Placement cell']),

('exam_info', 'academic',
ARRAY['exam','examination','exam dates','semester exam','exam time table','exam schedule','model exam','exam hall','exam fees','exam form'],
'End semester examinations are conducted twice a year (November & May). Model exams are held before the main exams. Exam timetables are published on the notice board and website. The current semester exam timetable has been released. Check the Notifications page for details.',
'இறுவாண்டு தேர்வுகள் ஆண்டிற்கு இருமுறை (நவம்பர் & மே) நடத்தப்படுகின்றன. தேர்வு அட்டவணை Notifications பக்கத்தில் வெளியிடப்பட்டுள்ளது.',
ARRAY['Notifications','Results info','Exam fees','Academic calendar']),

('results', 'academic',
ARRAY['results','result','exam results','marks','grade','result date','result published','semester result','result info','check results'],
'Results are typically published 45 days after the end-semester examinations. Students can check their results on the college notice board and exam portal. Revaluation is available within 15 days of result publication. For result-related queries, contact the exam cell.',
'தேர்வு முடிவுகள் தேர்வு முடிந்து 45 நாட்கள் கழித்து வெளியிடப்படும். மறுமதிப்பீடு முடிவு வெளியீட்டிற்கு 15 நாட்களுக்குள் கிடைக்கும்.',
ARRAY['Exam info','Notifications','Academic calendar','Contact exam cell']),

('events', 'academic',
ARRAY['events','college events','cultural fest','cultural','symposium','tech fest','college fest','annual day','cultural events','upcoming events'],
'Upcoming events: 1) TCS Placement Drive - Oct 18, 2025, 2) Annual Sports Day - Oct 25, 2025, 3) Model Exam - Oct 20, 2025, 4) Ezhil Cultural Fest - Nov 15-16, 2025, 5) NAAC Peer Team Visit - Nov 5, 2025, 6) Tech Symposium - Nov 22, 2025. Check the Events page for live countdowns!',
'வரவிருக்கும் நிகழ்வுகள்: TCS இடம்பெறுதல் - அக் 18, விளையாட்டு தினம் - அக் 25, கலாச்சார திருவிழா - நவ 15-16. விவரங்களுக்கு Events பக்கத்தை பார்வையிடவும்.',
ARRAY['Notifications','Events countdown','Placement drive','Cultural fest']),

('timing', 'academic',
ARRAY['timing','college timing','college hours','working hours','opening time','closing time','class timing','college starts','college ends','office timing'],
'College working hours: 9:00 AM to 4:30 PM (Monday to Friday). Office hours: 9:00 AM to 5:00 PM. Library: 8:00 AM to 6:00 PM. Lab hours as per timetable. Saturday is typically a working day for practical sessions (as per academic calendar).',
'கல்லூரி நேரம்: காலை 9:00 மணி முதல் மாலை 4:30 மணி வரை (திங்கள் முதல் வெள்ளி வரை). அலுவலக நேரம்: காலை 9:00 மணி முதல் மாலை 5:00 மணி வரை.',
ARRAY['Library hours','Exam dates','Events','Contact']),

('location', 'contact',
ARRAY['location','where is college','college address','address','location of college','how to reach','where is nandha','college located','directions','where nandha college'],
'Nandha Arts and Science College is located at: Koorapalayam Pirivu, Pichandampalayam (PO), Erode-Coimbatore Road, Erode - 638 052, Tamil Nadu. It is on the Erode-Coimbatore Highway, easily accessible by bus. You can find us on Google Maps from the Contact page.',
'நந்தா கலை அறிவியல் கல்லூரி: கூரப்பாளையம் பிரிவு, பிச்சாந்தம்பாளையம் (பி.ஓ), ஈரோடு-கோயம்புத்தூர் சாலை, ஈரோடு - 638 052.',
ARRAY['Contact info','Bus routes','Open on map','Phone number']),

('contact', 'contact',
ARRAY['contact','phone number','email','contact number','contact details','reach us','phone','email address','contact info','how to contact'],
'Contact Nandha Arts and Science College: Phone: +91 424 2260000, Email: info@nandhaarts.ac.in, Address: Koorapalayam Pirivu, Pichandampalayam (PO), Erode-Coimbatore Road, Erode - 638 052, Tamil Nadu. Visit our Contact page for a form and map.',
'தொடர்பு: தொலைபேசி: +91 424 2260000, மின்னஞ்சல்: info@nandhaarts.ac.in, முகவரி: கூரப்பாளையம் பிரிவு, ஈரோடு - 638 052.',
ARRAY['Location','Open on map','Contact form','Bus routes']),

('affiliation', 'college',
ARRAY['affiliation','affiliated','affiliated to which university','bharathiar university','university affiliation','which university','autonomous','autonomous status','autonomous college','affiliated university'],
'Nandha Arts and Science College is an Autonomous institution affiliated to Bharathiar University, Coimbatore. It was granted autonomous status, allowing it to design its own curriculum, conduct exams, and award degrees while remaining under the university''s umbrella.',
'நந்தா கலை அறிவியல் கல்லூரி பாரதியார் பல்கலைக்கழகம், கோயம்புத்தூருடன் இணைக்கப்பட்ட தன்னாட்சி நிறுவனம்.',
ARRAY['About the college','NAAC grade','Principal info','Courses offered']),

('thanks', 'general',
ARRAY['thank','thanks','thank you','thanks a lot','thx','thank you so much','much obliged','appreciate it','grateful','thanks nandha'],
'You''re welcome! I''m glad I could help. If you have any more questions about Nandha Arts and Science College, feel free to ask anytime. Have a great day!',
'நல்வரவு! உதவ முடிந்ததில் மகிழ்ச்சி. நந்தா கலை அறிவியல் கல்லூரி பற்றி இன்னும் கேள்விகள் இருந்தால், எப்போது வேண்டுமானாலும் கேளுங்கள்.',
ARRAY['Ask another question','Courses','Admission','Contact']),

('established', 'college',
ARRAY['established','founded','started','year established','when was college started','year founded','since when','history','college history','beginning'],
'Nandha Arts and Science College was established in the year 2000 by Sri Nandha Educational Trust. It has been serving the educational needs of the Erode region for over 25 years, growing from a small institution to a multi-department, NAAC-accredited autonomous college.',
'நந்தா கலை அறிவியல் கல்லூரி 2000ஆம் ஆண்டு ஸ்ரீ நந்தா கல்வி அறக்கட்டளையால் நிறுவப்பட்டது. 25+ ஆண்டுகளாக கல்வி சேவையாற்றி வருகிறது.',
ARRAY['About the college','NAAC grade','Trust info','Courses offered']),

('trust', 'college',
ARRAY['trust','who started college','nandha trust','sri nandha educational trust','founded by','management','who runs college','trust details','founding body','managing trust'],
'Nandha Arts and Science College was founded by Sri Nandha Educational Trust in 2000. The trust is committed to providing quality education and has established multiple educational institutions in the Erode region across various fields of study.',
'நந்தா கலை அறிவியல் கல்லூரி 2000ஆம் ஆண்டு ஸ்ரீ நந்தா கல்வி அறக்கட்டளையால் நிறுவப்பட்டது. இந்த அறக்கட்டளை தரமான கல்வி வழங்குவதற்காக உறுதிபூண்டுள்ளது.',
ARRAY['About the college','Established year','NAAC grade','Courses offered']),

('research_programs', 'academic',
ARRAY['research','m phil','phd','research programs','doctoral','mphil','do research','research degree','phd admission','research courses'],
'Nandha Arts and Science College offers M.Phil and Ph.D. research programs in select departments including Tamil, English, Mathematics, Commerce, and Computer Science. Research scholars have access to advanced labs, library resources, and experienced guides. Contact the research committee for admission details.',
'நந்தா கலை அறிவியல் கல்லூரி தமிழ், ஆங்கிலம், கணிதம், வணிகம், கணினி அறிவியல் துறைகளில் M.Phil மற்றும் Ph.D. ஆராய்ச்சி திட்டங்களை வழங்குகிறது.',
ARRAY['PG courses','Faculty info','Lab facilities','Contact research']),

('departments_list', 'college',
ARRAY['departments','how many departments','department list','all departments','streams','how many streams','departments available','department info','department count','streams available'],
'Nandha Arts and Science College has 18+ departments across Arts, Humanities, Science, Commerce, Management, and Computer Applications. Key departments: Tamil, English, Mathematics, Commerce, BBA, BCA, Computer Technology, Biotechnology, AI&DS, AI&ML, Costume Design & Fashion, Physics, Chemistry, and Computer Science.',
'நந்தா கலை அறிவியல் கல்லூரியில் 18+ துறைகள் உள்ளன: தமிழ், ஆங்கிலம், கணிதம், வணிகம், BBA, BCA, கணினி தொழில்நுட்பம், உயிரி தொழில்நுட்பம், AI&DS, AI&ML.',
ARRAY['Courses offered','Faculty info','About the college','Explore departments']),

('college_timing_admission', 'admission',
ARRAY['admission open','when admission start','admission date','admission last date','admission 2025','when admission','admission deadline','admission timing','admission season','admission period'],
'Admissions for 2025-26 are now open! UG admissions: Apply by June 30, 2025. PG admissions: Apply by July 15, 2025. Application forms are available online and at the college office. Early admission ensures seat availability in your preferred course.',
'2025-26 சேர்க்கை திறந்துள்ளது! UG சேர்க்கை: ஜூன் 30, 2025. PG சேர்க்கை: ஜூலை 15, 2025. விண்ணப்பப் படிவங்கள் ஆன்லைனில் மற்றும் கல்லூரி அலுவலகத்தில் கிடைக்கின்றன.',
ARRAY['Apply now','Admission process','Documents needed','Eligibility']),

('fallback', 'general',
ARRAY['i dont know','help me','what can you do','what do you do','tell me something','what can you tell me','what can i ask','options','topics','menu'],
'I can help you with: Courses & programs, Fees & scholarships, Admission process, Eligibility, Hostel & transport, Library & labs, Sports, Placement & recruiters, Exam dates & results, Events, College location & contact, and more. Just type your question!',
'நான் உங்களுக்கு உதவ முடியும்: படிப்புகள், கட்டணம், சேர்க்கை, தகுதி, விடுதி, போக்குவரத்து, நூலகம், இடம்பெறுதல், தேர்வு, நிகழ்வுகள், இடம், தொடர்பு.',
ARRAY['Courses offered','Fees structure','Admission process','Contact info'])
ON CONFLICT (intent_name) DO NOTHING;
