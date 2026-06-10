/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar,
  Filter,
  UserCheck,
  Building,
  RefreshCw,
  Clock3
} from 'lucide-react';
import { Candidate, OfferLetter, Activitylog, Template } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  offers: OfferLetter[];
  templates: Template[];
  activities: Activitylog[];
  onChangeView: (view: string) => void;
}

export default function Dashboard({
  candidates,
  offers,
  templates,
  activities,
  onChangeView
}: DashboardProps) {
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');

  // Available unique departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach(c => { if(c.department) set.add(c.department); });
    offers.forEach(o => { if(o.department) set.add(o.department); });
    return ['All', ...Array.from(set)];
  }, [candidates, offers]);

  // Filtered lists
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      if (deptFilter !== 'All' && c.department !== deptFilter) return false;
      return true;
    });
  }, [candidates, deptFilter]);

  const filteredOffers = useMemo(() => {
    return offers.filter(o => {
      if (deptFilter !== 'All' && o.department !== deptFilter) return false;
      return true;
    });
  }, [offers, deptFilter]);

  // Calculations
  const stats = useMemo(() => {
    const totalCand = filteredCandidates.length;
    const totalOffers = filteredOffers.length;
    
    const acceptedCount = filteredOffers.filter(o => o.status === 'Accepted').length;
    const rejectedCount = filteredOffers.filter(o => o.status === 'Rejected').length;
    
    const pendingCount = filteredOffers.filter(o => 
      o.status === 'Pending Hiring Manager Approval' || 
      o.status === 'Pending HR Admin Approval'
    ).length;

    const templatesCount = templates.filter(t => {
      if (deptFilter !== 'All') {
        // approximate match or show general
        return t.category.toLowerCase().includes(deptFilter.toLowerCase().slice(0, 4)) || tempCategoryMatch(t.category, deptFilter);
      }
      return true;
    }).length;

    return {
      totalCand,
      totalOffers,
      acceptedCount,
      pendingCount,
      rejectedCount,
      templatesCount
    };
  }, [filteredCandidates, filteredOffers, templates, deptFilter]);

  // Secondary helper
  function tempCategoryMatch(cat: string, dept: string) {
    if (dept === 'Engineering' && cat === 'Technology') return true;
    if (dept === 'Product Design' && cat === 'Startup') return true;
    return false;
  }

  // Monthly breakdown for Area Chart (Jan - May)
  const monthlyData = useMemo(() => {
    // Generate data based on candidate and offer joining dates
    return [
      { name: 'Jan', candidates: 4, offers: 2, accepted: 1 },
      { name: 'Feb', candidates: 7, offers: 3, accepted: 2 },
      { name: 'Mar', candidates: 5, offers: 4, accepted: 3 },
      { name: 'Apr', candidates: 9, offers: 6, accepted: 4 },
      { name: 'May', candidates: 12, offers: 8, accepted: 5 },
      { name: 'Jun', candidates: filteredCandidates.length, offers: filteredOffers.length, accepted: stats.acceptedCount }
    ];
  }, [filteredCandidates, filteredOffers, stats]);

  // Pie chart calculation angles
  const pieData = useMemo(() => {
    const total = stats.acceptedCount + stats.pendingCount + stats.rejectedCount + 1; // avoidance of 0
    return {
      acceptedPct: Math.round((stats.acceptedCount / total) * 100),
      pendingPct: Math.round((stats.pendingCount / total) * 100),
      rejectedPct: Math.round((stats.rejectedCount / total) * 100)
    };
  }, [stats]);

  return (
    <div id="dashboard_panel" className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-200 font-sans selection:bg-violet-650 selection:text-white">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="text-violet-400 w-8 h-8" />
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">Real-time telemetry, offer tracking audits, and pipeline health analytics.</p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0f0f12] border border-slate-800 rounded-xl px-3 py-1.5">
            <Building className="w-4 h-4 text-violet-400" />
            <select
              id="dashboard_department_filter"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-[#0f0f12] text-slate-300">{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#0f0f12] border border-slate-800 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-violet-400" />
            <select
              id="dashboard_time_filter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0f0f12]">All Time History</option>
              <option value="30D" className="bg-[#0f0f12]">Last 30 Days</option>
              <option value="90D" className="bg-[#0f0f12]">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Candidates */}
        <div id="kpi_candidates_card" className="bg-gradient-to-br from-violet-900/20 to-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-violet-500/40 transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Candidates</span>
            <span className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg"><Users className="w-4 h-4" /></span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{stats.totalCand}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono">+12%</span>
          </div>
          <span className="text-[10.5px] text-slate-500 mt-2 block border-t border-slate-800/60 pt-2 font-light">Applicant Pool</span>
        </div>

        {/* Total Offers Sent */}
        <div id="kpi_offers_card" className="bg-gradient-to-br from-violet-900/20 to-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-violet-500/40 transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Offers Compiled</span>
            <span className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg"><FileText className="w-4 h-4" /></span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{stats.totalOffers}</span>
            <span className="text-[10px] text-violet-400 bg-violet-950/40 px-1.5 py-0.5 rounded font-mono">Sent out</span>
          </div>
          <span className="text-[10.5px] text-slate-505 mt-2 block border-t border-slate-800/60 pt-2 font-light">Drafted + Issued</span>
        </div>

        {/* Accepted Offers */}
        <div id="kpi_accepted_card" className="bg-gradient-to-br from-emerald-900/20 to-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-emerald-500/40 transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Accepted Offers</span>
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle className="w-4 h-4" /></span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">{stats.acceptedCount}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono">Success</span>
          </div>
          <span className="text-[10.5px] text-slate-500 mt-2 block border-t border-slate-800/60 pt-2 font-light">Signed contracts</span>
        </div>

        {/* Pending Approvals */}
        <div id="kpi_pending_card" className="bg-gradient-to-br from-amber-900/20 to-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-amber-500/40 transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Pending Actions</span>
            <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">{stats.pendingCount}</span>
            <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded font-mono">Review</span>
          </div>
          <span className="text-[10.5px] text-slate-500 mt-2 block border-t border-slate-800/60 pt-2 font-light">Awaiting signoff</span>
        </div>

        {/* Rejected Offers */}
        <div id="kpi_rejected_card" className="bg-gradient-to-br from-rose-900/20 to-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-rose-500/40 transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Rejected Offers</span>
            <span className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg"><XCircle className="w-4 h-4" /></span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-400">{stats.rejectedCount}</span>
            <span className="text-[10px] text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded font-mono">Declined</span>
          </div>
          <span className="text-[10.5px] text-slate-500 mt-2 block border-t border-slate-800/60 pt-2 font-light">Turned down</span>
        </div>

        {/* Templates Count */}
        <div id="kpi_templates_card" className="bg-[#0f0f12] border border-slate-805 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-violet-500/40 transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Templates Marketplace</span>
            <span className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg"><BookOpen className="w-4 h-4" /></span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-205">{stats.templatesCount}</span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">Styles</span>
          </div>
          <span className="text-[10.5px] text-slate-500 mt-2 block border-t border-slate-800/60 pt-2 font-light">A4 Format presets</span>
        </div>
      </div>

      {/* Main Charts & Pipelines Area */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Side: Monthly Hiring Analytics & Candidate Funnel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Line Area Chart: Monthly Hiring Trends */}
          <div className="bg-[#0f0f12] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                  Monthly Hiring Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Applicant generation and offer issuance pace tracking.</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400"><span className="h-2 w-2 rounded-full bg-violet-500" /> Candidates</span>
                <span className="flex items-center gap-1.5 text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Offers</span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="h-64 relative w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis lines */}
                <line x1="0" y1="180" x2="500" y2="180" stroke="#1e293b" strokeWidth="1" />
                <line x1="0" y1="135" x2="500" y2="135" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="45" x2="500" y2="45" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="10" x2="500" y2="10" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

                {/* Grid values */}
                <text x="502" y="184" fill="#64748b" className="text-[9px] font-mono">0</text>
                <text x="502" y="139" fill="#64748b" className="text-[9px] font-mono">5</text>
                <text x="502" y="94" fill="#64748b" className="text-[9px] font-mono">10</text>
                <text x="502" y="49" fill="#64748b" className="text-[9px] font-mono">15</text>

                {/* Data series 1 Area & Line: Candidates (Scale 0 to 15, max y value 180 corresponds to 0, 10 corresponds to 180 - (val/15 * 170) ) */}
                {/* Jan: 4, Feb: 7, Mar: 5, Apr: 9, May: 12, Jun: stat */}
                <path
                  d={`M 0 ${180 - (4/15)*170} 
                     L 100 ${180 - (7/15)*170} 
                     L 200 ${180 - (5/15)*170} 
                     L 300 ${180 - (9/15)*170} 
                     L 400 ${180 - (12/15)*170} 
                     L 500 ${180 - (Math.min(15, stats.totalCand)/15)*170} 
                     L 500 180 L 0 180 Z`}
                  fill="url(#violetGrad)"
                />
                
                <path
                  d={`M 0 ${180 - (4/15)*170} 
                     L 100 ${180 - (7/15)*170} 
                     L 200 ${180 - (5/15)*170} 
                     L 300 ${180 - (9/15)*170} 
                     L 400 ${180 - (12/15)*170} 
                     L 500 ${180 - (Math.min(15, stats.totalCand)/15)*170}`}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                />

                {/* Data series 2 Area & Line: Generated Offers */}
                {/* Jan: 2, Feb: 3, Mar: 4, Apr: 6, May: 8, Jun: stat */}
                <path
                  d={`M 0 ${180 - (2/15)*170} 
                     L 100 ${180 - (3/15)*170} 
                     L 200 ${180 - (4/15)*170} 
                     L 300 ${180 - (6/15)*170} 
                     L 400 ${180 - (8/15)*170} 
                     L 500 ${180 - (Math.min(15, stats.totalOffers)/15)*170} 
                     L 500 180 L 0 180 Z`}
                  fill="url(#emeraldGrad)"
                />

                <path
                  d={`M 0 ${180 - (2/15)*170} 
                     L 100 ${180 - (3/15)*170} 
                     L 200 ${180 - (4/15)*170} 
                     L 300 ${180 - (6/15)*170} 
                     L 400 ${180 - (8/15)*170} 
                     L 500 ${180 - (Math.min(15, stats.totalOffers)/15)*170}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Data dots on the endpoints */}
                <circle cx="500" cy={180 - (Math.min(15, stats.totalCand)/15)*170} r="4" fill="#7c3aed" stroke="#ffffff" strokeWidth="1" />
                <circle cx="500" cy={180 - (Math.min(15, stats.totalOffers)/15)*170} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              </svg>

              {/* Month Markers Bottom Axis */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span className="font-bold text-violet-400">Jun (Now)</span>
              </div>
            </div>
          </div>

          {/* Panel: Candidate Funnel Pipeline Tracker */}
          <div className="bg-[#0f0f12] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <UserCheck className="w-4.5 h-4.5 text-violet-400" />
              Corporate Candidate Pipeline
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-light">Conversion analytics from applied to formal contract signing.</p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { name: 'Applied', color: 'bg-violet-500', count: filteredCandidates.filter(c => c.status === 'Applied').length },
                { name: 'Reviewing', color: 'bg-violet-500/80', count: filteredCandidates.filter(c => c.status === 'Reviewing').length },
                { name: 'Interviewing', color: 'bg-cyan-500', count: filteredCandidates.filter(c => c.status === 'Interviewing').length },
                { name: 'Offered', color: 'bg-amber-500', count: filteredCandidates.filter(c => c.status === 'Offered').length },
                { name: 'Accepted', color: 'bg-emerald-500', count: filteredCandidates.filter(c => c.status === 'Accepted').length }
              ].map((stage, i) => {
                const percentage = filteredCandidates.length > 0 
                  ? Math.round((stage.count / filteredCandidates.length) * 100) 
                  : 0;

                return (
                  <div key={stage.name} className="bg-[#0a0a0c] border border-slate-800/80 p-3.5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Step 0{i+1}</span>
                        <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                      </div>
                      <span className="text-xs font-bold text-slate-200 block truncate">{stage.name}</span>
                    </div>

                    <div className="mt-4">
                      <span className="text-xl font-black text-white">{stage.count}</span>
                      <span className="text-[10px] text-slate-500 ml-1">candidates</span>
                      
                      {/* Percent Fill bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full ${stage.color} rounded-full`} style={{ width: `${Math.max(5, percentage)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Offer Status (Donut) & Recent Activity Timeline */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Donut Chart: Offer Status Distribution */}
          <div className="bg-[#0f0f12] border border-slate-800/80 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-violet-400" />
                Offer Letters Distribution
              </h3>
              <p className="text-xs text-slate-400 mb-6">Approval states of currently tracked offers.</p>
            </div>

            {/* SVG Donut */}
            <div className="relative flex justify-center items-center py-4">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="14"
                />
                
                {/* SVG Stroke dasharray calculation for glowing parts: perimeter is 2 * pi * 60 = 377 */}
                {/* Segment 1: Accepted (Percent out of total) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray={`${(pieData.acceptedPct / 100) * 377} 377`}
                />

                {/* Segment 2: Pending */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray={`${(pieData.pendingPct / 100) * 377} 377`}
                  strokeDashoffset={`-${(pieData.acceptedPct / 100) * 377}`}
                />

                {/* Segment 3: Rejected */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="14"
                  strokeDasharray={`${(pieData.rejectedPct / 100) * 377} 377`}
                  strokeDashoffset={`-${((pieData.acceptedPct + pieData.pendingPct) / 100) * 377}`}
                />
              </svg>

              {/* Absolute center label */}
              <div className="absolute text-center">
                <span className="text-2xl font-extrabold text-white">{stats.totalOffers}</span>
                <span className="text-[10px] text-slate-505 block uppercase font-mono tracking-widest mt-0.5">Letters</span>
              </div>
            </div>

            {/* Legend mapping */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-2"><span className="h-3 w-3 bg-emerald-500 rounded" /> Signed & Accepted</span>
                <span className="font-semibold text-white">{stats.acceptedCount} ({pieData.acceptedPct}%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-2"><span className="h-3 w-3 bg-amber-500 rounded" /> Waiting Approval</span>
                <span className="font-semibold text-white">{stats.pendingCount} ({pieData.pendingPct}%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-2"><span className="h-3 w-3 bg-rose-500 rounded" /> Declined / Changes</span>
                <span className="font-semibold text-white">{stats.rejectedCount} ({pieData.rejectedPct}%)</span>
              </div>
            </div>
          </div>

          {/* Audit Logs / Activity logs */}
          <div className="bg-[#0f0f12] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              Hiring Activity Logs
            </h3>
            
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-center text-xs text-slate-505 py-6">No workspace logged events yet.</p>
              ) : (
                activities.slice(0, 5).map((act, idx) => (
                  <div key={act.id || idx} className="flex gap-3 text-xs leading-relaxed group">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-[#0a0a0c] group-hover:bg-violet-905 border border-slate-800 flex items-center justify-center font-bold text-violet-400 text-[10px] transition font-mono">
                        {idx + 1}
                      </div>
                      {idx < 4 && <div className="w-0.5 grow bg-slate-800 mt-1" />}
                    </div>
                    <div className="grow pb-1">
                      <div className="flex justify-between text-slate-400 text-[10px] uppercase font-mono">
                        <span>{act.user} ({act.role})</span>
                        <span>{act.timestamp.split(' ')[1] || 'Today'}</span>
                      </div>
                      <p className="text-slate-205 mt-1">
                        <strong className="text-violet-400 font-medium">{act.action}</strong> step for {act.target}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              id="dashboard_activities_view_btn"
              onClick={() => onChangeView('settings')}
              className="w-full text-center text-xs text-violet-400 hover:text-violet-300 transition-colors font-semibold mt-4 block border-t border-slate-800/80 pt-3 cursor-pointer"
            >
              Verify Active Audit Trails →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
