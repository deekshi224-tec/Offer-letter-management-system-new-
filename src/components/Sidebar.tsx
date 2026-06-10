/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  ShieldAlert, 
  Briefcase,
  Layers,
  User as UserIcon,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { User, UserRole } from '../types';
import { SEED_USERS } from '../mockData';

interface SidebarProps {
  currentUser: User;
  onSetCurrentUser: (user: User) => void;
  activeView: string;
  onChangeView: (view: string) => void;
  onLogout: () => void;
  notificationCount: number;
}

export default function Sidebar({
  currentUser,
  onSetCurrentUser,
  activeView,
  onChangeView,
  onLogout,
  notificationCount
}: SidebarProps) {
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value as UserRole;
    const match = SEED_USERS.find(u => u.role === selectedRole);
    if (match) {
      onSetCurrentUser(match);
    }
  };

  // Helper is role allowed view
  const isAllowed = (roles: UserRole[]) => {
    return roles.includes(currentUser.role);
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Analytics Dashboard',
      icon: LayoutDashboard,
      roles: ['HR Admin', 'Recruiter', 'Hiring Manager'] as UserRole[],
    },
    {
      id: 'candidates',
      label: 'Candidate Manager',
      icon: Users,
      roles: ['HR Admin', 'Recruiter', 'Hiring Manager'] as UserRole[],
    },
    {
      id: 'marketplace',
      label: 'Template Marketplace',
      icon: BookOpen,
      roles: ['HR Admin', 'Recruiter', 'Hiring Manager'] as UserRole[],
    },
    {
      id: 'offers',
      label: 'Offer Letters List',
      icon: Layers,
      roles: ['HR Admin', 'Recruiter', 'Hiring Manager', 'Employee'] as UserRole[],
    },
    {
      id: 'generator',
      label: 'Offer Generator & PDF',
      icon: FileText,
      roles: ['HR Admin', 'Recruiter'] as UserRole[], // Recruiter & admin create letters
    },
    {
      id: 'template-editor',
      label: 'Canva Template Editor',
      icon: Briefcase,
      roles: ['HR Admin', 'Recruiter'] as UserRole[],
    },
    {
      id: 'settings',
      label: 'System & Org Settings',
      icon: Settings,
      roles: ['HR Admin', 'Recruiter', 'Hiring Manager', 'Employee'] as UserRole[],
    }
  ];

  return (
    <div id="app_sidebar" className="w-64 bg-[#0f0f12] border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 selection:bg-violet-600 text-slate-200 no-print">
      
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
              O
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight block">OLMS</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">v1.1 Sandbox</span>
            </div>
          </div>
        </div>

        {/* Identity Simulator Box */}
        <div className="p-4 mx-3 my-4 bg-[#0a0a0c]/80 rounded-xl border border-slate-800/80 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-violet-400" />
              Role Simulator
            </span>
            <span className="text-[9px] bg-violet-950/40 text-violet-300 px-1.5 py-0.5 rounded font-mono">
              Live Testing
            </span>
          </div>

          <label className="block text-[11px] text-slate-500 mb-1">Toggle Current Session:</label>
          <select 
            id="sidebar_role_select"
            value={currentUser.role}
            onChange={handleRoleChange}
            className="w-full text-xs bg-[#0f0f12] border border-slate-800 rounded px-2.5 py-1.5 text-violet-300 focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="HR Admin">🔑 Sarah (HR Admin)</option>
            <option value="Recruiter">💼 Michael (Recruiter)</option>
            <option value="Hiring Manager">🎯 David (Hiring Manager)</option>
            <option value="Employee">👤 John Doe (Employee/Cand)</option>
          </select>

          <div className="mt-3 flex items-center gap-2">
            <img 
              id="user_avatar_img"
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'} 
              className="h-8 w-8 rounded-full border border-slate-800 object-cover" 
              alt="Avatar"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-white block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-405 block font-mono bg-violet-950/20 px-1 py-0.4 rounded truncate max-w-[130px]">{currentUser.role}</span>
            </div>
          </div>
        </div>

        {/* Modules Switcher */}
        <nav className="px-3 space-y-1">
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Navigation</span>
          
          {navItems.map((item) => {
            const allowed = isAllowed(item.roles);
            if (!allowed) return null;

            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                id={`sidebar_nav_${item.id}`}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive 
                    ? 'bg-violet-600/10 text-violet-400 border-l-2 border-violet-500' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'offers' && notificationCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform opacity-0 group-hover:opacity-100 ${isActive ? 'text-violet-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          id="sidebar_notifications_trigger"
          onClick={() => onChangeView('notifications-panel')}
          className={`w-full flex items-center justify-between py-2 px-3 text-xs md:text-xs rounded-xl transition-colors cursor-pointer ${
            activeView === 'notifications-panel' ? 'bg-violet-600/10 text-violet-400' : 'hover:bg-slate-800/50 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" />
            <span>Alert Logs</span>
          </div>
          {notificationCount > 0 && (
            <span id="sidebar_notif_span" className="h-2 w-2 rounded-full bg-violet-500" />
          )}
        </button>

        <button
          id="sidebar_logout_btn"
          onClick={onLogout}
          className="w-full flex items-center gap-2 text-left py-2 px-3 text-xs rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Workspace</span>
        </button>
      </div>
    </div>
  );
}
