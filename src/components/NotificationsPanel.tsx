/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Bell, Check, Trash2, Mail, Users, FileCheck, Layers, AlertCircle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onClearAll
}: NotificationsPanelProps) {
  
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  const displayed = notifications.filter(n => {
    if (filter === 'Unread') return !n.isRead;
    return true;
  });

  return (
    <div id="notifications_center_panel" className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto text-slate-100 font-sans selection:bg-violet-650 selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Bell className="text-violet-400 w-8 h-8" />
            Alert Logger
          </h1>
          <p className="text-sm text-slate-400 mt-1"> Chronological telemetry logs tracking letters, approvals, and candidates.</p>
        </div>

        <div className="flex gap-2">
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={onClearAll}
              className="py-2 px-3 border border-slate-800 hover:bg-slate-800 text-xs text-rose-400 hover:text-rose-350 rounded-xl font-semibold transition cursor-pointer"
            >
              Clear Logs
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#0f0f12] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        
        {/* Filter bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0a0a0c]/40 flex justify-between items-center text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('All')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${filter === 'All' ? 'bg-violet-600 hover:bg-violet-550 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('Unread')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${filter === 'Unread' ? 'bg-violet-600 hover:bg-violet-550 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Unread Realtime ({notifications.filter(n => !n.isRead).length})
            </button>
          </div>
          
          <span className="text-[10px] font-mono text-slate-500 uppercase">Live Socket Connection Ready</span>
        </div>

        {/* Content list */}
        {displayed.length === 0 ? (
          <div className="p-16 text-center text-slate-505 text-sm">
            No notification logs found. All systems operational.
          </div>
        ) : (
          <div className="divide-y divide-slate-850/65">
            {displayed.map((notif) => (
              <div 
                key={notif.id}
                id={`notif_row_${notif.id}`} 
                className={`p-4 flex gap-4 transition-colors hover:bg-[#0a0a0c]/40 ${!notif.isRead ? 'bg-violet-950/10' : ''}`}
              >
                
                {/* Category Icon */}
                <div className={`p-2 h-9 w-9 rounded-lg flex items-center justify-center border shrink-0 ${
                  notif.category === 'Candidate' ? 'bg-cyan-950/45 text-cyan-400 border-cyan-800/40' :
                  notif.category === 'Offer' ? 'bg-emerald-950/45 text-emerald-400 border-emerald-800/40' :
                  notif.category === 'Template' ? 'bg-amber-950/40 text-amber-400 border-amber-800/40' :
                  'bg-slate-900 text-slate-400 border-slate-850'
                }`}>
                  {notif.category === 'Candidate' && <Users className="w-4 h-4" />}
                  {notif.category === 'Offer' && <FileCheck className="w-4 h-4" />}
                  {notif.category === 'Template' && <Layers className="w-4 h-4" />}
                  {notif.category === 'General' && <AlertCircle className="w-4 h-4" />}
                </div>

                {/* Text Details */}
                <div className="grow space-y-1 text-left">
                  <div className="flex justify-between items-baseline">
                    <h4 className={`text-sm font-extrabold ${!notif.isRead ? 'text-white' : 'text-slate-200'}`}>{notif.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{notif.timestamp.split('T')[0] || 'Today'}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                </div>

                {/* Mark as read */}
                {!notif.isRead && (
                  <button
                    id={`notif_read_btn_${notif.id}`}
                    onClick={() => onMarkAsRead(notif.id)}
                    className="p-1 px-2 border border-slate-800 bg-[#0a0a0c] hover:bg-slate-800 text-[10px] text-violet-400 hover:text-violet-300 rounded-lg h-fit self-center transition cursor-pointer"
                  >
                    Mark read
                  </button>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
