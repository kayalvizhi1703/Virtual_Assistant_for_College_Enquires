import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { MessageSquare, Inbox, ThumbsUp, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/DataContext';

export default function AdminDashboard() {
  const { courses } = useData();
  const [stats, setStats] = useState({ totalChats: 0, todayChats: 0, unanswered: 0, satisfaction: 0, newLeads: 0 });
  const [dailyData, setDailyData] = useState<{ date: string; chats: number }[]>([]);
  const [topicData, setTopicData] = useState<{ name: string; count: number }[]>([]);
  const [feedbackData, setFeedbackData] = useState<{ name: string; value: number }[]>([]);
  const [leadsData, setLeadsData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    const [chats, todayChats, unanswered, feedback, leads] = await Promise.all([
      supabase.from('chat_logs').select('*', { count: 'exact', head: true }),
      supabase.from('chat_logs').select('*', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('unanswered_queries').select('*', { count: 'exact', head: true }).eq('status', 'unresolved'),
      supabase.from('feedback').select('rating'),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'New'),
    ]);

    const totalFeedback = feedback.data?.length || 0;
    const upCount = feedback.data?.filter((f: any) => f.rating === 'up').length || 0;
    const satisfaction = totalFeedback > 0 ? Math.round((upCount / totalFeedback) * 100) : 0;

    setStats({
      totalChats: chats.count || 0,
      todayChats: todayChats.count || 0,
      unanswered: unanswered.count || 0,
      satisfaction,
      newLeads: leads.count || 0,
    });

    // Daily chats (last 7 days)
    const { data: recentChats } = await supabase.from('chat_logs').select('created_at').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());
    const dayMap: Record<string, number> = {};
    recentChats?.forEach((c: any) => {
      const d = c.created_at.split('T')[0];
      dayMap[d] = (dayMap[d] || 0) + 1;
    });
    setDailyData(Object.entries(dayMap).map(([date, chats]) => ({ date: date.slice(5), chats })));

    // Topic distribution
    const { data: chatIntents } = await supabase.from('chat_logs').select('intent_name').not('intent_name', 'is', null);
    const topicMap: Record<string, number> = {};
    chatIntents?.forEach((c: any) => {
      if (c.intent_name) topicMap[c.intent_name] = (topicMap[c.intent_name] || 0) + 1;
    });
    setTopicData(Object.entries(topicMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count })));

    // Feedback ratio
    setFeedbackData([
      { name: 'Positive', value: upCount },
      { name: 'Negative', value: totalFeedback - upCount },
    ]);

    // Leads per course
    const { data: leadsCourse } = await supabase.from('leads').select('course').not('course', 'eq', '');
    const courseMap: Record<string, number> = {};
    leadsCourse?.forEach((l: any) => {
      if (l.course) courseMap[l.course] = (courseMap[l.course] || 0) + 1;
    });
    setLeadsData(Object.entries(courseMap).slice(0, 6).map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 18) + '…' : name, count })));
  };

  const statCards = [
    { label: 'Total Chats', value: stats.totalChats, icon: MessageSquare, color: 'bg-blue-600' },
    { label: "Today's Chats", value: stats.todayChats, icon: TrendingUp, color: 'bg-green-600' },
    { label: 'Unanswered', value: stats.unanswered, icon: Inbox, color: 'bg-amber-600' },
    { label: 'Satisfaction', value: `${stats.satisfaction}%`, icon: ThumbsUp, color: 'bg-purple-600' },
    { label: 'New Leads', value: stats.newLeads, icon: Users, color: 'bg-teal-600' },
  ];

  const pieColors = ['#10b981', '#ef4444'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily chats */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Chats (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Most asked topics */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Most Asked Topics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topicData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback ratio */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Feedback Ratio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={feedbackData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {feedbackData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leads per course */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Leads per Course</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
