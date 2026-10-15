import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Intent, Department, Course, Notification, EventItem, BusRoute, Faculty, Settings } from '@/lib/supabase';

type DataContextType = {
  intents: Intent[];
  departments: Department[];
  courses: Course[];
  notifications: Notification[];
  events: EventItem[];
  busRoutes: BusRoute[];
  faculty: Faculty[];
  settings: Settings | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [
        intentsRes,
        deptsRes,
        coursesRes,
        notifRes,
        eventsRes,
        busRes,
        facultyRes,
        settingsRes,
      ] = await Promise.all([
        supabase.from('intents').select('*').order('intent_name'),
        supabase.from('departments').select('*').order('display_order'),
        supabase.from('courses').select('*').order('name'),
        supabase.from('notifications').select('*').order('date', { ascending: false }),
        supabase.from('events').select('*').order('event_date'),
        supabase.from('bus_routes').select('*').order('area'),
        supabase.from('faculty').select('*').order('display_order'),
        supabase.from('settings').select('*').limit(1).maybeSingle(),
      ]);

      if (intentsRes.data) setIntents(intentsRes.data);
      if (deptsRes.data) setDepartments(deptsRes.data);
      if (coursesRes.data) setCourses(coursesRes.data);
      if (notifRes.data) setNotifications(notifRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (busRes.data) setBusRoutes(busRes.data);
      if (facultyRes.data) setFaculty(facultyRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <DataContext.Provider
      value={{ intents, departments, courses, notifications, events, busRoutes, faculty, settings, loading, refresh }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
