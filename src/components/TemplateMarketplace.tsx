/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  BookOpen, 
  ArrowUpRight, 
  Layers, 
  FileText, 
  Check, 
  Tag, 
  Eye, 
  ChevronRight,
  Settings,
  Flame,
  Layout,
  Briefcase
} from 'lucide-react';
import { Template, TemplateCategory, TemplateStyle } from '../types';

interface TemplateMarketplaceProps {
  templates: Template[];
  onSelectTemplateForGenerator: (template: Template) => void;
  onSelectTemplateForEditor: (template: Template) => void;
}

export default function TemplateMarketplace({
  templates,
  onSelectTemplateForGenerator,
  onSelectTemplateForEditor
}: TemplateMarketplaceProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Categories list
  const categories: string[] = [
    'All', 'Professional', 'Corporate', 'Executive', 'Technology', 
    'Healthcare', 'Finance', 'Education', 'Startup'
  ];

  // Styles list
  const styles: string[] = [
    'All', 'Classic', 'Modern', 'Minimalist', 'Elegant', 'Casual', 'Tech-Bold'
  ];

  // Processed filtered templates list
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.style.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' ? true : t.category === selectedCategory;
      const matchesStyle = selectedStyle === 'All' ? true : t.style === selectedStyle;

      return matchesSearch && matchesCategory && matchesStyle;
    });
  }, [templates, search, selectedCategory, selectedStyle]);

  return (
    <div id="templates_marketplace_panel" className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-100 font-sans selection:bg-violet-650 selection:text-white">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="text-violet-400 w-8 h-8" />
            Template Marketplace
          </h1>
          <p className="text-sm text-slate-400 mt-1">Browse and launch 38 premium pre-designed templates matching specific industries and style preferences.</p>
        </div>

        <div className="text-xs bg-[#0f0f12] border border-slate-800 rounded-xl py-2 px-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>Database Integrity: <strong className="text-violet-400 font-mono">38 Templates Seeded</strong></span>
        </div>
      </div>

      {/* Grid Multi-Filters */}
      <div className="space-y-4 bg-[#0f0f12] border border-slate-800 p-5 rounded-2xl shadow-lg">
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            id="template_marketplace_search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by title, technology, executive, startup..."
            className="w-full bg-[#0a0a0c] border border-slate-800 pl-10 pr-4 py-2.5 text-xs rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Row 2: Category Switches & Style Switches */}
        <div className="flex flex-col gap-4 pt-1">
          {/* Category Badges horizontal scroll */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Category Sector</span>
            <div className="flex flex-wrap gap-1.5 custom-scrollbar overflow-x-auto pb-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                      isActive 
                        ? 'bg-violet-600 text-white shadow-md' 
                        : 'bg-[#0a0a0c] text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Category Badges */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Styling Vibe</span>
            <div className="flex flex-wrap gap-1.5">
              {styles.map((st) => {
                const isActive = selectedStyle === st;
                return (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                      isActive 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-[#0a0a0c] text-slate-500 border border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Grid Marketplace */}
      <div id="marketplace_grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((temp) => (
          <div 
            key={temp.id}
            id={`temp_card_${temp.id}`}
            className="group bg-[#0f0f12] border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-violet-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Header Thumbnail simulation */}
            <div className={`p-5 bg-gradient-to-br ${temp.thumbnailColor?.replace('indigo-950', 'violet-950') || 'from-slate-800 to-violet-950'} h-32 relative flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 bg-slate-950/65 backdrop-blur-sm text-[9px] font-bold tracking-wider rounded text-violet-350 uppercase">
                  {temp.style}
                </span>

                <span className="text-[8px] text-slate-400 font-mono">
                  {temp.createdDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-350/85 uppercase tracking-widest font-mono block text-left">Corporate Formal</span>
                <h3 className="text-sm font-bold text-white group-hover:text-violet-200 transition-colors truncate text-left">{temp.name}</h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-405 line-clamp-3 leading-relaxed text-left">
                {temp.bodyContent.replace(/\{\{[^}]+\}\}/g, '___')}
              </p>

              {/* Badges details block */}
              <div className="flex flex-wrap gap-2 text-[10px]">
                <span className="px-2 py-1 bg-[#0a0a0c] text-slate-400 border border-slate-800 rounded-lg flex items-center gap-1">
                  <Tag className="w-3 h-3 text-violet-400" />
                  {temp.category}
                </span>
                
                <span className="px-2 py-1 bg-[#0a0a0c] text-slate-400 border border-slate-800 rounded-lg flex items-center gap-1 font-mono">
                  <Layout className="w-3 h-3 text-teal-400" />
                  {temp.fontFamily} ({temp.fontSize})
                </span>
              </div>
            </div>

            {/* Footer triggers */}
            <div className="p-4 bg-[#0a0a0c] border-t border-slate-800/80 flex gap-2">
              <button
                id={`temp_preview_trigger_${temp.id}`}
                onClick={() => setPreviewTemplate(temp)}
                className="p-2 bg-[#0f0f12] border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
                title="Observe Details"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                id={`temp_to_edit_${temp.id}`}
                onClick={() => onSelectTemplateForEditor(temp)}
                className="grow text-center text-[11px] font-semibold bg-[#0f0f12] hover:bg-slate-800 text-slate-300 border border-slate-800 py-2  rounded-xl transition hover:text-violet-400 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                Customize Editor
              </button>

              <button
                id={`temp_to_gen_${temp.id}`}
                onClick={() => onSelectTemplateForGenerator(temp)}
                className="px-3.5 py-2 bg-violet-600 hover:bg-violet-550 rounded-xl text-white font-bold text-[11px] text-center transition flex items-center gap-1 cursor-pointer"
              >
                Launch
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Preview detailed flyout overlay */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-[#060608]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-[#0f0f12] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className={`p-6 bg-gradient-to-br ${previewTemplate.thumbnailColor?.replace('indigo-950', 'violet-950') || 'from-slate-800 to-violet-950'} text-white flex justify-between items-start`}>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">Premium Draft Metadata</span>
                <h3 className="text-xl font-extrabold text-white text-left">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-300 mt-1 text-left">Vibe: {previewTemplate.style} style template • Category: {previewTemplate.category}</p>
              </div>
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="px-2 py-1 bg-slate-950/40 backdrop-blur-md hover:bg-[#0a0a0c]/85 rounded-xl text-white text-xs select-none cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Paper Preview simulation core */}
            <div className="p-6 overflow-y-auto bg-slate-950/40 custom-scrollbar flex-1 space-y-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono text-left">Simulated Letter Print Preview</span>
              
              <div 
                className="bg-white text-slate-900 p-8 rounded-lg shadow-xl space-y-4 max-w-lg mx-auto"
                style={{ fontFamily: previewTemplate.fontFamily === 'JetBrains Mono' ? 'monospace' : 'sans-serif', fontSize: previewTemplate.fontSize }}
              >
                {/* Simulated Header */}
                {previewTemplate.visibilityControls.showHeader && (
                  <div className="border-b-2 border-slate-100 pb-3 text-[10px] text-slate-500 whitespace-pre-wrap font-mono uppercase text-left">
                    {previewTemplate.header}
                  </div>
                )}

                {/* Company Name / Logo */}
                {previewTemplate.visibilityControls.showLogo && (
                  <div className="flex items-center gap-2 py-1 text-slate-800 font-bold tracking-tight text-xs text-left">
                    <span className="h-5 w-5 bg-violet-650 rounded flex items-center justify-center text-[10px] text-white">N</span>
                    {previewTemplate.companyName}
                  </div>
                )}

                {/* Body html simulator */}
                <div className="text-xs leading-relaxed whitespace-pre-wrap py-2 text-slate-850 text-left">
                  {previewTemplate.bodyContent.replace(/\{\{CandidateName\}\}/g, 'John Doe').replace(/\{\{Position\}\}/g, 'Senior Specialist').replace(/\{\{Salary\}\}/g, '$120,000 / year').replace(/\{\{JoiningDate\}\}/g, '2026-07-01').replace(/\{\{ReportingManager\}\}/g, 'Sarah Jenkins')}
                </div>

                {/* Terms and conditions */}
                {previewTemplate.visibilityControls.showTerms && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[10.5px] italic text-slate-600 leading-normal text-left">
                    <span className="font-bold text-[10px] text-slate-700 block not-italic uppercase mb-1">CONTRACTUAL COVENANTS & TERMS</span>
                    {previewTemplate.termsAndConditions}
                  </div>
                )}

                {/* Signature panels */}
                {previewTemplate.visibilityControls.showSignatures && (
                  <div className="grid grid-cols-2 gap-8 pt-6">
                    {previewTemplate.signatureBlocks.map((sig, i) => (
                      <div key={i} className="border-t border-slate-300 pt-2 text-[10px] text-slate-550 text-left">
                        <span className="block font-bold text-slate-850">{sig.name || 'Signee'}</span>
                        <span className="block">{sig.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer block */}
                {previewTemplate.visibilityControls.showFooter && (
                  <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 text-center uppercase">
                    {previewTemplate.footer}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="p-4 bg-[#0a0a0c] border-t border-slate-800 flex justify-end gap-3 no-print">
              <button
                onClick={() => { setPreviewTemplate(null); onSelectTemplateForEditor(previewTemplate); }}
                className="px-4 py-2 bg-[#0f0f12] hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-xs font-semibold cursor-pointer transition"
              >
                Customize layout inside Editor
              </button>
              
              <button
                id="template_preview_load_cta"
                onClick={() => { setPreviewTemplate(null); onSelectTemplateForGenerator(previewTemplate); }}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-550 rounded-xl text-white text-xs font-extrabold cursor-pointer transition"
              >
                Draft Offer with these credentials
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
