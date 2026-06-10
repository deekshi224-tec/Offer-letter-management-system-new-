/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  Download, 
  UserPlus, 
  ExternalLink,
  ChevronRight,
  Mail,
  Phone,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  CreditCard,
  FileCheck,
  XCircle,
  Eye,
  Users
} from 'lucide-react';
import { Candidate, CandidateStatus, UserRole } from '../types';

interface CandidateManagementProps {
  candidates: Candidate[];
  onAddCandidate: (candidate: Omit<Candidate, 'id' | 'createdDate'>) => void;
  onUpdateCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
  currentUserRole: UserRole;
  onDraftLetterFromCandidate: (candidate: Candidate) => void;
}

export default function CandidateManagement({
  candidates,
  onAddCandidate,
  onUpdateCandidate,
  onDeleteCandidate,
  currentUserRole,
  onDraftLetterFromCandidate
}: CandidateManagementProps) {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  
  // UI States
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<Candidate | null>(null);

  // Form Fields State (Used for both add and edit)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [experience, setExperience] = useState<number>(3);
  const [expectedSalary, setExpectedSalary] = useState('');
  const [status, setStatus] = useState<CandidateStatus>('Applied');
  const [resumeName, setResumeName] = useState('My_Resume_CV_Doc.pdf');

  // Load fields for editing
  const handleOpenEdit = (cand: Candidate) => {
    setShowEditForm(cand);
    setName(cand.name);
    setEmail(cand.email);
    setPhone(cand.phone);
    setPosition(cand.position);
    setDepartment(cand.department);
    setExperience(cand.experience);
    setExpectedSalary(cand.expectedSalary);
    setStatus(cand.status);
    setResumeName(cand.resume || 'My_Resume_CV_Doc.pdf');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onAddCandidate({
      name,
      email,
      phone,
      position,
      department,
      experience,
      expectedSalary,
      status,
      resume: resumeName
    });
    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setPosition('');
    setDepartment('Engineering');
    setExperience(4);
    setExpectedSalary('');
    setStatus('Applied');
    setResumeName('My_Resume_CV_Doc.pdf');
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditForm || !name || !email) return;
    onUpdateCandidate({
      ...showEditForm,
      name,
      email,
      phone,
      position,
      department,
      experience,
      expectedSalary,
      status,
      resume: resumeName
    });
    setShowEditForm(null);
  };

  // Extract unique departments
  const departments = useMemo(() => {
    const d = new Set<string>();
    candidates.forEach(c => { if(c.department) d.add(c.department); });
    return ['All', ...Array.from(d)];
  }, [candidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' ? true : c.status === statusFilter;
      const matchesDept = deptFilter === 'All' ? true : c.department === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [candidates, searchTerm, statusFilter, deptFilter]);

  // Read-only permission guard
  const canModify = currentUserRole === 'HR Admin' || currentUserRole === 'Recruiter';

  return (
    <div id="candidates_management_panel" className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-200 font-sans selection:bg-violet-650 selection:text-white">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Users className="text-violet-400 w-8 h-8" />
            Candidate Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">Acquire and manage pipeline candidates, track progress, review profiles, or trigger formal offer contracts.</p>
        </div>

        {canModify && (
          <button
            id="add_candidate_form_trigger"
            onClick={() => { setShowAddForm(true); setShowEditForm(null); }}
            className="py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg cursor-pointer align-middle"
          >
            <UserPlus className="w-4.5 h-4.5" />
            Add Candidate File
          </button>
        )}
      </div>

      {/* Searching & Filter Rail */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#0f0f12] border border-slate-805 p-4 rounded-2xl shadow-md">
        
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            id="candidate_search_input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates by name, email, or position..."
            className="w-full bg-[#0a0a0c] border border-slate-800 pl-10 pr-4 py-2 text-xs rounded-xl text-slate-205 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Filter Department */}
        <div className="md:col-span-3">
          <select
            id="candidate_department_filter"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2 text-xs text-slate-300 focus:outline-none focus:border-violet-505 cursor-pointer"
          >
            <option value="All" className="bg-[#0a0a0c]">All Departments</option>
            {departments.filter(d => d !== 'All').map(dept => (
              <option key={dept} value={dept} className="bg-[#0a0a0c]">{dept}</option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div className="md:col-span-3">
          <select
            id="candidate_status_filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2 text-xs text-slate-300 focus:outline-none focus:border-violet-505 cursor-pointer"
          >
            <option value="All" className="bg-[#0a0a0c]">All Pipeline Stages</option>
            <option value="Applied" className="bg-[#0a0a0c]">Applied</option>
            <option value="Reviewing" className="bg-[#0a0a0c]">Reviewing</option>
            <option value="Interviewing" className="bg-[#0a0a0c]">Interviewing</option>
            <option value="Offered" className="bg-[#0a0a0c]">Offered</option>
            <option value="Accepted" className="bg-[#0a0a0c]">Accepted</option>
            <option value="Rejected" className="bg-[#0a0a0c]">Rejected</option>
          </select>
        </div>

      </div>

      {/* Main Split Layout: Candidate List vs Profile Viewer Drawer */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Candidates List Column */}
        <div className={`lg:col-span-8 space-y-4`}>
          <div className="bg-[#0f0f12] border border-slate-800 pb-2 rounded-2xl overflow-hidden shadow-lg">
            
            <div className="px-6 py-4 border-b border-slate-800/80 flex justify-between items-center bg-[#0a0a0c]/40">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Record Data ({filteredCandidates.length})</span>
              <span className="text-[10px] text-slate-500 font-mono">Real-time DB connection</span>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-505 text-sm">No candidate resources match current filters.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setStatusFilter('All'); setDeptFilter('All'); }}
                  className="mt-3 text-xs text-violet-400 hover:underline"
                >
                  Clear search parameters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table id="candidates_table" className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0a0a0c] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <th className="p-4 pl-6">Candidate Details</th>
                      <th className="p-4">Department & Position</th>
                      <th className="p-4">Pipeline Stage</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCandidates.map((cand) => (
                      <tr 
                        key={cand.id} 
                        id={`cand_row_${cand.id}`}
                        className={`hover:bg-[#0a0a0c]/60 transition-colors group cursor-pointer ${selectedCandidate?.id === cand.id ? 'bg-violet-950/20 text-violet-300' : ''}`}
                        onClick={() => setSelectedCandidate(cand)}
                      >
                        <td className="p-4 pl-6">
                          <span className="font-extrabold text-white text-sm block group-hover:text-violet-450 transition-colors">{cand.name}</span>
                          <span className="text-slate-405 block tracking-light mt-0.5">{cand.email}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-slate-205 block">{cand.position}</span>
                          <span className="text-slate-505 text-[10px] uppercase font-mono block mt-0.5">{cand.department}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cand.status === 'Accepted' ? 'bg-emerald-900/30 text-emerald-400' :
                            cand.status === 'Offered' ? 'bg-violet-900/40 text-violet-400' :
                            cand.status === 'Interviewing' ? 'bg-cyan-900/30 text-cyan-400' :
                            cand.status === 'Reviewing' ? 'bg-violet-900/20 text-violet-300' :
                            cand.status === 'Rejected' ? 'bg-rose-900/30 text-rose-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            ● {cand.status}
                          </span>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5 text-slate-405 hover:text-violet-400 transition cursor-pointer">
                            <span className="text-[11px] underline max-w-[120px] truncate">{cand.resume || 'CV_Profile.pdf'}</span>
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            <button
                              id={`cand_view_profile_${cand.id}`}
                              onClick={() => setSelectedCandidate(cand)}
                              title="Display Profile Panel"
                              className="p-1.5 bg-[#0a0a0c] hover:bg-slate-800 text-slate-405 hover:text-white rounded-lg transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {canModify && (
                              <>
                                <button
                                  id={`cand_edit_btn_${cand.id}`}
                                  onClick={() => handleOpenEdit(cand)}
                                  title="Edit Candidate"
                                  className="p-1.5 bg-slate-950 hover:bg-slate-800 text-violet-400 hover:text-violet-300 rounded transition"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  id={`cand_del_btn_${cand.id}`}
                                  onClick={() => onDeleteCandidate(cand.id)}
                                  title="Delete Profile File"
                                  className="p-1.5 bg-slate-950 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 rounded transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>        {/* Dynamic Panel: Profile Page / Details Card */}
        <div className="lg:col-span-4">
          {selectedCandidate ? (
            <div id="candidate_profile_card" className="bg-[#0f0f12] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6 relative overflow-hidden">
              {/* Background gradient pill */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />

              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest font-bold">Candidate Profile Dossier</span>
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕ Close panel
                </button>
              </div>

              {/* Title & Avatar */}
              <div className="flex items-center gap-4 border-b border-slate-800/60 pb-5">
                <div className="h-14 w-14 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center font-bold text-xl uppercase">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">{selectedCandidate.name}</h2>
                  <span className="text-xs text-violet-300 font-semibold">{selectedCandidate.position}</span>
                </div>
              </div>

              {/* Attributes block */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-slate-800/40 pb-2">
                  <span className="text-slate-400 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> Email</span>
                  <span className="text-slate-205 select-all">{selectedCandidate.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/40 pb-2">
                  <span className="text-slate-405 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> Phone</span>
                  <span className="text-slate-205 select-all">{selectedCandidate.phone || 'Not Supplied'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/40 pb-2">
                  <span className="text-slate-405 flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-slate-500" /> Department</span>
                  <span className="text-slate-205 font-bold uppercase">{selectedCandidate.department}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/40 pb-2">
                  <span className="text-slate-405 flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-slate-500" /> Professional Exp</span>
                  <span className="text-slate-200 font-bold text-violet-300">{selectedCandidate.experience} years</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/40 pb-2">
                  <span className="text-slate-405 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-slate-500" /> Expected Salary</span>
                  <span className="text-emerald-400 font-bold">{selectedCandidate.expectedSalary || 'N/A'}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-405 flex items-center gap-1"><FileCheck className="w-3.5 h-3.5 text-slate-500" /> Verified Onboarding</span>
                  <span className="text-slate-300 font-light">Passed basic test criteria</span>
                </div>
              </div>

              {/* Resume File Simulation panel */}
              <div className="bg-[#0a0a0c] border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-violet-900/30 text-violet-400 rounded">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-mono font-bold text-slate-200 block truncate max-w-[120px]">{selectedCandidate.resume || 'resume.pdf'}</span>
                    <span className="text-[9px] text-slate-500 block">PDF Onboard • 512 KB</span>
                  </div>
                </div>

                <a 
                  href={`#resume-simulate-action`}
                  onClick={(e) => { e.preventDefault(); alert(`Simulated document retrieval for ${selectedCandidate.name}. File has been parsed!`); }}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-[10px] text-slate-400 hover:text-violet-400 transition rounded flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3 h-3" />
                  Get
                </a>
              </div>

              {/* Secondary CTA buttons */}
              {canModify && selectedCandidate.status !== 'Offered' && selectedCandidate.status !== 'Accepted' && (
                <button
                  id="cand_trigger_ofletter_cta"
                  onClick={() => onDraftLetterFromCandidate(selectedCandidate)}
                  className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer pt-2.5 pb-2.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Compile & Send Offer Letter
                </button>
              )}

              {selectedCandidate.status === 'Offered' && (
                <div className="p-3 bg-violet-950/40 border border-violet-900/20 rounded-xl text-xs text-violet-300 text-center">
                  📄 An Offer Letter was compiled and sent to this candidate. It is undergoing approval signatures.
                </div>
              )}

              {selectedCandidate.status === 'Accepted' && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-950/20 rounded-xl text-xs text-emerald-300 text-center">
                  🎉 Offer Accepted! John Doe has e-signed this proposal. Onboarding in progress.
                </div>
              )}

            </div>
          ) : (
            <div className="bg-[#0f0f12]/40 border border-slate-800/80 border-dashed rounded-2xl p-8 text-center text-slate-500 text-xs">
              <Users className="w-8 h-8 mx-auto text-slate-700 mb-2" />
              Select any candidate list file row to trigger their deep HR profile file, resume downloads and offer triggers.
            </div>
          )}
        </div>
      </div>

      {/* Flyout Modals / Forms: Create Candidate */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f12] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-extrabold text-white">Create Pipeline Candidate Profile</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rachel Green"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Organization / Personal Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rgreen@outlook.com"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Mobile Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 789-3245"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Position Target</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Staff Security Architect"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Target Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none cursor-pointer"
                  >
                    <option value="Engineering" className="bg-[#0f0f12]">Engineering</option>
                    <option value="Product Design" className="bg-[#0f0f12]">Design</option>
                    <option value="Finance" className="bg-[#0f0f12]">Finance</option>
                    <option value="Education" className="bg-[#0f0f12]">Education</option>
                    <option value="Healthcare Operations" className="bg-[#0f0f12]">Healthcare</option>
                    <option value="Operations" className="bg-[#0f0f12]">Operations</option>
                    <option value="Quality Assurance" className="bg-[#0f0f12]">Quality Assurance</option>
                    <option value="Marketing" className="bg-[#0f0f12]">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Years Of Exp</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Expected Compensation</label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="$120,000 / year"
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Candidate Stage</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CandidateStatus)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none cursor-pointer"
                >
                  <option value="Applied" className="bg-[#0f0f12]">Applied (Initial Profile)</option>
                  <option value="Reviewing" className="bg-[#0f0f12]">Reviewing (Triage)</option>
                  <option value="Interviewing" className="bg-[#0f0f12]">Interviewing (Technical)</option>
                  <option value="Offered" className="bg-[#0f0f12]">Offered (Generating package)</option>
                </select>
              </div>

              <div className="p-3 bg-[#0a0a0c] border border-violet-900/30 rounded-xl">
                <span className="text-[10px] text-violet-400 font-mono uppercase block mb-1">Resume File Upload simulation</span>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="rgreen_resume.pdf"
                  className="w-full bg-[#0f0f12] border border-slate-800 text-[11px] text-slate-200 p-2 rounded-xl focus:outline-none transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  id="candidate_submit_add_btn"
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold transition"
                >
                  Save File
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Flyout Modals: Edit Candidate */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f12] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-extrabold text-white">Modify Candidate Information</h3>
              <button 
                onClick={() => setShowEditForm(null)}
                className="text-slate-400 hover:text-slate-202"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Target Position</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Expected Salary</label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Review Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CandidateStatus)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none cursor-pointer"
                  >
                    <option value="Applied" className="bg-[#0f0f12]">Applied</option>
                    <option value="Reviewing" className="bg-[#0f0f12]">Reviewing</option>
                    <option value="Interviewing" className="bg-[#0f0f12]">Interviewing</option>
                    <option value="Offered" className="bg-[#0f0f12]">Offered</option>
                    <option value="Accepted" className="bg-[#0f0f12]">Accepted</option>
                    <option value="Rejected" className="bg-[#0f0f12]">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Resume PDF Doc</label>
                  <input
                    type="text"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditForm(null)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  id="candidate_submit_edit_btn"
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold transition"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
