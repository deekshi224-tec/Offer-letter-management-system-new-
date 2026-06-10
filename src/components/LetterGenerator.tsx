/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Save, 
  Sparkles, 
  RefreshCw, 
  User, 
  Check, 
  FileCheck, 
  ArrowLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Candidate, OfferLetter, Template, OfferLetterStatus } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface LetterGeneratorProps {
  candidates: Candidate[];
  templates: Template[];
  onSaveOfferLetter: (letter: OfferLetter) => void;
  selectedTemplateFromMarketplace: Template | null;
  selectedCandidateFromManager: Candidate | null;
  onChangeView: (view: string) => void;
}

export default function LetterGenerator({
  candidates,
  templates,
  onSaveOfferLetter,
  selectedTemplateFromMarketplace,
  selectedCandidateFromManager,
  onChangeView
}: LetterGeneratorProps) {
  
  // Choose templates & candidates list
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    selectedTemplateFromMarketplace?.id || templates[0]?.id || ''
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    selectedCandidateFromManager?.id || ''
  );

  // Offer detail parameters
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [companyName, setCompanyName] = useState('OLMS Enterprise');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [salary, setSalary] = useState('');
  const [joiningDate, setJoiningDate] = useState('2026-07-01');
  const [reportingManager, setReportingManager] = useState('');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Internship'>('Full-time');
  const [benefits, setBenefits] = useState('');
  const [terms, setTerms] = useState('');

  // Loaded template reference for layouts
  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Auto-fill form when candidate or template elements are selected
  useEffect(() => {
    if (selectedCandidateId) {
      const cand = candidates.find(c => c.id === selectedCandidateId);
      if (cand) {
        setCandidateName(cand.name);
        setCandidateEmail(cand.email);
        setPosition(cand.position);
        setDepartment(cand.department);
        setSalary(cand.expectedSalary || '$120,500 / year');
      }
    }
  }, [selectedCandidateId, candidates]);

  useEffect(() => {
    if (selectedTemplateFromMarketplace) {
      setSelectedTemplateId(selectedTemplateFromMarketplace.id);
    }
  }, [selectedTemplateFromMarketplace]);

  useEffect(() => {
    if (selectedCandidateFromManager) {
      setSelectedCandidateId(selectedCandidateFromManager.id);
    }
  }, [selectedCandidateFromManager]);

  // Load preset template contents
  const handleLoadTemplatePresets = () => {
    if (activeTemplate) {
      setCompanyName(activeTemplate.companyName || 'OLMS Enterprise');
      setTerms(activeTemplate.termsAndConditions || '');
    }
  };

  // Perform variable substitution mapping on template content body
  const compiledBodyText = () => {
    if (!activeTemplate) return '';
    let body = activeTemplate.bodyContent;
    body = body.replace(/\{\{CandidateName\}\}/g, candidateName || '___[Candidate Name]___');
    body = body.replace(/\{\{Position\}\}/g, position || '___[Position]___');
    body = body.replace(/\{\{Salary\}\}/g, salary || '___[Salary Package]___');
    body = body.replace(/\{\{JoiningDate\}\}/g, joiningDate || '___[Joining Date]___');
    body = body.replace(/\{\{ReportingManager\}\}/g, reportingManager || '___[Reporting Manager]___');
    body = body.replace(/\{\{CompanyName\}\}/g, companyName || '___[Company Name]___');
    body = body.replace(/\{\{Department\}\}/g, department || '___[Department]___');
    return body;
  };

  // Compile letter database object
  const compileOfferObject = (status: OfferLetterStatus): OfferLetter => {
    return {
      id: `letter_${Date.now()}`,
      candidateId: selectedCandidateId || 'unbound',
      candidateName,
      candidateEmail,
      companyName,
      position,
      department,
      salary,
      joiningDate,
      reportingManager,
      employmentType,
      benefits,
      termsAndConditions: terms,
      status, 
      templateId: selectedTemplateId,
      header: activeTemplate.header,
      bodyContent: compiledBodyText(),
      footer: activeTemplate.footer,
      fontFamily: activeTemplate.fontFamily,
      fontSize: activeTemplate.fontSize,
      themeColors: activeTemplate.themeColors,
      signatureBlocks: activeTemplate.signatureBlocks.map(sig => ({
        title: sig.title,
        name: sig.name === '{{CandidateName}}' ? candidateName : sig.name
      })),
      visibilityControls: activeTemplate.visibilityControls,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      history: [
        {
          id: `hist_${Date.now()}`,
          step: 'Recruiter',
          action: 'Created',
          actorName: 'Michael Chang',
          actorRole: 'Recruiter',
          comments: `Compiled initial offer draft utilizing "${activeTemplate.name}". Status: ${status}`,
          timestamp: new Date().toISOString()
        }
      ]
    };
  };

  const handleSaveDraft = () => {
    if (!candidateName) {
      alert('Candidate Name is required to save an offer letter draft.');
      return;
    }
    const letter = compileOfferObject('Draft');
    onSaveOfferLetter(letter);
    alert('Letter written to local database as an editable draft.');
    onChangeView('offers');
  };

  const handleSendWorkflow = () => {
    if (!candidateName || !selectedCandidateId) {
      alert('A valid pipeline Candidate binding is required for routing the approval chain.');
      return;
    }
    // Route to Hiring manager next! Recruiter -> Hiring Manager -> HR Admin -> Final
    const letter = compileOfferObject('Pending Hiring Manager Approval');
    onSaveOfferLetter(letter);
    alert('Done! Offer letter sent. Transmitting to Step 1: "Hiring Manager" for review comments.');
    onChangeView('offers');
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // EXPORT PDF: preserving colors, layouts
  const handlePdfGeneration = async () => {
    const paper = document.getElementById('offer_letter_render_a4');
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
        backgroundColor: activeTemplate.themeColors?.background || '#ffffff'
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
      
      // If height fits fine or slightly exceeds a single page, compress marginally to keep a neat single-page document
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
      
      const fileSafeName = (candidateName || 'Draft').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`OfferLetter_${fileSafeName}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Could not compile PDF document layout to canvas.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // PRINT
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="offer_generator_panel" className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-100 font-sans selection:bg-violet-650 selection:text-white pb-16">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6 no-print">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <FileText className="text-violet-400 w-8 h-8" />
            Offer Letters dynamic Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">Select a template, fill matching parameters, compile, and instantly produce validated PDF files.</p>
        </div>

        {/* Action items */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="generator_print_btn"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-[#0f0f12] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
          >
            <Printer className="w-4 h-4" />
            Direct Print
          </button>

          <button
            id="generator_pdf_btn"
            onClick={handlePdfGeneration}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 bg-[#0f0f12] hover:bg-slate-800 text-teal-400 hover:text-white border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-teal-400" />
                Export A4 PDF
              </>
            )}
          </button>

          <button
            id="generator_save_draft"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 bg-[#0f0f12] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>

          <button
            id="generator_start_workflow_btn"
            onClick={handleSendWorkflow}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-550 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition"
          >
            <FileCheck className="w-4 h-4" />
            Send into Approval Chain
          </button>
        </div>
      </div>

      {/* Main Splits layout: Form controls vs Document Live Preview */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Form parameters & candidate loaders */}
        <div className="lg:col-span-12 xl:col-span-5 bg-[#0f0f12] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar no-print">
          
          {/* Item 1: Preset Loaders (Candidate pool binding) */}
          <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest font-bold block">1. Selection Bindings</span>
            
            <div className="space-y-2 text-xs">
              <div className="text-left">
                <label className="block text-slate-500 mb-1">Bind Client Candidate</label>
                <select
                  id="generator_candidate_select"
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-200 cursor-pointer focus:outline-none focus:border-violet-500 transition-all font-sans"
                >
                  <option value="">-- Click to select active candidate --</option>
                  {candidates.map(cand => (
                    <option key={cand.id} value={cand.id}>👤 {cand.name} ({cand.position})</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-550 mt-1">Auto-populates core details directly from applicant files.</p>
              </div>

              <div className="text-left">
                <label className="block text-slate-500 mb-1">Select A4 Base Template</label>
                <select
                  id="generator_template_select"
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-200 cursor-pointer focus:outline-none focus:border-violet-500 transition-all font-sans"
                >
                  {templates.map(temp => (
                    <option key={temp.id} value={temp.id}>📄 {temp.name} (style: {temp.style})</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleLoadTemplatePresets}
                className="w-full py-2 bg-[#0c0c0e] border border-slate-800 hover:text-violet-400 text-[11px] font-semibold text-slate-400 rounded-xl transition cursor-pointer"
              >
                Reset layout content to Template Boilerplate
              </button>
            </div>
          </div>

          {/* Item 2: Recruiter Form Parameters */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block text-left">2. Custom Offer Variables</span>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-left">
              <div>
                <label className="block text-slate-500 mb-1">Candidate Name</label>
                <input
                  id="generator_candidate_name"
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Arthur Dent"
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-220 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Target Position</label>
                <input
                  id="generator_position"
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Design Consultant"
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-220 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-left">
              <div>
                <label className="block text-slate-500 mb-1">Department Sector</label>
                <input
                  id="generator_department"
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Design Ops"
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-220 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Annum Base Salary</label>
                <input
                  id="generator_salary"
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="$115,000 / year"
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-220 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans text-left">
              <div>
                <label className="block text-slate-500 mb-1">Target Commencement Date</label>
                <input
                  id="generator_joining_date"
                  type="date"
                  required
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Reporting Lead Manager</label>
                <input
                  id="generator_reporting_manager"
                  type="text"
                  required
                  value={reportingManager}
                  onChange={(e) => setReportingManager(e.target.value)}
                  placeholder="Sarah Jenkins, VP"
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-220 focus:outline-none focus:border-violet-500 transition-all font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans text-left">
              <div>
                <label className="block text-slate-500 mb-1">Employ Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-205 focus:outline-none focus:border-violet-500 cursor-pointer font-sans"
                >
                  <option value="Full-time">Full-time (FT)</option>
                  <option value="Part-time">Part-time (PT)</option>
                  <option value="Contract">Contract (C2C)</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Employer Brand Logo name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Legal Entity"
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-202 focus:outline-none focus:border-violet-500 font-sans"
                />
              </div>
            </div>

            <div className="text-xs text-left">
              <label className="block text-slate-500 mb-1">Target Package Benefits listing</label>
              <textarea
                id="generator_benefits"
                rows={3}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="List wellness subscriptions, dental benefits, unvested performance options, parent leaves..."
                className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-220 focus:outline-none focus:border-violet-500 text-[10.5px] font-sans"
              />
            </div>

            <div className="text-xs text-left">
              <label className="block text-slate-500 mb-1">Special Legal terms and non-competition rules</label>
              <textarea
                id="generator_terms"
                rows={3}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="In accordance with NDA agreements, conflict rules apply."
                className="w-full bg-[#0a0a0c] border border-slate-800 rounded-xl p-2.5 text-slate-220 focus:outline-none focus:border-violet-500 text-[10.5px] font-sans"
              />
            </div>
          </div>

        </div>

        {/* Right Side: Document Print & PDF preview mockup paper element */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
          <div className="flex justify-between items-center bg-[#0f0f12] border border-slate-800 rounded-xl py-2.5 px-4 shadow no-print">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-sans">A4 Standard Preview Resolution (595x842 pt)</span>
            <span className="text-[10px] text-violet-400 font-mono font-bold uppercase tracking-wider">Preserves Original Colors</span>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-850 rounded-2xl overflow-x-auto">
            
            {/* The Document Element rendered in crisp original A4 paper simulation */}
            <div 
              id="offer_letter_render_a4"
              className="bg-white text-slate-900 w-full max-w-[595px] min-h-[842px] mx-auto p-12 paper-container relative space-y-6"
              style={{ 
                fontFamily: activeTemplate.fontFamily === 'JetBrains Mono' ? 'monospace' : 'sans-serif', 
                fontSize: activeTemplate.fontSize,
                backgroundColor: activeTemplate.themeColors?.background || '#ffffff'
              }}
            >
              
              {/* Header Letterhead */}
              {activeTemplate.visibilityControls.showHeader && (
                <div className="border-b border-slate-200 pb-3 text-[10px] text-slate-500 whitespace-pre-wrap font-mono uppercase leading-relaxed tracking-wider">
                  {activeTemplate.header}
                </div>
              )}

              {/* Logo display */}
              {activeTemplate.visibilityControls.showLogo && (
                <div className="flex items-center gap-1.5 py-1 text-slate-900 font-bold text-xs" style={{ color: activeTemplate.themeColors?.primary || '#1e3a8a' }}>
                  <div className="h-5 w-5 rounded bg-violet-600 flex items-center justify-center text-[10px] text-white font-black" style={{ backgroundColor: activeTemplate.themeColors?.primary || '#7c3aed' }}>
                    {companyName.charAt(0) || 'N'}
                  </div>
                  {companyName}
                </div>
              )}

              {/* Dynamic Substituted Text Content */}
              <div 
                id="compiled_text_content" 
                className="text-xs whitespace-pre-wrap leading-relaxed py-2 text-slate-800 space-y-3"
                style={{ color: activeTemplate.themeColors?.text || '#1e293b' }}
              >
                {compiledBodyText()}
              </div>

              {/* Benefits Subsection in structured list if written */}
              {benefits && (
                <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[10.5px]">
                  <span className="font-extrabold text-[9.5px] text-slate-700 block uppercase mb-1">RECOGNIZED BENEFITS & BONUSES PACKAGE</span>
                  <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">{benefits}</div>
                </div>
              )}

              {/* Terms Section */}
              {activeTemplate.visibilityControls.showTerms && terms && (
                <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[10px] italic text-slate-600 leading-normal">
                  <span className="font-bold text-[9.5px] text-slate-700 block not-italic uppercase mb-1.5">LEGAL CONTRACT SLATE COVENANTS</span>
                  {terms}
                </div>
              )}

              {/* Signature lines list */}
              {activeTemplate.visibilityControls.showSignatures && (
                <div className="grid grid-cols-2 gap-8 pt-8">
                  {activeTemplate.signatureBlocks.map((sig, i) => {
                    const mappedName = sig.name === '{{CandidateName}}' ? candidateName : sig.name;
                    return (
                      <div key={i} className="border-t border-slate-300 pt-2 text-[10px] text-slate-500 text-left">
                        <span className="block font-semibold text-slate-800">{mappedName || 'Signee Name'}</span>
                        <span className="block">{sig.title}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footnote meta block */}
              {activeTemplate.visibilityControls.showFooter && (
                <div className="border-t border-slate-100 pt-3 text-[9px] text-slate-400 text-center uppercase tracking-wide">
                  {activeTemplate.footer}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
