/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User as UserIcon, RefreshCw, Briefcase, Eye, EyeOff } from 'lucide-react';
import { User, UserRole } from '../types';
import { SEED_USERS } from '../mockData';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Recruiter');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (activeTab === 'login') {
        // Authenticate with seeded users or dynamically log in
        const matched = SEED_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() || (email === 'admin' && u.role === 'HR Admin')
        );
        if (matched) {
          onLoginSuccess(matched);
        } else if (email && password.length >= 4) {
          // Fallback allow any log in
          onLoginSuccess({
            id: 'dyn_user_' + Date.now(),
            name: email.split('@')[0].toUpperCase(),
            email: email,
            role: 'HR Admin'
          });
        } else {
          setError('Invalid credentials. Use one of our Quick-Bypass profiles below to explore instantly!');
        }
      } else if (activeTab === 'signup') {
        if (!name || !email || !password) {
          setError('Please fill in all standard sign up fields.');
          return;
        }
        setSuccessMsg('Registration submitted! Swapping to login.');
        setTimeout(() => {
          setActiveTab('login');
          setEmail(email);
        }, 1200);
      } else if (activeTab === 'forgot') {
        if (!email) {
          setError('Please supply your registered HR email address.');
          return;
        }
        setSuccessMsg('Reset code sent! Check your security secondary mail.');
      }
    }, 600);
  };

  const handleQuickBypass = (selectedRole: UserRole) => {
    const user = SEED_USERS.find((u) => u.role === selectedRole);
    if (user) {
      onLoginSuccess(user);
    }
  };

  return (
    <div id="auth_container" className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-violet-500 selection:text-white font-sans text-slate-100">
      {/* Background Ambience Deco */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.08),transparent_40%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(14,165,233,0.08),transparent_40%)] pointer-events-none" />

      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-12 relative z-10">
        
        {/* Left Panel: SaaS Welcome Messaging */}
        <div className="md:col-span-5 bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 p-8 flex flex-col justify-between border-r border-[#1f1f23]">
          <div>
            <div className="flex items-center gap-2 text-violet-400 mb-8">
              <ShieldCheck className="w-8 h-8 text-violet-400" />
              <span className="font-bold tracking-tight text-xl text-white">OLMS</span>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-white mb-4">Enterprise Offer & Candidate Solutions</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Empowering human resources, hiring managers, and recruiters with live template designers, stateful approvals, robust PDF formatting, and candidate management.
            </p>

            <div className="space-y-4 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <span className="p-1 rounded bg-[#0a0a0c] text-violet-400">✔</span>
                <span>Generate perfect A4 PDF offers matching company brand designs</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="p-1 rounded bg-[#0a0a0c] text-violet-400">✔</span>
                <span>Active 4-tier approval timelines with custom review parameters</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="p-1 rounded bg-[#0a0a0c] text-violet-400">✔</span>
                <span>Access a library of 38 pre-configured templates</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/40 text-left">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block">Environment Mode</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active System Demonstration
            </span>
          </div>
        </div>

        {/* Right Panel: Content Form */}
        <div className="md:col-span-7 p-8 md:p-12 bg-slate-900 flex flex-col justify-center">
          
          {/* Header Switchers */}
          {activeTab !== 'forgot' && (
            <div className="flex border-b border-slate-800 mb-6">
              <button 
                id="tab_login_btn"
                onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
                className={`pb-3 pr-6 text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === 'login' ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Sign In
                {activeTab === 'login' && <span className="absolute bottom-0 left-0 right-6 h-0.5 bg-violet-500 rounded-full" />}
              </button>
              <button 
                id="tab_signup_btn"
                onClick={() => { setActiveTab('signup'); setError(''); setSuccessMsg(''); }}
                className={`pb-3 pr-6 text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === 'signup' ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Register Organization
                {activeTab === 'signup' && <span className="absolute bottom-0 left-0 right-6 h-0.5 bg-violet-500 rounded-full" />}
              </button>
            </div>
          )}

          {activeTab === 'forgot' && (
            <div className="mb-6 text-left">
              <button 
                onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
              >
                ← Back to Login Credentials
              </button>
              <h3 className="text-xl font-bold text-white mt-3">Reset Security Password</h3>
              <p className="text-xs text-slate-400 mt-1">We will send you a transient link to overwrite your current credentials.</p>
            </div>
          )}

          {/* Form Element */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-950/80 border border-red-900/80 text-xs text-red-200 rounded-lg text-left">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-990/80 text-xs text-emerald-200 rounded-lg text-left">
                {successMsg}
              </div>
            )}

            {/* Fields */}
            {activeTab === 'signup' && (
              <div className="text-left">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input 
                    id="auth_name_input"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-805 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="text-left">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Organization Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input 
                  id="auth_email_input"
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.jenkins@nexuhr.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-805 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {activeTab !== 'forgot' && (
              <div className="text-left">
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  {activeTab === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-xs text-violet-400 hover:text-violet-300 cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input 
                    id="auth_pass_input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={activeTab !== 'forgot'}
                    className="w-full pl-9 pr-10 py-2 text-sm bg-slate-950 border border-slate-805 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="text-left">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Assigned Target Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <select 
                    id="auth_role_select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-805 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors appearance-none text-left"
                  >
                    <option value="HR Admin">HR Admin ( sarah.jenkins@olms.com )</option>
                    <option value="Recruiter">Recruiter ( michael.chang@olms.com )</option>
                    <option value="Hiring Manager">Hiring Manager ( david.vance@olms.com )</option>
                    <option value="Employee">Employee ( john.doe@gmail.com )</option>
                  </select>
                </div>
              </div>
            )}

            <button
              id="auth_submit_btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-850 text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Security Handshake...
                </>
              ) : activeTab === 'login' ? (
                'Verify Account & Sign In'
              ) : activeTab === 'signup' ? (
                'Create Organization & Onboard'
              ) : (
                'Send Code'
              )}
            </button>
          </form>

          {/* Rapid Access Switcher */}
          <div className="mt-8 pt-8 border-t border-[#1f1f23]">
            <h4 id="identity_swapper_title" className="text-[10px] uppercase font-bold tracking-widest text-violet-400 mb-3 text-center">
              DEMONSTRATION QUICK-BYPASS ROLES
            </h4>
            <p className="text-center text-[10px] text-slate-500 mb-4">
              OLMS dynamically customizes available headers, actions, filters, & logs depending on the verified participant. Swap identity profiles instantly:
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                id="bypass_admin"
                type="button"
                onClick={() => handleQuickBypass('HR Admin')}
                className="p-2 bg-slate-950/60 hover:bg-violet-950/50 hover:border-violet-900 border border-slate-800/80 rounded-lg transition text-left cursor-pointer flex flex-col justify-between"
              >
                <span className="text-[11px] font-bold text-white block">Sarah Jenkins</span>
                <span className="text-[10px] font-mono text-violet-400">HR Admin (Full Control)</span>
              </button>
              
              <button
                id="bypass_recruiter"
                type="button"
                onClick={() => handleQuickBypass('Recruiter')}
                className="p-2 bg-[#0a0a0c]/60 hover:bg-slate-800/60 hover:border-violet-900 border border-slate-800/80 rounded-lg transition text-left cursor-pointer flex flex-col justify-between"
              >
                <span className="text-[11px] font-bold text-white block">Michael Chang</span>
                <span className="text-[10px] font-mono text-emerald-400">Recruiter (Creates Letters)</span>
              </button>
              
              <button
                id="bypass_manager"
                type="button"
                onClick={() => handleQuickBypass('Hiring Manager')}
                className="p-2 bg-[#0a0a0c]/60 hover:bg-slate-800/60 hover:border-violet-900 border border-slate-800/80 rounded-lg transition text-left cursor-pointer flex flex-col justify-between"
              >
                <span className="text-[11px] font-bold text-white block">David Vance</span>
                <span className="text-[10px] font-mono text-cyan-400">Hiring Manager (Approves)</span>
              </button>
              
              <button
                id="bypass_employee"
                type="button"
                onClick={() => handleQuickBypass('Employee')}
                className="p-2 bg-[#0a0a0c]/60 hover:bg-slate-800/60 hover:border-violet-900 border border-slate-800/80 rounded-lg transition text-left cursor-pointer flex flex-col justify-between"
              >
                <span className="text-[11px] font-bold text-white block">John Doe</span>
                <span className="text-[10px] font-mono text-pink-400">Employee (Accepts/Signs)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
