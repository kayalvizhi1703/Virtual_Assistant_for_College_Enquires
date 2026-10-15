import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Course = {
  id: string;
  department_id: string;
  name: string;
  code: string;
  level: string;
  duration: string;
  eligibility: string;
  fee_annual: number;
  fee_total: number;
  syllabus: string;
  careers: string;
  description: string;
  subjects: string;
  intake: number;
};

export type Department = {
  id: string;
  name: string;
  code: string;
  stream: string;
  description: string;
  hod_name: string;
  hod_qualification: string;
  established: number;
  icon: string;
  display_order: number;
};

export type Intent = {
  id: string;
  intent_name: string;
  category: string;
  patterns: string[];
  response_en: string;
  response_ta: string | null;
  suggestions: string[];
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  category: string;
  date: string;
  priority: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
  category: string;
};

export type BusRoute = {
  id: string;
  area: string;
  route_number: string;
  pickup_time: string;
  drop_time: string;
  fee_annual: number;
  stops: string;
};

export type Faculty = {
  id: string;
  department_id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience: number;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  course: string;
  preferred_time: string;
  status: string;
  notes: string;
  created_at: string;
};

export type ChatLog = {
  id: string;
  session_id: string;
  user_message: string;
  bot_response: string;
  intent_name: string | null;
  confidence: number | null;
  language: string;
  created_at: string;
};

export type UnansweredQuery = {
  id: string;
  query: string;
  session_id: string;
  status: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  session_id: string;
  message_id: string;
  rating: string;
  intent_name: string;
  query: string;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export type Settings = {
  id: string;
  college_name: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
  motto: string;
  established: number;
  naac_grade: string;
  naac_cgpa: number;
  affiliation: string;
  trust: string;
  confidence_threshold: number;
  highest_package: string;
  average_package: string;
  recruiters_count: number;
  map_embed_url: string;
};
