/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Layers, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send, 
  MessageSquare, 
  Trash2, 
  Copy, 
  Edit,
  ArrowRight,
  User,
  ShieldCheck,
  AlertTriangle,
  History,
  CornerDownRight,
  Eye,
  PenTool,
  Printer,
  Download,
  RefreshCw
} from 'lucide-react';
import { OfferLetter, OfferLetterStatus, UserRole, ApprovalHistoryItem } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface OfferLettersListProps {
  offers: OfferLetter[];
  onUpdateOfferStatus: (id: string, newStatus: OfferLetterStatus, comment: string, actorName: string, actorRole: UserRole) => void;
  onDeleteOffer: (id: string) => void;
  onDuplicateOffer: (letter: OfferLetter) => void;
  currentUser: { name: string; role: UserRole };
}

export default function OfferLettersList({
  offers,
  onUpdateOfferStatus,
  onDeleteOffer,
  onDuplicateOffer,
  currentUser
}: OfferLettersListProps) {
  
  // Filtering & search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // UI Panels
  const [selectedLetter, setSelectedLetter] = useState<OfferLetter | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState<'timeline' | 'preview'>('timeline');

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePdfGeneration = async () => {
    if (!selectedLetter) return;
    const paper = document.getElementById('offer_letter_render_a4_registry');
    if (!paper) {
      alert('Render layer missed.');
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(paper, {
        scale: 2, // increases PPI
        useCORS: true,
        logging: false,
        backgroundColor: selectedLetter.themeColors?.background || '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Marginal compression override for neatness
      if (imgHeight > pageHeight && imgHeight <= pageHeight * 1.15) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pageHeight);
      } else {
        // Multi-page slicing
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      const fileSafeName = (selectedLetter.candidateName || 'Draft').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`OfferLetter_${fileSafeName}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Could not compile PDF document layout to canvas.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Process filters
  const filteredOffers = useMemo(() => {
    return offers.filter(o => {
      const matchText = o.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' ? true : o.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [offers, searchTerm, statusFilter]);

  // Handle direct workflow transitions based on active roles
  const handleWorkflowAction = (action: 'Approve' | 'Reject' | 'Request Changes' | 'SignAccept') => {
    if (!selectedLetter) return;
    
    let nextStatus: OfferLetterStatus = selectedLetter.status;
    let successMessage = '';
    
    if (action === 'Approve') {
      if (selectedLetter.status === 'Pending Hiring Manager Approval') {
        nextStatus = 'Pending HR Admin Approval';
        successMessage = 'Letter approved by Hiring Manager. Directed to HR Admin for final authorization.';
      } else if (selectedLetter.status === 'Pending HR Admin Approval') {
        nextStatus = 'Final Approved';
        successMessage = 'Offer has been final-approved! It is now fully authorized to be sent as a package.';
      }
    } else if (action === 'Reject') {
      nextStatus = 'Rejected';
      successMessage = 'Offer has been formally Rejected. Timeline closed.';
    } else if (action === 'Request Changes') {
      nextStatus = 'Changes Requested';
      successMessage = 'Changes requested on this offer. Returned to Recruiters queue with comments.';
    } else if (action === 'SignAccept') {
      nextStatus = 'Accepted';
      successMessage = 'Congratulations! John Doe has e-signed this proposal letter.';
    }

    onUpdateOfferStatus(
      selectedLetter.id, 
      nextStatus, 
      reviewComment || `${action} executed via Role Simulator.`, 
      currentUser.name, 
      currentUser.role
    );

    // Refresh panel binding
    const updateTarget = { 
      ...selectedLetter, 
      status: nextStatus,
      history: [
        ...selectedLetter.history,
        {
          id: `hist_${Date.now()}`,
          step: getStepName(selectedLetter.status),
          action: mapAction(action),
          actorName: currentUser.name,
          actorRole: currentUser.role,
          comments: reviewComment || `${action} action performed.`,
          timestamp: new Date().toISOString()
        }
      ]
    };
    setSelectedLetter(updateTarget);
    setReviewComment('');
    alert(successMessage);
  };

  const mapAction = (act: string): any => {
    if (act === 'Approve') return 'Approved';
    if (act === 'Reject') return 'Rejected';
    if (act === 'Request Changes') return 'Changes Requested';
    if (act === 'SignAccept') return 'Approved';
    return 'Sent';
  };

  const getStepName = (status: OfferLetterStatus): any => {
    if (status === 'Pending Hiring Manager Approval') return 'Hiring Manager';
    if (status === 'Pending HR Admin Approval') return 'HR Admin';
    return 'Final';
  };

  // Helper displays if custom controls like action panels should be rendered
  const isActionAllowed = useMemo(() => {
    if (!selectedLetter) return false;
    const s = selectedLetter.status;
    const r = currentUser.role;

    if (s === 'Pending Hiring Manager Approval' && r === 'Hiring Manager') return true;
    if (s === 'Pending HR Admin Approval' && r === 'HR Admin') return true;
    
    // Recruiter can send physical emails for draft status or finalized state
    if ((s === 'Draft' || s === 'Changes Requested') && r === 'Recruiter') return true;
    if (s === 'Final Approved' && r === 'Recruiter') return true;

    // Candidates can sign accepted offer
    if (s === 'Sent' && r === 'Employee') return true;

    return false;
  }, [selectedLetter, currentUser]);

  const handleTransmitEmail = () => {
    if (!selectedLetter) return;
    onUpdateOfferStatus(
      selectedLetter.id,
      'Sent',
      'The Recruiter officially dispatched the offer letter containing branding, benefits, and signature lines to John Does inbox.',
      currentUser.name,
      currentUser.role
    );
    alert(`Success! Email dispatched to candidate ${selectedLetter.candidateName} (${selectedLetter.candidateEmail}). Package is live.`);
    // Refresh local binding
    setSelectedLetter({
      ...selectedLetter,
      status: 'Sent'
    });
  };

  return (
    <div id="offers_management_panel" className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-100 font-sans selection:bg-violet-650 selection:text-white pb-16">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Layers className="text-violet-400 w-8 h-8" />
            Offer Letters Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1">Audit status histories, review comments, approve/reject contracts, or swap roles to sign off.</p>
        </div>

        {/* Dynamic active user badge */}
        <div className="p-2.5 bg-[#0f0f12] border border-slate-800 rounded-xl text-xs flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-violet-400" />
          <span>Active Observer: <strong className="text-violet-300 font-mono font-bold">{currentUser.name} ({currentUser.role})</strong></span>
        </div>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#0f0f12] border border-slate-805 p-4 rounded-2xl shadow-md">
        
        {/* Search */}
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            id="offer_search_input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search generated offers by candidate, position name, or department..."
            className="w-full bg-[#0a0a0c] border border-slate-800 pl-10 pr-4 py-2 text-xs rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Filter Status */}
        <div className="md:col-span-4">
          <select
            id="offer_status_dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0f0f12]">All Approval Stages</option>
            <option value="Draft" className="bg-[#0f0f12]">Draft</option>
            <option value="Pending Hiring Manager Approval" className="bg-[#0f0f12]">Pending Hiring Manager Approval</option>
            <option value="Pending HR Admin Approval" className="bg-[#0f0f12]">Pending HR Admin Approval</option>
            <option value="Final Approved" className="bg-[#0f0f12]">Final Approved</option>
            <option value="Sent" className="bg-[#0f0f12]">Sent to Candidate</option>
            <option value="Accepted" className="bg-[#0f0f12]">Accepted & Signed</option>
            <option value="Rejected" className="bg-[#0f0f12]">Rejected</option>
            <option value="Changes Requested" className="bg-[#0f0f12]">Changes Requested</option>
          </select>
        </div>

      </div>

      {/* Splits layout: Table of offers vs Interactive Timeline flyout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid: letters catalog list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0f0f12] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            
            <div className="px-6 py-4 border-b border-slate-800 bg-[#0a0a0c]/40">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-mono">Generated Offers Pool ({filteredOffers.length})</span>
            </div>

            {filteredOffers.length === 0 ? (
              <p className="p-12 text-slate-500 text-center text-xs">No offer resources found matching search filters.</p>
            ) : (
              <div className="divide-y divide-slate-850/60 pb-1">
                {filteredOffers.map((off) => (
                  <div
                    key={off.id}
                    id={`offer_item_row_${off.id}`}
                    onClick={() => setSelectedLetter(off)}
                    className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#0a0a0c]/60 cursor-pointer ${selectedLetter?.id === off.id ? 'bg-violet-950/20 border-l-2 border-violet-500' : ''}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-white group-hover:text-violet-400 transition-colors">{off.candidateName}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          off.status === 'Accepted' ? 'bg-emerald-950 text-emerald-400' :
                          off.status === 'Rejected' ? 'bg-rose-950 text-rose-400' :
                          off.status === 'Changes Requested' ? 'bg-orange-950 text-orange-400 animate-pulse' :
                          'bg-violet-950 text-violet-400'
                        }`}>
                          {off.status.replace('Pending ', '')}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                        <span className="block">{off.position} • {off.department}</span>
                        <span className="block font-mono text-[10px] text-slate-500">Drafted: {off.createdDate} • Compensation: {off.salary}</span>
                      </div>
                    </div>

                    {/* Copy/Del Trigger */}
                    <div className="flex gap-1.5 md:self-center self-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLetter(off)}
                        className="p-1.5 bg-[#0a0a0c] hover:bg-slate-800 text-slate-405 hover:text-white rounded-lg transition"
                        title="Open Timeline Track"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDuplicateOffer(off)}
                        className="p-1.5 bg-[#0a0a0c] hover:bg-slate-800 text-violet-405 hover:text-violet-300 rounded-lg transition"
                        title="Duplicate Letter"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteOffer(off.id)}
                        className="p-1.5 bg-[#0a0a0c] hover:bg-rose-950/45 text-rose-400 hover:text-rose-300 rounded-lg transition"
                        title="Delete Letter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Right Grid: Step Timeline details and Role approval workspace */}
        <div className="lg:col-span-5">
          {selectedLetter ? (
            <div id="workflow_details_card" className="bg-[#0f0f12] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Header metadata */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-violet-400 block uppercase font-bold tracking-widest">Interactive Audit Timeline</span>
                  <h3 className="text-lg font-black text-white mt-1 ">{selectedLetter.candidateName} Offer</h3>
                  <span className="text-xs text-slate-450">{selectedLetter.position} ({selectedLetter.salary})</span>
                </div>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  ✕ Close panel
                </button>
              </div>
              <div className="flex bg-[#0a0a0c] p-1 rounded-xl border border-slate-800 no-print">
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('timeline')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeDetailTab === 'timeline'
                      ? 'bg-violet-605 bg-violet-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  Timeline Audit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('preview')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeDetailTab === 'preview'
                      ? 'bg-violet-650 bg-violet-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  Document Preview
                </button>
              </div>

              {activeDetailTab === 'timeline' ? (
                <>
                  {/* Step Timeline Graphics */}
                  <div className="space-y-4 no-print">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block font-mono">4-Step Progression Track</span>
                    
                    {[
                      { step: 'Recruiter', title: 'Offer Letter Drafted', desc: 'Synthesized with base parameters', role: 'Recruiter' },
                      { step: 'Hiring Manager', title: 'Hiring Manager Authorization', desc: 'Validates budget allocation', role: 'Hiring Manager' },
                      { step: 'HR Admin', title: 'HR Admin Verification', desc: 'Verifies final compliance rules', role: 'HR Admin' },
                      { step: 'Final', title: 'Candidate Acceptance & Signature', desc: 'Online portal e-signing', role: 'Employee' }
                    ].map((st, sIdx) => {
                      
                      const isCompleted = (selectedLetter.status === 'Accepted') ||
                        (st.step === 'Recruiter') ||
                        (st.step === 'Hiring Manager' && selectedLetter.status !== 'Draft' && selectedLetter.status !== 'Pending Hiring Manager Approval' && selectedLetter.status !== 'Changes Requested') ||
                        (st.step === 'HR Admin' && (selectedLetter.status === 'Final Approved' || selectedLetter.status === 'Sent' || selectedLetter.status === 'Accepted'));

                      const isActive = (st.step === 'Hiring Manager' && selectedLetter.status === 'Pending Hiring Manager Approval') ||
                        (st.step === 'HR Admin' && selectedLetter.status === 'Pending HR Admin Approval') ||
                        (st.step === 'Final' && selectedLetter.status === 'Sent');

                      const isIssuesOnStep = (st.step === 'Hiring Manager' && selectedLetter.status === 'Changes Requested');

                      return (
                        <div key={sIdx} className="flex gap-3 text-xs">
                          {/* Left icon markers */}
                          <div className="flex flex-col items-center">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold font-mono text-[10px] border transition ${
                              isCompleted ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                              isActive ? 'bg-violet-950 text-violet-400 border-violet-800 animate-pulse' :
                              isIssuesOnStep ? 'bg-orange-950 text-orange-400 border-orange-850' :
                              'bg-slate-950 text-slate-600 border-slate-850'
                            }`}>
                              {sIdx + 1}
                            </div>
                            {sIdx < 3 && (
                              <div className={`w-0.5 grow mt-1 ${isCompleted ? 'bg-emerald-800' : 'bg-slate-800'}`} />
                            )}
                          </div>

                          {/* Text descriptors */}
                          <div className="pb-3 flex-1 text-left">
                            <div className="flex justify-between items-baseline">
                              <span className={`font-bold block ${isActive ? 'text-violet-400':'text-slate-200'}`}>{st.title}</span>
                              <span className="text-[10px] text-slate-500 font-mono italic uppercase">Actor: {st.role}</span>
                            </div>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">{st.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Workspace if approved */}
                  <div className="p-4 bg-[#0a0a0c] border border-slate-850 rounded-2xl space-y-4 no-print">
                    <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider block font-mono">Dynamic Operations Panel</span>
                    
                    {isActionAllowed ? (
                      <div className="space-y-4 text-xs">
                        <p className="text-slate-400 text-xs text-left">
                          Your simulated role is <strong className="text-violet-300 uppercase font-mono">{currentUser.role}</strong>. You have permissions to authorize or alter this ledger step instantly.
                        </p>

                        {/* Comment text-area */}
                        {currentUser.role !== 'Employee' && (
                          <div className="text-left">
                            <label className="block text-slate-555 mb-1.5 focus:text-violet-400">Action Comments / Audit Log</label>
                            <textarea
                              id="workflow_comment_area"
                              rows={2}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="e.g. Budget vetted successfully, ready or please update compensation..."
                              className="w-full bg-[#0f0f12] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        )}

                        {/* Standard CTAs */}
                        {currentUser.role === 'Hiring Manager' && (
                          <div className="flex gap-2">
                            <button
                              id="workflow_manager_approve"
                              onClick={() => handleWorkflowAction('Approve')}
                              className="grow py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer text-xs transition"
                            >
                              Approve Base package
                            </button>
                            <button
                              id="workflow_manager_changes"
                              onClick={() => handleWorkflowAction('Request Changes')}
                              className="py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl cursor-pointer text-xs transition"
                            >
                              Request Changes
                            </button>
                          </div>
                        )}

                        {currentUser.role === 'HR Admin' && (
                          <div className="flex gap-2">
                            <button
                              id="workflow_admin_approve"
                              onClick={() => handleWorkflowAction('Approve')}
                              className="grow py-2.5 px-3 bg-violet-650 hover:bg-violet-650 text-white font-bold rounded-xl cursor-pointer text-xs transition"
                            >
                              Approve and Authorize
                            </button>
                            <button
                              id="workflow_admin_reject"
                              onClick={() => handleWorkflowAction('Reject')}
                              className="py-2.5 px-3 bg-rose-650 hover:bg-rose-600 text-white font-semibold rounded-xl cursor-pointer text-xs transition"
                            >
                              Reject Proposal
                            </button>
                          </div>
                        )}

                        {currentUser.role === 'Recruiter' && selectedLetter.status === 'Final Approved' && (
                          <button
                            id="workflow_recruiter_send_email"
                            onClick={handleTransmitEmail}
                            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs transition"
                          >
                            <Send className="w-4 h-4" />
                            Transmit Offer by Email
                          </button>
                        )}

                        {currentUser.role === 'Employee' && selectedLetter.status === 'Sent' && (
                          <div className="space-y-3">
                            <div className="p-3 bg-violet-950/20 border border-violet-900/30 rounded-xl text-[11px] text-slate-300 text-left">
                              ✍ John, review the generated letterhead package carefully. Accept and e-sign this offer below.
                            </div>
                            <button
                              id="workflow_employee_sign"
                              onClick={() => handleWorkflowAction('SignAccept')}
                              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs transition"
                            >
                              <PenTool className="w-4 h-4" />
                              Accept & E-Sign Offer Letter
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 leading-relaxed text-center py-2">
                        {selectedLetter.status === 'Accepted' && '🎉 Offer accepted successfully! Timeline is closed.'}
                        {selectedLetter.status === 'Rejected' && '❌ Offer rejected formally. Under evaluation.'}
                        {selectedLetter.status === 'Draft' && '✍ Recruiter holds the Draft. Open "Offer Generator" to push to pipeline.'}
                        {selectedLetter.status === 'Pending Hiring Manager Approval' && currentUser.role !== 'Hiring Manager' && '⏳ Waiting for "David (Hiring Manager)" to approve.'}
                        {selectedLetter.status === 'Pending HR Admin Approval' && currentUser.role !== 'HR Admin' && '⏳ Awaiting "Sarah (HR Admin)" authorization.'}
                        {selectedLetter.status === 'Final Approved' && currentUser.role !== 'Recruiter' && '⏳ Recruiter authorization needed to dispatch email.'}
                        {selectedLetter.status === 'Sent' && currentUser.role !== 'Employee' && '⏳ Dispatched! Waiting for "John Doe (Employee/Candidate)" to sign.'}
                        {selectedLetter.status === 'Changes Requested' && '🔄 Changes requested by reviewers. Waiting on Recruiters edits.'}
                      </p>
                    )}
                  </div>

                  {/* Timeline historical logs */}
                  {selectedLetter.history && selectedLetter.history.length > 0 && (
                    <div className="space-y-3 no-print">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block font-mono text-left">Comments Log ({selectedLetter.history.length})</span>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar text-left font-sans">
                        {selectedLetter.history.map((hist, hIdx) => (
                          <div key={hIdx} className="bg-[#0a0a0c] p-2.5 rounded-xl border border-slate-900/60 leading-normal text-left">
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono text-left">
                              <span className="font-bold text-violet-400">{hist.actorName} ({hist.actorRole})</span>
                              <span>{hist.timestamp.split('T')[0] || 'Today'}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1">{hist.comments}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* DOCUMENT PREVIEW & PDF / PRINT EXPORT PANEL */
                <div className="space-y-4">
                  {/* Action Bar for PDFs & Print */}
                  <div className="flex justify-between items-center bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 no-print">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Letter
                    </button>

                    <button
                      type="button"
                      onClick={handlePdfGeneration}
                      disabled={isGeneratingPdf}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-400 hover:text-white border border-slate-800 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isGeneratingPdf ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-teal-400" />
                          Save as PDF
                        </>
                      )}
                    </button>
                  </div>

                  {/* A4 simulated Letterhead document paper block */}
                  <div className="p-1 max-h-[60vh] overflow-y-auto custom-scrollbar rounded-xl border border-slate-801 bg-slate-950/40">
                    <div 
                      id="offer_letter_render_a4_registry"
                      className="bg-white text-slate-900 w-full p-8 md:p-10 paper-container relative space-y-5 rounded-lg text-left shadow-2xl transition-all"
                      style={{ 
                        fontFamily: selectedLetter.fontFamily === 'JetBrains Mono' ? 'monospace' : 'sans-serif', 
                        fontSize: selectedLetter.fontSize || '12px',
                        backgroundColor: selectedLetter.themeColors?.background || '#ffffff'
                      }}
                    >
                      {/* Header Letterhead */}
                      {selectedLetter.visibilityControls?.showHeader && selectedLetter.header && (
                        <div className="border-b border-slate-200 pb-3 text-[9px] text-slate-500 whitespace-pre-wrap font-mono uppercase leading-relaxed tracking-wider">
                          {selectedLetter.header}
                        </div>
                      )}

                      {/* Logo display */}
                      {selectedLetter.visibilityControls?.showLogo && (
                        <div className="flex items-center gap-1.5 py-1 text-slate-900 font-bold text-xs" style={{ color: selectedLetter.themeColors?.primary || '#7c3aed' }}>
                          <div className="h-5 w-5 rounded flex items-center justify-center text-[10px] text-white font-black" style={{ backgroundColor: selectedLetter.themeColors?.primary || '#7c3aed' }}>
                            {selectedLetter.companyName?.charAt(0) || 'O'}
                          </div>
                          {selectedLetter.companyName}
                        </div>
                      )}

                      {/* Substituted Letter text content */}
                      <div 
                        className="whitespace-pre-wrap leading-relaxed py-1 text-slate-800 text-xs space-y-2.5 font-sans"
                        style={{ 
                          color: selectedLetter.themeColors?.text || '#1e293b'
                        }}
                      >
                        {selectedLetter.bodyContent}
                      </div>

                      {/* Benefits Subdivision */}
                      {selectedLetter.benefits && (
                        <div className="p-3 bg-slate-50/90 rounded border border-slate-100 text-[10px]">
                          <span className="font-extrabold text-[9px] text-slate-700 block uppercase mb-1">RECOGNIZED BENEFITS & BONUSES PACKAGE</span>
                          <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">{selectedLetter.benefits}</div>
                        </div>
                      )}

                      {/* Terms section */}
                      {selectedLetter.visibilityControls?.showTerms && selectedLetter.termsAndConditions && (
                        <div className="p-3 bg-slate-50/90 rounded border border-slate-100 text-[9px] italic text-slate-600 leading-normal">
                          <span className="font-bold text-[8.5px] text-slate-700 block not-italic uppercase mb-1">LEGAL CONTRACT SLATE COVENANTS</span>
                          {selectedLetter.termsAndConditions}
                        </div>
                      )}

                      {/* Signature Lines Block */}
                      {selectedLetter.visibilityControls?.showSignatures && selectedLetter.signatureBlocks && (
                        <div className="grid grid-cols-2 gap-6 pt-5">
                          {selectedLetter.signatureBlocks.map((sig, i) => (
                            <div key={i} className="border-t border-slate-300 pt-2 text-[9px] text-slate-500 text-left">
                              <span className="block font-semibold text-slate-800">{sig.name || 'Signee Name'}</span>
                              <span className="block">{sig.title}</span>
                              {selectedLetter.status === 'Accepted' && sig.title.toLowerCase().includes('candidate') && (
                                <span className="block text-[8px] text-emerald-600 font-mono mt-0.5">✓ E-Signed on Acceptance</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer footnotes */}
                      {selectedLetter.visibilityControls?.showFooter && selectedLetter.footer && (
                        <div className="border-t border-slate-105 pt-2 text-[8px] text-slate-400 text-center uppercase tracking-wide">
                          {selectedLetter.footer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-[#0f0f12]/40 border border-slate-800 border-dashed rounded-2xl p-8 text-slate-500 text-center text-xs">
              <History className="w-8 h-8 mx-auto text-slate-700 mb-2" />
              Select an Offer Letter file from the registry pool on the left to review its multi-role signatures timeline, track steps, or execute comments/approvals.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
