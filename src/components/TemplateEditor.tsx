/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Save, 
  Trash2, 
  Copy, 
  Layers, 
  Settings, 
  Layout, 
  Maximize2, 
  FileCheck, 
  RefreshCw, 
  Sliders, 
  Eye, 
  Palette, 
  Type, 
  Plus, 
  X,
  Sparkles
} from 'lucide-react';
import { Template, TemplateCategory, TemplateStyle } from '../types';

interface TemplateEditorProps {
  initialTemplatesList: Template[];
  onSaveTemplate: (template: Template) => void;
  onDeleteTemplate: (id: string) => void;
  selectedTemplateFromMarketplace: Template | null;
}

export default function TemplateEditor({
  initialTemplatesList,
  onSaveTemplate,
  onDeleteTemplate,
  selectedTemplateFromMarketplace
}: TemplateEditorProps) {
  
  // Track template being compiled
  const [currentTemplates, setCurrentTemplates] = useState<Template[]>(initialTemplatesList);
  const [activeTemplate, setActiveTemplate] = useState<Template>(initialTemplatesList[0]);

  // Handle outside change
  useEffect(() => {
    if (selectedTemplateFromMarketplace) {
      setActiveTemplate(selectedTemplateFromMarketplace);
    }
  }, [selectedTemplateFromMarketplace]);

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [autoSaveCounter, setAutoSaveCounter] = useState(0);

  // States for dynamic editor fields mapping
  const updateField = (field: keyof Template, value: any) => {
    const updated = { ...activeTemplate, [field]: value };
    setActiveTemplate(updated);
    triggerAutoSave(updated);
  };

  const updateVisibility = (key: keyof Template['visibilityControls'], val: boolean) => {
    const updated = {
      ...activeTemplate,
      visibilityControls: {
        ...activeTemplate.visibilityControls,
        [key]: val
      }
    };
    setActiveTemplate(updated);
    triggerAutoSave(updated);
  };

  const updateColors = (key: keyof Template['themeColors'], val: string) => {
    const updated = {
      ...activeTemplate,
      themeColors: {
        ...activeTemplate.themeColors,
        [key]: val
      }
    };
    setActiveTemplate(updated);
    triggerAutoSave(updated);
  };

  // Simulating auto-saving with debouncing
  const triggerAutoSave = (updatedTemp: Template) => {
    setIsAutoSaving(true);
    // Simulating writing to DB
    setTimeout(() => {
      setIsAutoSaving(false);
      setAutoSaveCounter(c => c + 1);
    }, 1500);
  };

  // Add a signature block to list
  const addSignatureBlock = () => {
    const currentSig = activeTemplate.signatureBlocks || [];
    if (currentSig.length >= 4) {
      alert('Maximum 4 signature blocks supported in A4 layout.');
      return;
    }
    const updated = [
      ...currentSig,
      { title: 'Corporate Witness Sign', name: 'John Hancock', showLine: true }
    ];
    updateField('signatureBlocks', updated);
  };

  // Modify individual signature block
  const modifySignatureBlock = (idx: number, key: 'title' | 'name', val: string) => {
    const updatedBlocks = [...activeTemplate.signatureBlocks];
    updatedBlocks[idx] = { ...updatedBlocks[idx], [key]: val };
    updateField('signatureBlocks', updatedBlocks);
  };

  // Delete signature block
  const deleteSignatureBlock = (idx: number) => {
    const updatedBlocks = activeTemplate.signatureBlocks.filter((_, i) => i !== idx);
    updateField('signatureBlocks', updatedBlocks);
  };

  // Save changes formally
  const handleSaveForm = () => {
    onSaveTemplate({
      ...activeTemplate,
      updatedDate: new Date().toISOString().split('T')[0]
    });
    alert(`Success! Template "${activeTemplate.name}" was written to persistent database schema!`);
  };

  // Duplicate active template as copy
  const handleDuplicate = () => {
    const dup: Template = {
      ...activeTemplate,
      id: `dyn_temp_${Date.now()}`,
      name: `${activeTemplate.name} Copy`,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    onSaveTemplate(dup);
    setActiveTemplate(dup);
    alert(`Duplicated active template successfully! "${dup.name}" is now loaded.`);
  };

  // Create a brand new empty canvas template
  const handleCreateNew = () => {
    const newTemp: Template = {
      id: `dyn_temp_${Date.now()}`,
      name: 'Untitled Canva Template Draft',
      category: 'Professional',
      style: 'Modern',
      thumbnailColor: 'from-slate-900 to-indigo-950',
      header: 'COMPILING INCORPORATED HEAD OFFICE\n12 Logistics Way, Suite 10\nSan Jose, CA 95001\ncontact@myfirm.com',
      companyName: 'Compiling Incorporated',
      bodyContent: 'Dear {{CandidateName}},\n\nOn behalf of {{CompanyName}}, we are pleased to present this job offer for {{Position}} in {{Department}}!\n\nYour compensation is calculated at {{Salary}} per annum, starting {{JoiningDate}}, reporting to {{ReportingManager}}.',
      termsAndConditions: 'All Intellectual Property rights created during execution belong fully to the corporate firm. Either Party may terminate standard at-will with 14 business days notice.',
      footer: 'CONFIDENTIAL CORPORATE SOLICITATION NOTICE',
      themeColors: {
        header: '#0f172a',
        text: '#1e293b',
        primary: '#4f46e5',
        background: '#ffffff'
      },
      fontFamily: 'Inter',
      fontSize: '11pt',
      signatureBlocks: [
        { title: 'Authorized Director', name: 'Authorized Officer', showLine: true },
        { title: 'Candidate Acceptee', name: '{{CandidateName}}', showLine: true }
      ],
      visibilityControls: {
        showHeader: true,
        showLogo: true,
        showTerms: true,
        showFooter: true,
        showSignatures: true
      },
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    onSaveTemplate(newTemp);
    setActiveTemplate(newTemp);
    alert(`Initiated fresh empty canvas draft!`);
  };

  return (
    <div id="canva_editor_panel" className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-100 font-sans selection:bg-violet-650 selection:text-white">
      
      {/* Title Header with status tracker */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Layout className="text-violet-400 w-8 h-8" />
            Canva Template Compiler
          </h1>
          <p className="text-sm text-slate-400 mt-1">Design company letterhead models with custom drag/visibility controllers, signature blocks, and global A4 branding.</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isAutoSaving ? (
            <span className="text-xs text-violet-400 flex items-center gap-1.5 bg-violet-950/40 border border-violet-900/30 px-3 py-1.5 rounded-lg font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Saves compiling...
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono">
              Auto Saved changes ({autoSaveCounter})
            </span>
          )}

          <button
            id="editor_create_new_btn"
            onClick={handleCreateNew}
            className="px-3.5 py-2 bg-[#0f0f12] hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition text-xs font-semibold cursor-pointer"
          >
            Create New Template
          </button>

          <button
            id="editor_save_btn"
            onClick={handleSaveForm}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-550 text-white font-bold rounded-xl transition flex items-center gap-2 text-xs shadow-lg cursor-pointer animate-pulse-subtle"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
        </div>
      </div>

      {/* Editor Workplace Layout: Splitted Side Panel Settings vs Simulated Print Canvas */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Dock Configuration panel */}
        <div className="lg:col-span-5 bg-[#0f0f12] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Template Selection / Metadata */}
          <div className="border-b border-slate-800 pb-5">
            <label className="block text-[10px] font-mono text-violet-400 uppercase tracking-widest mb-2 font-bold">Loaded Document Draft</label>
            <div className="flex gap-2">
              <input
                id="editor_name_input"
                type="text"
                value={activeTemplate.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Template Name"
                className="grow bg-[#0a0a0c] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500 font-bold"
              />
              <button
                id="editor_duplicate_btn"
                onClick={handleDuplicate}
                title="Duplicate Template Layout Structure"
                className="p-2 bg-[#0a0a0c] hover:bg-slate-800 text-violet-400 hover:text-violet-300 rounded-xl border border-slate-800 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-slate-500 text-[10px] uppercase mb-1 font-mono">Category Industry</label>
                <select
                  value={activeTemplate.category}
                  onChange={(e) => updateField('category', e.target.value as TemplateCategory)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-lg p-1.5 text-xs text-slate-350 cursor-pointer focus:border-violet-500 focus:outline-none"
                >
                  <option value="Professional">Professional</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Executive">Executive</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Startup">Startup</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] uppercase mb-1 font-mono">Styling Class</label>
                <select
                  value={activeTemplate.style}
                  onChange={(e) => updateField('style', e.target.value as TemplateStyle)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-lg p-1.5 text-xs text-slate-350 cursor-pointer focus:border-violet-500 focus:outline-none"
                >
                  <option value="Classic">Classic</option>
                  <option value="Modern">Modern</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Elegant">Elegant</option>
                  <option value="Casual">Casual</option>
                  <option value="Tech-Bold">Tech-Bold</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Layout & Typography controls sidebar */}
          <div className="border-b border-slate-800 pb-5">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1 font-bold">
              <Type className="w-3.5 h-3.5 text-violet-400" />
              Typography & Styles Layout
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Font Family</label>
                <select
                  value={activeTemplate.fontFamily}
                  onChange={(e) => updateField('fontFamily', e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-lg p-1.5 text-xs text-slate-205 cursor-pointer focus:border-violet-500 focus:outline-none"
                >
                  <option value="Inter">Inter (Sans-Serif)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
                  <option value="system-ui">System Default</option>
                  <option value="Georgia">Georgia (Serif Elegant)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Font Size</label>
                <select
                  value={activeTemplate.fontSize}
                  onChange={(e) => updateField('fontSize', e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-lg p-1.5 text-xs text-slate-205 cursor-pointer focus:border-violet-500 focus:outline-none"
                >
                  <option value="10pt">10pt (Compact)</option>
                  <option value="11pt">11pt (Recommended)</option>
                  <option value="12pt">12pt (Standard)</option>
                  <option value="14pt">14pt (Large)</option>
                </select>
              </div>
            </div>

            {/* Colors picker simulation */}
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeTemplate.themeColors.primary}
                    onChange={(e) => updateColors('primary', e.target.value)}
                    className="h-7 w-7 rounded bg-transparent border border-slate-800 cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-slate-400 uppercase">{activeTemplate.themeColors.primary}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Background Hue</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeTemplate.themeColors.background}
                    onChange={(e) => updateColors('background', e.target.value)}
                    className="h-7 w-7 rounded bg-transparent border border-slate-800 cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-slate-400">{activeTemplate.themeColors.background}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Visibility Controllers */}
          <div className="border-b border-slate-800 pb-5">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-bold">
              <Sliders className="w-3.5 h-3.5 text-violet-400" />
              Sec Visibility Toggle Switches
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-[#0a0a0c]/60 p-2 border border-slate-800 rounded-lg">
                <span className="text-slate-350">Company Header Meta block</span>
                <input
                  type="checkbox"
                  checked={activeTemplate.visibilityControls.showHeader}
                  onChange={(e) => updateVisibility('showHeader', e.target.checked)}
                  className="h-4 w-4 rounded text-violet-600 bg-[#0a0a0c] border-slate-800 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center bg-[#0a0a0c]/60 p-2 border border-slate-800 rounded-lg">
                <span className="text-slate-350">Brand Company Logo</span>
                <input
                  type="checkbox"
                  checked={activeTemplate.visibilityControls.showLogo}
                  onChange={(e) => updateVisibility('showLogo', e.target.checked)}
                  className="h-4 w-4 rounded text-violet-600 bg-[#0a0a0c] border-slate-800 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center bg-[#0a0a0c]/60 p-2 border border-slate-800 rounded-lg">
                <span className="text-slate-350">Legal Terms covenants block</span>
                <input
                  type="checkbox"
                  checked={activeTemplate.visibilityControls.showTerms}
                  onChange={(e) => updateVisibility('showTerms', e.target.checked)}
                  className="h-4 w-4 rounded text-violet-600 bg-[#0a0a0c] border-slate-800 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center bg-[#0a0a0c]/60 p-2 border border-slate-800 rounded-lg">
                <span className="text-slate-350">Formal Page Footnotes</span>
                <input
                  type="checkbox"
                  checked={activeTemplate.visibilityControls.showFooter}
                  onChange={(e) => updateVisibility('showFooter', e.target.checked)}
                  className="h-4 w-4 rounded text-violet-600 bg-[#0a0a0c] border-slate-800 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center bg-[#0a0a0c]/60 p-2 border border-slate-800 rounded-lg">
                <span className="text-slate-350">Signature Blocks Board</span>
                <input
                  type="checkbox"
                  checked={activeTemplate.visibilityControls.showSignatures}
                  onChange={(e) => updateVisibility('showSignatures', e.target.checked)}
                  className="h-4 w-4 rounded text-violet-600 bg-[#0a0a0c] border-slate-800 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Text Elements Editor */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1 font-bold">
              <Type className="w-3.5 h-3.5 text-violet-400" />
              Content Parameters text editor
            </h4>

            {activeTemplate.visibilityControls.showHeader && (
              <div className="text-xs">
                <label className="block text-slate-500 mb-1">Company Letterhead Header Details</label>
                <textarea
                  id="editor_header_area"
                  rows={2}
                  value={activeTemplate.header}
                  onChange={(e) => updateField('header', e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-violet-500 text-[10.5px] font-mono resize-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Company legal name</label>
                <input
                  type="text"
                  value={activeTemplate.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div id="simulated_logo_uploader" className="text-left">
                <label className="block text-slate-500 mb-1">Branded Logo File</label>
                <button
                  type="button"
                  onClick={() => alert('Simulated Logo Selection successful! Vector parsed as letter asset.')}
                  className="w-full p-1.5 bg-[#0a0a0c] text-slate-400 hover:text-white rounded-lg border border-slate-800 transition text-[11px] truncate cursor-pointer"
                >
                  📁 select_firm_logo.png
                </button>
              </div>
            </div>

            <div className="text-xs text-left">
              <label className="block text-slate-500 mb-1.5 font-bold text-violet-300">Letter Main Body Content</label>
              <p className="text-[10px] text-slate-500 mb-1 mb-2 leading-relaxed">Use standard markdown parameters: <strong className="font-mono text-violet-400">{"{{CandidateName}}"}</strong>, <strong className="font-mono text-violet-400">{"{{Position}}"}</strong>, and <strong className="font-mono text-violet-400">{"{{Salary}}"}</strong> to support live mapping generators.</p>
              <textarea
                id="editor_body_area"
                rows={7}
                value={activeTemplate.bodyContent}
                onChange={(e) => updateField('bodyContent', e.target.value)}
                className="w-full bg-[#0a0a0c] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500 text-[11px] resize-y"
              />
            </div>

            {activeTemplate.visibilityControls.showTerms && (
              <div className="text-xs text-left">
                <label className="block text-slate-500 mb-1">Company Terms & Legal covenants</label>
                <textarea
                  id="editor_terms_area"
                  rows={3}
                  value={activeTemplate.termsAndConditions}
                  onChange={(e) => updateField('termsAndConditions', e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-violet-500 text-[10.5px] resize-none"
                />
              </div>
            )}

            {activeTemplate.visibilityControls.showFooter && (
              <div className="text-xs text-left">
                <label className="block text-slate-500 mb-1">Footer meta statement</label>
                <input
                  id="editor_footer_area"
                  type="text"
                  value={activeTemplate.footer}
                  onChange={(e) => updateField('footer', e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-violet-500 text-[10.5px]"
                />
              </div>
            )}

            {/* Signature Blocks management sidebar */}
            {activeTemplate.visibilityControls.showSignatures && (
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Signee Block Lines</span>
                  <button
                    type="button"
                    onClick={addSignatureBlock}
                    className="p-1 px-2 border border-slate-850 bg-[#0a0a0c] hover:bg-slate-800 text-[10px] text-violet-400 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3 h-3" /> Insert Block
                  </button>
                </div>

                <div className="space-y-2">
                  {(activeTemplate.signatureBlocks || []).map((sig, sIdx) => (
                    <div key={sIdx} className="p-2.5 bg-[#0a0a0c] rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-[10px] text-violet-300 font-mono text-left">Signee Line {sIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => deleteSignatureBlock(sIdx)}
                          className="text-rose-450 hover:text-rose-400 text-xs font-bold font-mono"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          required
                          value={sig.name}
                          onChange={(e) => modifySignatureBlock(sIdx, 'name', e.target.value)}
                          placeholder="Signee Name"
                          className="bg-[#0f0f12] border border-slate-800 rounded px-2 py-1 text-[10.5px] text-white focus:outline-none focus:border-violet-500"
                        />
                        <input
                          type="text"
                          required
                          value={sig.title}
                          onChange={(e) => modifySignatureBlock(sIdx, 'title', e.target.value)}
                          placeholder="E.g. Witness Director"
                          className="bg-[#0f0f12] border border-slate-800 rounded px-2 py-1 text-[10.5px] text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Canva Live Preview Canvas simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center bg-[#0f0f12] border border-slate-800 rounded-xl py-2.5 px-4 shadow-lg text-left">
            <span className="text-xs text-slate-400 flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5 text-violet-400" /> A4 Live Canvas preview</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
              Responsive Rendering
            </span>
          </div>

          {/* Paper Body */}
          <div className="p-6 bg-[#0a0a0c] border border-slate-800 rounded-2xl overflow-x-auto">
            
            <div 
              id="live_compiled_a4_paper"
              className="bg-white text-slate-900 w-full max-w-[595px] min-h-[842px] mx-auto p-12 paper-container relative font-sans text-xs space-y-6"
              style={{ 
                fontFamily: activeTemplate.fontFamily === 'JetBrains Mono' ? 'monospace' : 'sans-serif', 
                fontSize: activeTemplate.fontSize,
                backgroundColor: activeTemplate.themeColors.background
              }}
            >
              {/* Header Letterhead rendering if allowed */}
              {activeTemplate.visibilityControls.showHeader && (
                <div className="border-b border-slate-200 pb-3 text-[10px] text-slate-500 whitespace-pre-wrap font-mono uppercase leading-normal tracking-wide text-left">
                  {activeTemplate.header}
                </div>
              )}

              {/* Company Logo and Name */}
              {activeTemplate.visibilityControls.showLogo && (
                <div className="flex items-center gap-2 py-1 text-slate-900 font-bold text-sm text-left" style={{ color: activeTemplate.themeColors.primary }}>
                  <div className="h-6 w-6 rounded bg-violet-600 flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: activeTemplate.themeColors.primary }}>
                    {activeTemplate.companyName.charAt(0) || 'N'}
                  </div>
                  {activeTemplate.companyName}
                </div>
              )}

              {/* Main Text Content */}
              <div className="text-xs whitespace-pre-wrap leading-relaxed py-4 text-slate-800 space-y-4 text-left" style={{ color: activeTemplate.themeColors.text }}>
                {activeTemplate.bodyContent.replace(/\{\{CandidateName\}\}/g, 'Arthur Dent').replace(/\{\{Position\}\}/g, 'Senior Galactic Consultant').replace(/\{\{Salary\}\}/g, '$142,000 / year').replace(/\{\{JoiningDate\}\}/g, '2026-07-01').replace(/\{\{ReportingManager\}\}/g, 'Ford Prefect').replace(/\{\{CompanyName\}\}/g, activeTemplate.companyName).replace(/\{\{Department\}\}/g, activeTemplate.category)}
              </div>

              {/* Legal Covenants section */}
              {activeTemplate.visibilityControls.showTerms && (
                <div className="p-4 bg-slate-50 rounded border border-slate-200 text-[10.5px] italic text-slate-600 leading-normal text-left">
                  <span className="font-extrabold text-[9.5px] text-slate-700 block not-italic uppercase mb-1.5 tracking-wider">STANDARD AGREEMENT TERMS & LIMITATIONS</span>
                  {activeTemplate.termsAndConditions}
                </div>
              )}

              {/* Signature Blocks rendering board */}
              {activeTemplate.visibilityControls.showSignatures && (
                <div className="grid grid-cols-2 gap-8 pt-12">
                  {(activeTemplate.signatureBlocks || []).map((sig, sIdx) => (
                    <div key={sIdx} className="border-t border-slate-300 pt-2 text-[10px] text-slate-500 text-left">
                      <span className="block font-black text-slate-800">{sig.name || 'Signee'}</span>
                      <span className="block">{sig.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footnotes statement block */}
              {activeTemplate.visibilityControls.showFooter && (
                <div className="absolute bottom-12 left-12 right-12 border-t border-slate-100 pt-3 text-[9px] text-slate-400 text-center uppercase tracking-wide">
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
