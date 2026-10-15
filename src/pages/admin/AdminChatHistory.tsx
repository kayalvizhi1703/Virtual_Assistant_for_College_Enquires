import { useEffect, useState } from 'react';
import { Search, Download, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ChatLog } from '@/lib/supabase';

function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

export default function AdminChatHistory() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const load = async () => {
    let query = supabase.from('chat_logs').select('*').order('created_at', { ascending: false }).limit(200);
    if (dateFilter) query = query.gte('created_at', dateFilter);
    if (search) query = query.or(`user_message.ilike.%${search}%,bot_response.ilike.%${search}%,intent_name.ilike.%${search}%`);
    const { data } = await query;
    if (data) setLogs(data as ChatLog[]);
  };

  useEffect(() => { load(); }, [search, dateFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat History</h1>
        <button onClick={() => downloadCSV('chat_logs.csv', logs as any)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"><Download className="w-5 h-5" /></button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 dark:text-white" />
        </div>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 dark:text-white" />
      </div>

      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
              {log.intent_name && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{log.intent_name}</span>}
              {log.confidence !== null && <span className="text-xs text-gray-400">{(log.confidence * 100).toFixed(0)}%</span>}
              <span className="text-xs text-gray-400">({log.language})</span>
            </div>
            <div className="text-sm">
              <p className="text-blue-600 dark:text-blue-400"><strong>User:</strong> {log.user_message}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-1"><strong>Bot:</strong> {log.bot_response.slice(0, 200)}{log.bot_response.length > 200 ? '...' : ''}</p>
            </div>
          </div>
        ))}
        {logs.length === 0 && <p className="text-center text-gray-400 py-12">No chat logs found.</p>}
      </div>
    </div>
  );
}
