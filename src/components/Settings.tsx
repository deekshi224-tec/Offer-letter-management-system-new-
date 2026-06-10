/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building, 
  User, 
  Bell, 
  ShieldAlert, 
  Save, 
  Trash2, 
  FileCode,
  HardDrive
} from 'lucide-react';
import { CompanySettings, SystemSettings, UserRole } from '../types';

interface SettingsProps {
  companySettings: CompanySettings;
  onSaveCompanySettings: (settings: CompanySettings) => void;
  systemSettings: SystemSettings;
  onSaveSystemSettings: (settings: SystemSettings) => void;
  currentUserRole: UserRole;
  allActivityCount: number;
}

export default function Settings({
  companySettings,
  onSaveCompanySettings,
  systemSettings,
  onSaveSystemSettings,
  currentUserRole,
  allActivityCount
}: SettingsProps) {
  
  // Local state for company details Form
  const [comName, setComName] = useState(companySettings.companyName);
  const [comLogo, setComLogo] = useState(companySettings.companyLogo);
  const [comAddress, setComAddress] = useState(companySettings.address);
  const [comEmail, setComEmail] = useState(companySettings.email);
  const [comPhone, setComPhone] = useState(companySettings.phone);
  const [comWebsite, setComWebsite] = useState(companySettings.website);

  // Local state for system preferences Form
  const [theme, setTheme] = useState(systemSettings.theme);
  const [prefCandidate, setPrefCandidate] = useState(systemSettings.notificationPreferences.newCandidate);
  const [prefOfferSent, setPrefOfferSent] = useState(systemSettings.notificationPreferences.offerSent);
  const [prefOfferApproved, setPrefOfferApproved] = useState(systemSettings.notificationPreferences.offerApproved);
  const [prefOfferRejected, setPrefOfferRejected] = useState(systemSettings.notificationPreferences.offerRejected);
  const [prefTemplate, setPrefTemplate] = useState(systemSettings.notificationPreferences.templateUpdated);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole !== 'HR Admin') {
      alert('Security violation: Only HR Administrators hold permission locks to alter Corporate Profiles.');
      return;
    }
    onSaveCompanySettings({
      companyName: comName,
      companyLogo: comLogo,
      address: comAddress,
      email: comEmail,
      phone: comPhone,
      website: comWebsite
    });
    alert('Corporate settings written to persistent local storage context successfully!');
  };

  const handleSaveGeneral = () => {
    onSaveSystemSettings({
      theme,
      notificationPreferences: {
        newCandidate: prefCandidate,
        offerSent: prefOfferSent,
        offerApproved: prefOfferApproved,
        offerRejected: prefOfferRejected,
        templateUpdated: prefTemplate
      }
    });
    alert('System settings and preferences synchronized!');
  };

  const handleNukeData = () => {
    if (confirm('WARM NOTICE: This will flush your local session database (candidates, offer edits, alerts) and re-seed defaults. Proceed?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div id="settings_panel" className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto text-slate-100 font-sans selection:bg-violet-650 selection:text-white pb-16">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 font-sans">
            <SettingsIcon className="text-violet-400 w-8 h-8" />
            System & Org Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">Configure company profiles, notification tickers, and manage offline data layers.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Organization & Company Profile forms */}
        <div className="md:col-span-7 bg-[#0f0f12] border border-slate-800 p-6 rounded-2xl shadow-lg space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-sans">
            <Building className="w-5 h-5 text-violet-400" />
            Organization Profile
          </h3>

          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs font-sans text-left">
            {currentUserRole !== 'HR Admin' && (
              <div className="p-3 bg-[#0a0a0c] border border-slate-850 rounded-xl text-slate-400">
                🔒 Note: Current role is <strong className="text-violet-300">{currentUserRole}</strong>. Changing org settings requires HR Admin credentials.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1.5 focus:text-violet-400">Company Legal Name</label>
                <input
                  id="settings_company_name"
                  type="text"
                  disabled={currentUserRole !== 'HR Admin'}
                  value={comName}
                  onChange={(e) => setComName(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-200 disabled:opacity-50 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1.5 focus:text-violet-400">Company Acronym / Initials</label>
                <input
                  id="settings_company_logo"
                  type="text"
                  disabled={currentUserRole !== 'HR Admin'}
                  value={comLogo}
                  onChange={(e) => setComLogo(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-200 disabled:opacity-50 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1.5 focus:text-violet-400">Corporate Headquarters Address</label>
              <textarea
                id="settings_company_address"
                disabled={currentUserRole !== 'HR Admin'}
                rows={2}
                value={comAddress}
                onChange={(e) => setComAddress(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-200 disabled:opacity-50 font-mono focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-550 mb-1.5">Official Support Email</label>
                <input
                  id="settings_company_email"
                  type="email"
                  disabled={currentUserRole !== 'HR Admin'}
                  value={comEmail}
                  onChange={(e) => setComEmail(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2 text-slate-200 disabled:opacity-50 focus:outline-none focus:border-violet-500 transition-all font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-550 mb-1.5">Corporate Helpline</label>
                <input
                  id="settings_company_phone"
                  type="text"
                  disabled={currentUserRole !== 'HR Admin'}
                  value={comPhone}
                  onChange={(e) => setComPhone(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2 text-slate-200 disabled:opacity-50 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-550 mb-1.5">Web Portal Link</label>
                <input
                  id="settings_company_website"
                  type="text"
                  disabled={currentUserRole !== 'HR Admin'}
                  value={comWebsite}
                  onChange={(e) => setComWebsite(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2 text-slate-200 disabled:opacity-50 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>
            </div>

            {currentUserRole === 'HR Admin' && (
              <button
                id="settings_company_submit"
                type="submit"
                className="py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                Commit Corporate Profile Changes
              </button>
            )}

          </form>

        </div>

        {/* Right column: System configurations, Preferences, Database diagnostics */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Item 1: Preferences */}
          <div className="bg-[#0f0f12] border border-slate-800 p-6 rounded-2xl shadow-md space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-sans">
              <Bell className="w-5 h-5 text-violet-400" />
              Real-time Preferences
            </h3>

            <div className="space-y-4 text-xs font-sans text-left">
              <div>
                <label className="block text-slate-500 mb-1.5">Visual Scheme Mode</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'Dark' | 'Light')}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-350 cursor-pointer focus:outline-none focus:border-violet-500 transition-symmetric"
                >
                  <option value="Dark" className="bg-[#0f0f12]">🌌 Cosmic Dark Scheme (Recommended)</option>
                  <option value="Light" className="bg-[#0f0f12]">☀️ Clean Light Scheme</option>
                </select>
              </div>

              <div className="space-y-2 border-t border-slate-800/80 pt-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono mb-2">Workspace Alert Triggers</span>
                
                <div className="flex justify-between items-center bg-[#0a0a0c] p-2.5 rounded-xl border border-slate-900">
                  <span className="text-slate-300">Prompt alerts on Candidate Signups</span>
                  <input
                    type="checkbox"
                    checked={prefCandidate}
                    onChange={(e) => setPrefCandidate(e.target.checked)}
                    className="h-4 w-4 bg-[#0a0a0c] border border-slate-800 text-violet-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center bg-[#0a0a0c] p-2.5 rounded-xl border border-slate-900">
                  <span className="text-slate-300">Offer Transmissions Emails dispatched</span>
                  <input
                    type="checkbox"
                    checked={prefOfferSent}
                    onChange={(e) => setPrefOfferSent(e.target.checked)}
                    className="h-4 w-4 bg-[#0a0a0c] border border-slate-800 text-violet-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center bg-[#0a0a0c] p-2.5 rounded-xl border border-slate-900">
                  <span className="text-slate-300">Approvals of contract layers</span>
                  <input
                    type="checkbox"
                    checked={prefOfferApproved}
                    onChange={(e) => setPrefOfferApproved(e.target.checked)}
                    className="h-4 w-4 bg-[#0a0a0c] border border-slate-800 text-violet-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center bg-[#0a0a0c] p-2.5 rounded-xl border border-slate-900">
                  <span className="text-slate-300">Template updates marketplace sync</span>
                  <input
                    type="checkbox"
                    checked={prefTemplate}
                    onChange={(e) => setPrefTemplate(e.target.checked)}
                    className="h-4 w-4 bg-[#0a0a0c] border border-slate-800 text-violet-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <button
                id="settings_system_submit"
                onClick={handleSaveGeneral}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-505 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
              >
                Sync User Preferences
              </button>
            </div>
          </div>

          {/* Item 2: Database and telemetry diagnostics */}
          <div className="bg-[#0f0f12] border border-slate-800 p-6 rounded-2xl shadow-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-sans">
              <HardDrive className="w-5 h-5 text-violet-400" />
              Runtime System Diagnostics
            </h3>

            <div className="space-y-3.5 text-xs font-mono text-left">
              <div className="flex justify-between text-slate-400">
                <span>Database engine:</span>
                <span className="text-emerald-400 font-bold bg-[#0a0a0c] border border-emerald-900/40 px-2 py-0.5 rounded-xl">Standard SQL Sandbox</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active Templates Status:</span>
                <span className="text-violet-400">Ready & Loaded</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Telemetry Audit Trail Logs:</span>
                <span className="text-slate-200">{allActivityCount}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-left">
                <span>Memory Allocation state:</span>
                <span className="text-slate-350">localStorage stateful map</span>
              </div>

              <button
                onClick={handleNukeData}
                className="w-full py-2.5 text-rose-455 hover:text-rose-400 border border-rose-950/80 bg-[#0a0a0c] hover:bg-rose-950/20 rounded-xl duration-200 text-xs font-bold cursor-pointer"
              >
                🚨 Flush Client Sandbox Session
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
