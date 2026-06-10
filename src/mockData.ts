/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  User, 
  Candidate, 
  Template, 
  OfferLetter, 
  Notification, 
  Activitylog, 
  CompanySettings,
  TemplateCategory,
  TemplateStyle
} from './types';

// Seeded Users (For Role-Based Switcher)
export const SEED_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@olms.com',
    role: 'HR Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_recruiter',
    name: 'Michael Chang',
    email: 'michael.chang@olms.com',
    role: 'Recruiter',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_manager',
    name: 'David Vance',
    email: 'david.vance@olms.com',
    role: 'Hiring Manager',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_employee',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    role: 'Employee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  }
];

// Seeded Candidates
export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'cand_1',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@outlook.com',
    phone: '+1 (555) 234-5678',
    position: 'Senior UI/UX Architect',
    department: 'Product Design',
    experience: 7,
    expectedSalary: '$140,000 / year',
    status: 'Offered',
    resume: 'Eleanor_Vance_Resume.pdf',
    createdDate: '2026-05-15'
  },
  {
    id: 'cand_2',
    name: 'Alex Rivera',
    email: 'alex.rivera@techmail.dev',
    phone: '+1 (555) 876-5432',
    position: 'Staff DevOps Engineer',
    department: 'Engineering',
    experience: 9,
    expectedSalary: '$185,000 / year',
    status: 'Interviewing',
    resume: 'Alex_Rivera_DevDevOps.pdf',
    createdDate: '2026-05-18'
  },
  {
    id: 'cand_3',
    name: 'Sophia Patel',
    email: 'sophia.patel@financegroup.com',
    phone: '+1 (555) 345-6789',
    position: 'Lead Financial Analyst',
    department: 'Finance',
    experience: 6,
    expectedSalary: '$125,000 / year',
    status: 'Accepted',
    resume: 'Sophia_Patel_Finance_Resume.pdf',
    createdDate: '2026-05-10'
  },
  {
    id: 'cand_4',
    name: 'Marcus Brody',
    email: 'm.brody@museumedu.org',
    phone: '+1 (555) 456-7890',
    position: 'Director of Education Programs',
    department: 'Education',
    experience: 12,
    expectedSalary: '$110,000 / year',
    status: 'Reviewing',
    resume: 'Marcus_Brody_Academic.pdf',
    createdDate: '2026-05-22'
  },
  {
    id: 'cand_5',
    name: 'Dr. Evelyn Reed',
    email: 'evelyn.reed@healthnet.org',
    phone: '+1 (555) 567-8901',
    position: 'Senior Clinical Specialist',
    department: 'Healthcare Operations',
    experience: 8,
    expectedSalary: '$160,000 / year',
    status: 'Applied',
    resume: 'Dr_Evelyn_Reed_MD_CV.pdf',
    createdDate: '2026-06-01'
  },
  {
    id: 'cand_6',
    name: 'Liam Neeson',
    email: 'liam.neeson@actionmail.kr',
    phone: '+1 (555) 999-1234',
    position: 'VP of Global Logistics',
    department: 'Operations',
    experience: 15,
    expectedSalary: '$220,000 / year',
    status: 'Offered',
    resume: 'Liam_Neeson_Tactical_Ops.pdf',
    createdDate: '2026-05-25'
  },
  {
    id: 'cand_7',
    name: 'Isabella Garcia',
    email: 'isabella.garcia@mediasolve.io',
    phone: '+1 (555) 678-9012',
    position: 'Growth Marketing Manager',
    department: 'Marketing',
    experience: 4,
    expectedSalary: '$95,000 / year',
    status: 'Interviewing',
    resume: 'Isabella_Garcia_Growth.pdf',
    createdDate: '2026-05-28'
  },
  {
    id: 'cand_8',
    name: 'Tyler Durden',
    email: 'tyler@soapcorp.biz',
    phone: '+1 (555) 000-0000',
    position: 'Chemical Safety Inspector',
    department: 'Quality Assurance',
    experience: 5,
    expectedSalary: '$85,000 / year',
    status: 'Rejected',
    resume: 'Durden_Tyler_SoapQA.pdf',
    createdDate: '2026-05-02'
  },
  {
    id: 'cand_9',
    name: 'Amara Okafor',
    email: 'amara.okafor@startupacademy.net',
    phone: '+1 (555) 789-0123',
    position: 'Founding Frontend Engineer',
    department: 'Engineering',
    experience: 3,
    expectedSalary: '$105,000 / year',
    status: 'Accepted',
    resume: 'Amara_Okafor_Frontend.pdf',
    createdDate: '2026-05-08'
  },
  {
    id: 'cand_10',
    name: 'Jonathan Creek',
    email: 'jonathan.creek@magicians.co.uk',
    phone: '+1 (555) 890-1234',
    position: 'Creative Solutions Manager',
    department: 'Product Development',
    experience: 10,
    expectedSalary: '$130,000 / year',
    status: 'Reviewing',
    resume: 'Creek_Jonathan_Creative.pdf',
    createdDate: '2026-06-05'
  }
];

// Helper to generate the exact 38 Templates with realistic structures programmatically
const generate38Templates = (): Template[] => {
  const categories: TemplateCategory[] = [
    'Professional', 'Corporate', 'Executive', 'Technology', 
    'Healthcare', 'Finance', 'Education', 'Startup'
  ];

  const styles: TemplateStyle[] = [
    'Classic', 'Modern', 'Minimalist', 'Elegant', 'Casual', 'Tech-Bold'
  ];

  const list: Template[] = [];

  // Seed details for specific roles to make the 38 templates feel premium and fully customized
  const rolesRegistry: {
    name: string;
    category: TemplateCategory;
    style: TemplateStyle;
    primaryColor: string; // Tailwind color hex code
    gradient: string; // CSS-like display color string
    body: string;
    terms: string;
  }[] = [
    {
      name: 'Executive Senior Director',
      category: 'Executive',
      style: 'Elegant',
      primaryColor: '#1e293b', // slate
      gradient: 'from-slate-900 to-indigo-950',
      body: 'Dear {{CandidateName}},\n\nOn behalf of NexuHR Solutions, we are absolutely thrilled to extend this formal offer of employment for the executive position of {{Position}} in our {{Department}} department. Reporting directly to the President and CEO, you will champion our strategic initiatives.\n\nYour annual starting salary will be {{Salary}}, payable in semi-monthly installments in accordance with our executives package. You will find that this executive tier boasts standard benefits including comprehensive health, equity performance stock units (PSUs), and un-capped wellness allowances.\n\nYour tentative start date will be set on {{JoiningDate}}, subject to the successful execution of our executive onboarding criteria.',
      terms: 'The Executive Employee agrees to a standard 18-month non-disclosure, intellectual property covenants, non-competition, and structured severance rules as outlined in Appendix A.'
    },
    {
      name: 'Full Stack Tech Lead',
      category: 'Technology',
      style: 'Tech-Bold',
      primaryColor: '#0f766e', // teal
      gradient: 'from-teal-950 to-emerald-950',
      body: 'Dear {{CandidateName}},\n\nWe are stoked to offer you the position of {{Position}} at NexuHR Solutions! Your outstanding dev background, systems expertise, and team leadership values blew us away during the technical evaluations.\n\nFor this technical tier, we are pleased to confirm a starting base remuneration of {{Salary}} per annum. You are also eligible for our Tech Team Performance Bonus and an initial grant of 5,000 company stock options vesting over 4 years.\n\nYour role will be housed in {{Department}}, reporting directly to {{ReportingManager}}. We hope you will log on and kick off with us starting {{JoiningDate}}.',
      terms: 'All intellectual properties produced, written, designed, or engineered during your course of employment remain the sole and exclusive property of NexuHR Solutions. Generous open-source contributions are governed by the Tech Council board.'
    },
    {
      name: 'Senior Clinical Specialist',
      category: 'Healthcare',
      style: 'Modern',
      primaryColor: '#0891b2', // cyan
      gradient: 'from-cyan-900 to-blue-950',
      body: 'Dear {{CandidateName}},\n\nNexuHR Health Network is pleased to formalize our offer for you to join us as {{Position}} in the {{Department}} division. We are deeply committed to leading with empathy, and we know your patient care standards align with this mission.\n\nYour starting compensation is structured at {{Salary}} per year. In addition to medical, dental, and vision insurance coverage, this clinical assignment includes specialized liability protection insurance, professional education allowances, and standard licensure renewal offsets.\n\nYour duties are expected to commence on {{JoiningDate}}, pending verification of clinical credentials.',
      terms: 'This clinical offer is contingent on maintaining active state licensure, CPR certifications, and compliance with our state medical regulatory guidelines and ethics guidelines.'
    },
    {
      name: 'Investment Banker Associate',
      category: 'Finance',
      style: 'Elegant',
      primaryColor: '#b45309', // amber
      gradient: 'from-amber-950 to-amber-900',
      body: 'Dear {{CandidateName}},\n\nWe are pleased to extend this offer of employment for the position of {{Position}} in our {{Department}} department. This position offers a remarkable pathway to contribute to our flagship portfolios.\n\nYour starting base salary will be {{Salary}} per annum, supplemented by our Tier-A Annual Advisory Performance Bonus. In addition, you will be enrolled in our Senior Retirement matching account (up to 8% matching), executive banking perks, and premium wellness facilities access.\n\nWe anticipate your formal joining date to be {{JoiningDate}}, reporting to {{ReportingManager}}.',
      terms: 'Employment at our banking institution is strictly contingent on a comprehensive financial credit check, compliance training completion, and adhesion to standard FINRA regulations.'
    },
    {
      name: 'Adjunct Professor Syllabus Design',
      category: 'Education',
      style: 'Classic',
      primaryColor: '#1e3a8a', // blue
      gradient: 'from-blue-900 to-violet-950',
      body: 'Dear {{CandidateName}},\n\nOn behalf of our Academic Council, I take great pleasure in offering you the appointment of {{Position}} in the department of {{Department}}. Your scholastic achievements make you an invaluable educator.\n\nYour compensation for this assignment will be established at {{Salary}}, paid in standard bi-weekly schedule. You will also enjoy complete access to educational resources, library databases, and state research grant platforms.\n\nTerm operations and class curriculum setups start on {{JoiningDate}} with academic orientation.',
      terms: 'This academic appointment is governed by the bylaws of our Board of Trustees and is active for the academic calendar year. Standard sabbatical criteria apply.'
    },
    {
      name: 'Founding Mobile Architect',
      category: 'Startup',
      style: 'Minimalist',
      primaryColor: '#be185d', // pink
      gradient: 'from-fuchsia-950 to-pink-950',
      body: 'Hi {{CandidateName}},\n\nWe are absolutely thrilled to extend this founding invite to join us as {{Position}}! This is an pivotal moment for our platform, and your engineering skills will shape the core codebase of how we grow.\n\nYour base salary is set at {{Salary}}, complemented by a founding equity stake of 1.5% in common stock. We operate with a high-trust culture, offering remote-first flexibility, customized home office hardware, and unlimited paid time off.\n\nLet\'s start this adventure on {{JoiningDate}}!',
      terms: 'Startup environments pivot fast! You agree to execute a high-degree of ownership, adapt to collaborative changes, and adhere to standard startup ethical intellectual property protection agreements.'
    },
    {
      name: 'Corporate Compliance Counsel',
      category: 'Corporate',
      style: 'Classic',
      primaryColor: '#365314', // lime/green
      gradient: 'from-zinc-900 to-stone-900',
      body: 'Dear {{CandidateName}},\n\nNexuHR Corporate Group is pleased to offer you the position of {{Position}} within our specialized {{Department}} division. Your legal expertise will solidify our governance standards.\n\nYour starting base salary is {{Salary}} per annum. You are eligible to participate in our corporate merit program, comprehensive corporate healthcare plans, 401(k) retirement schemes with 5% employer-matcher, and accrued paid vacation of 21 business days.\n\nYour first day will be {{JoiningDate}}.',
      terms: 'This offer is contingent upon passing background reference checks and signing the formal corporate operational compliance guidelines on your first morning.'
    },
    {
      name: 'Human Resources Consultant',
      category: 'Professional',
      style: 'Modern',
      primaryColor: '#6366f1', // indigo
      gradient: 'from-indigo-900 to-purple-950',
      body: 'Dear {{CandidateName}},\n\nWe are pleased to offer you the full-time position of {{Position}} inside our {{Department}} team. This department acts as the cultural engine of our firm.\n\nYour initial compensation will be {{Salary}} per year. Benefits package includes flexible medical options, educational resource reimbursements, annual performance evaluations, and structured modern parenting leaves.\n\nWe anticipate a starting date of {{JoiningDate}}, reporting to {{ReportingManager}}.',
      terms: 'Standard professional standards apply. This is an at-will contract which can be dissolved by either entity with a standard 30-day notice period.'
    }
  ];

  // Populate first 8 items with specific metadata
  for (let i = 0; i < rolesRegistry.length; i++) {
    const r = rolesRegistry[i];
    const id = `temp_${i + 1}`;
    list.push({
      id,
      name: `${r.name} Template`,
      category: r.category,
      style: r.style,
      thumbnailColor: r.gradient,
      header: `NEXUHR HR SOLUTIONS GROUP\n100 Enterprise Way, Suite 400\nSunnyvale, CA 94089\nwww.nexuhr.com`,
      companyName: 'NexuHR Solutions',
      bodyContent: r.body,
      termsAndConditions: r.terms,
      footer: `CONFIDENTIAL OFFER OF EMPLOYMENT\nPage 1 of 1 • NexuHR Solutions is an Equal Opportunity Employer.`,
      themeColors: {
        header: r.primaryColor,
        text: '#1e293b',
        primary: r.primaryColor,
        background: '#ffffff'
      },
      fontFamily: r.style === 'Tech-Bold' ? 'JetBrains Mono' : 'Inter',
      fontSize: '11pt',
      signatureBlocks: [
        { title: 'HR Authorized Director', name: 'Sarah Jenkins', showLine: true },
        { title: 'Candidate Acceptance Sign', name: '{{CandidateName}}', showLine: true }
      ],
      visibilityControls: {
        showHeader: true,
        showLogo: true,
        showTerms: true,
        showFooter: true,
        showSignatures: true
      },
      createdDate: '2026-03-01',
      updatedDate: '2026-05-18'
    });
  }

  // Programmatically generate remaining 30 templates to reach exactly 38 templates
  const adjectives = [
    'Associate', 'Senior', 'Lead', 'Principal', 'Managing', 'Junior', 'Staff', 
    'Global', 'Expert', 'Specialist', 'Director', 'Head of'
  ];
  const fields = [
    { title: 'Data Scientist', cat: 'Technology', style: 'Tech-Bold', color: '#10b981', gradient: 'from-emerald-900 to-stone-900' },
    { title: 'Operations Specialist', cat: 'Professional', style: 'Modern', color: '#4f46e5', gradient: 'from-indigo-950 to-slate-900' },
    { title: 'Marketing Coordinator', cat: 'Startup', style: 'Casual', color: '#ec4899', gradient: 'from-pink-900 to-rose-950' },
    { title: 'Product Manager', cat: 'Technology', style: 'Modern', color: '#06b6d4', gradient: 'from-sky-950 to-indigo-950' },
    { title: 'Registered Nurse Specialist', cat: 'Healthcare', style: 'Classic', color: '#14b8a6', gradient: 'from-teal-900 to-cyan-950' },
    { title: 'Financial Analyst', cat: 'Finance', style: 'Elegant', color: '#d97706', gradient: 'from-amber-900 to-stone-950' },
    { title: 'Academic Counselor', cat: 'Education', style: 'Classic', color: '#3b82f6', gradient: 'from-blue-950 to-zinc-900' },
    { title: 'Engineering Manager', cat: 'Technology', style: 'Modern', color: '#8b5cf6', gradient: 'from-violet-950 to-indigo-950' },
    { title: 'Content strategist', cat: 'Startup', style: 'Casual', color: '#f43f5e', gradient: 'from-red-950 to-fuchsia-950' },
    { title: 'Strategy Director', cat: 'Executive', style: 'Elegant', color: '#1e293b', gradient: 'from-slate-950 to-teal-950' }
  ];

  let tempCount = list.length; // starts at 8
  while (tempCount < 38) {
    const adj = adjectives[tempCount % adjectives.length];
    const field = fields[tempCount % fields.length];
    
    const id = `temp_${tempCount + 1}`;
    const name = `${adj} ${field.title} Template`;
    
    list.push({
      id,
      name,
      category: field.cat as TemplateCategory,
      style: field.style as TemplateStyle,
      thumbnailColor: field.gradient,
      header: `NEXUHR INDUSTRIES CORPORATE\n500 Innovation Blvd, Tower B\nSan Francisco, CA 94107\ninfo@nexuhr-industries.com`,
      companyName: 'NexuHR Industries',
      bodyContent: `Dear {{CandidateName}},\n\nOn behalf of NexuHR, we are very excited to welcome you into our team as ${adj} ${field.title}! We look forward to your impact on our ${field.cat} strategies.\n\nYour compensation package includes an annual salary of {{Salary}}, a flexible schedule in our {{Department}} department, and eligibility for full company health benefits and monthly wellness stipends.\n\nYour initial joining date is {{JoiningDate}}, reporting to {{ReportingManager}} as your manager.`,
      termsAndConditions: `This position is subject to completion of standard eligibility criteria, non-solicitation definitions, and verification of reference checks. Either party may end employment in accordance with policies.`,
      footer: `CONFIDENTIAL - FOR EMPLOYMENT DISCUSSION USE ONLY • NEXUHR INDUSTRIES 2026`,
      themeColors: {
        header: field.color,
        text: '#334155',
        primary: field.color,
        background: '#ffffff'
      },
      fontFamily: field.style === 'Tech-Bold' ? 'JetBrains Mono' : 'Inter',
      fontSize: '11pt',
      signatureBlocks: [
        { title: 'HR Manager Signature', name: 'Sarah Jenkins', showLine: true },
        { title: 'Candidate Acceptance Signature', name: '{{CandidateName}}', showLine: true }
      ],
      visibilityControls: {
        showHeader: true,
        showLogo: true,
        showTerms: true,
        showFooter: true,
        showSignatures: true
      },
      createdDate: '2026-04-12',
      updatedDate: '2026-06-02'
    });
    
    tempCount++;
  }

  return list;
};

export const SEED_TEMPLATES: Template[] = generate38Templates();

// Seeded Offer Letters
export const SEED_OFFER_LETTERS: OfferLetter[] = [
  {
    id: 'letter_1',
    candidateId: 'cand_1',
    candidateName: 'Eleanor Vance',
    candidateEmail: 'eleanor.vance@outlook.com',
    companyName: 'NexuHR Solutions',
    position: 'Senior UI/UX Architect',
    department: 'Product Design',
    salary: '$140,000 / year',
    joiningDate: '2026-07-01',
    reportingManager: 'David Vance',
    employmentType: 'Full-time',
    benefits: 'Comprehensive Premium Health Insurance, 4 weeks Paid Time Off, $100/mo wellness subscription, 401(k) with 5% corporate match, hybrid office allowance.',
    termsAndConditions: 'The Senior Employee agrees to a standard 12-month intellectual property assignment, confidentiality covenants, and non-competition requirements as outlined in our handbook.',
    status: 'Draft',
    templateId: 'temp_1',
    header: 'NEXUHR HR SOLUTIONS GROUP\n100 Enterprise Way, Suite 400\nSunnyvale, CA 94089\nwww.nexuhr.com',
    bodyContent: 'Dear Eleanor Vance,\n\nOn behalf of NexuHR Solutions, we are absolutely thrilled to extend this formal offer of employment for the executive position of Senior UI/UX Architect in our Product Design department. Reporting directly to the President and CEO, you will champion our strategic initiatives.\n\nYour annual starting salary will be $140,000 / year, payable in semi-monthly installments in accordance with our executives package. You will find that this executive tier boasts standard benefits including comprehensive health, equity performance stock units (PSUs), and un-capped wellness allowances.\n\nYour tentative start date will be set on 2026-07-01, subject to the successful execution of our executive onboarding criteria.',
    footer: 'CONFIDENTIAL OFFER OF EMPLOYMENT\nPage 1 of 1 • NexuHR Solutions is an Equal Opportunity Employer.',
    fontFamily: 'Inter',
    fontSize: '11pt',
    themeColors: {
      header: '#1e293b',
      text: '#1e293b',
      primary: '#1e293b',
      background: '#ffffff'
    },
    signatureBlocks: [
      { title: 'HR Authorized Director', name: 'Sarah Jenkins' },
      { title: 'Candidate Acceptance Sign', name: 'Eleanor Vance' }
    ],
    visibilityControls: {
      showHeader: true,
      showLogo: true,
      showTerms: true,
      showFooter: true,
      showSignatures: true
    },
    createdDate: '2026-05-16',
    updatedDate: '2026-05-16',
    history: [
      {
        id: 'hist_1',
        step: 'Recruiter',
        action: 'Created',
        actorName: 'Michael Chang',
        actorRole: 'Recruiter',
        comments: 'Drafting initial architect letter based on interview notes. High expectations!',
        timestamp: '2026-05-16T10:00:00Z'
      }
    ]
  },
  {
    id: 'letter_2',
    candidateId: 'cand_3',
    candidateName: 'Sophia Patel',
    candidateEmail: 'sophia.patel@financegroup.com',
    companyName: 'NexuHR Solutions',
    position: 'Lead Financial Analyst',
    department: 'Finance',
    salary: '$125,000 / year',
    joiningDate: '2026-06-25',
    reportingManager: 'David Vance',
    employmentType: 'Full-time',
    benefits: 'Prestige Banking access, 10% annual advisory performance bonuses, 8% company 401(k) matching program, full platinum medical package.',
    termsAndConditions: 'Employment at our banking institution is strictly contingent on a comprehensive financial credit check, regulatory compliance clearance, and standard FINRA regulations.',
    status: 'Accepted',
    templateId: 'temp_4',
    header: 'NEXUHR HR SOLUTIONS GROUP\n100 Enterprise Way, Suite 400\nSunnyvale, CA 94089\nwww.nexuhr.com',
    bodyContent: 'Dear Sophia Patel,\n\nWe are pleased to extend this offer of employment for the position of Lead Financial Analyst in our Finance department. This position offers a remarkable pathway to contribute to our flagship portfolios.\n\nYour starting base salary will be $125,000 / year, supplemented by our Tier-A Annual Advisory Performance Bonus. In addition, you will be enrolled in our Senior Retirement matching account (up to 8% matching), executive banking perks, and premium wellness facilities access.\n\nWe anticipate your formal joining date to be 2026-06-25, reporting to David Vance.',
    footer: 'CONFIDENTIAL OFFER OF EMPLOYMENT\nPage 1 of 1 • NexuHR Solutions is an Equal Opportunity Employer.',
    fontFamily: 'Inter',
    fontSize: '11pt',
    themeColors: {
      header: '#b45309',
      text: '#1e293b',
      primary: '#b45309',
      background: '#ffffff'
    },
    signatureBlocks: [
      { title: 'HR Authorized Director', name: 'Sarah Jenkins', signatureData: 'Sarah Jenkins Signature', signedAt: '2026-05-11 14:00' },
      { title: 'Candidate Acceptance Sign', name: 'Sophia Patel', signatureData: 'Sophia Patel Signed', signedAt: '2026-05-13 09:44' }
    ],
    visibilityControls: {
      showHeader: true,
      showLogo: true,
      showTerms: true,
      showFooter: true,
      showSignatures: true
    },
    createdDate: '2026-05-11',
    updatedDate: '2026-05-13',
    history: [
      {
        id: 'hist_2',
        step: 'Recruiter',
        action: 'Created',
        actorName: 'Michael Chang',
        actorRole: 'Recruiter',
        comments: 'Created for financial advisor lead role.',
        timestamp: '2026-05-11T09:30:00Z'
      },
      {
        id: 'hist_3',
        step: 'Hiring Manager',
        action: 'Approved',
        actorName: 'David Vance',
        actorRole: 'Hiring Manager',
        comments: 'Excellent numbers. Fits budget.',
        timestamp: '2026-05-11T12:15:00Z'
      },
      {
        id: 'hist_4',
        step: 'HR Admin',
        action: 'Approved',
        actorName: 'Sarah Jenkins',
        actorRole: 'HR Admin',
        comments: 'Approved and issued to candidate.',
        timestamp: '2026-05-11T14:00:00Z'
      },
      {
        id: 'hist_5',
        step: 'Final',
        action: 'Sent',
        actorName: 'Michael Chang',
        actorRole: 'Recruiter',
        comments: 'Email transmitted to Candidate.',
        timestamp: '2026-05-11T14:10:00Z'
      },
      {
        id: 'hist_6',
        step: 'Final',
        action: 'Approved',
        actorName: 'Sophia Patel',
        actorRole: 'Employee',
        comments: 'Signed! Thrilled to join the flagship team.',
        timestamp: '2026-05-13T09:44:00Z'
      }
    ]
  },
  {
    id: 'letter_3',
    candidateId: 'cand_6',
    candidateName: 'Liam Neeson',
    candidateEmail: 'liam.neeson@actionmail.kr',
    companyName: 'NexuHR Solutions',
    position: 'VP of Global Logistics',
    department: 'Operations',
    salary: '$220,000 / year',
    joiningDate: '2026-07-15',
    reportingManager: 'David Vance',
    employmentType: 'Full-time',
    benefits: 'Comprehensive Global Executive Perks, Unlimited Travel stipends, Tier 1 Executive Health coverage, performance equity shares.',
    termsAndConditions: 'Executive covenants on conflict-of-interest, data protection, global delivery tracking compliance standards apply.',
    status: 'Pending Hiring Manager Approval',
    templateId: 'temp_1',
    header: 'NEXUHR HR SOLUTIONS GROUP\n100 Enterprise Way, Suite 400\nSunnyvale, CA 94089\nwww.nexuhr.com',
    bodyContent: 'Dear Liam Neeson,\n\nOn behalf of NexuHR Solutions, we are absolutely thrilled to extend this formal offer of employment for the executive position of VP of Global Logistics in our Operations department. Reporting directly to David Vance, you will champion our strategic initiatives.\n\nYour annual starting salary will be $220,000 / year, payable in semi-monthly installments in accordance with our executives package. You will find that this executive tier boasts standard benefits including comprehensive health, equity performance stock units (PSUs), and un-capped wellness allowances.\n\nYour tentative start date will be set on 2026-07-15, subject to the successful execution of our executive onboarding criteria.',
    footer: 'CONFIDENTIAL OFFER OF EMPLOYMENT\nPage 1 of 1 • NexuHR Solutions is an Equal Opportunity Employer.',
    fontFamily: 'Inter',
    fontSize: '11pt',
    themeColors: {
      header: '#1e293b',
      text: '#1e293b',
      primary: '#1e293b',
      background: '#ffffff'
    },
    signatureBlocks: [
      { title: 'HR Authorized Director', name: 'Sarah Jenkins' },
      { title: 'Candidate Acceptance Sign', name: 'Liam Neeson' }
    ],
    visibilityControls: {
      showHeader: true,
      showLogo: true,
      showTerms: true,
      showFooter: true,
      showSignatures: true
    },
    createdDate: '2026-05-26',
    updatedDate: '2026-05-26',
    history: [
      {
        id: 'hist_7',
        step: 'Recruiter',
        action: 'Created',
        actorName: 'Michael Chang',
        actorRole: 'Recruiter',
        comments: 'Drafted and sent up for hiring manager review.',
        timestamp: '2026-05-26T16:20:00Z'
      }
    ]
  },
  {
    id: 'letter_4',
    candidateId: 'cand_9',
    candidateName: 'Amara Okafor',
    candidateEmail: 'amara.okafor@startupacademy.net',
    companyName: 'NexuHR Solutions',
    position: 'Founding Frontend Engineer',
    department: 'Engineering',
    salary: '$105,000 / year',
    joiningDate: '2026-06-20',
    reportingManager: 'David Vance',
    employmentType: 'Full-time',
    benefits: '1.5% founding equity shares pool vesting over 3 years, remote-first laptop allowance, healthcare stipends.',
    termsAndConditions: 'Standard rapid-scale IP transfer agreements, 3-month probation verification.',
    status: 'Sent',
    templateId: 'temp_6',
    header: 'NEXUHR HR SOLUTIONS GROUP\n100 Enterprise Way, Suite 400\nSunnyvale, CA 94089\nwww.nexuhr.com',
    bodyContent: 'Hi Amara Okafor,\n\nWe are absolutely thrilled to extend this founding invite to join us as Founding Frontend Engineer! This is an pivotal moment for our platform, and your engineering skills will shape the core codebase of how we grow.\n\nYour base salary is set at $105,000 / year, complemented by a founding equity stake of 1.5% in common stock. We operate with a high-trust culture, offering remote-first flexibility, customized home office hardware, and unlimited paid time off.\n\nLet\'s start this adventure on 2026-06-20!',
    footer: 'CONFIDENTIAL OFFER OF EMPLOYMENT\nPage 1 of 1 • NexuHR Solutions is an Equal Opportunity Employer.',
    fontFamily: 'Inter',
    fontSize: '11pt',
    themeColors: {
      header: '#be185d',
      text: '#1e293b',
      primary: '#be185d',
      background: '#ffffff'
    },
    signatureBlocks: [
      { title: 'HR Authorized Director', name: 'Sarah Jenkins', signatureData: 'Sarah Jenkins Signed', signedAt: '2026-05-10 11:30' },
      { title: 'Candidate Acceptance Sign', name: 'Amara Okafor' }
    ],
    visibilityControls: {
      showHeader: true,
      showLogo: true,
      showTerms: true,
      showFooter: true,
      showSignatures: true
    },
    createdDate: '2026-05-09',
    updatedDate: '2026-05-10',
    history: [
      {
        id: 'hist_8',
        step: 'Recruiter',
        action: 'Created',
        actorName: 'Michael Chang',
        actorRole: 'Recruiter',
        comments: 'Founding member offer compiled.',
        timestamp: '2026-05-09T11:00:00Z'
      },
      {
        id: 'hist_9',
        step: 'Hiring Manager',
        action: 'Approved',
        actorName: 'David Vance',
        actorRole: 'Hiring Manager',
        comments: 'Yes! Urgent hire to finish React components.',
        timestamp: '2026-05-09T14:30:00Z'
      },
      {
        id: 'hist_10',
        step: 'HR Admin',
        action: 'Approved',
        actorName: 'Sarah Jenkins',
        actorRole: 'HR Admin',
        comments: 'Authorized.',
        timestamp: '2026-05-10T11:30:00Z'
      },
      {
        id: 'hist_11',
        step: 'Final',
        action: 'Sent',
        actorName: 'Michael Chang',
        actorRole: 'Recruiter',
        comments: 'Dispatched to candidate for online feedback.',
        timestamp: '2026-05-10T12:00:00Z'
      }
    ]
  },
  {
    id: 'letter_5',
    candidateId: 'cand_2',
    candidateName: 'Alex Rivera',
    candidateEmail: 'alex.rivera@techmail.dev',
    companyName: 'NexuHR Solutions',
    position: 'Staff DevOps Engineer',
    department: 'Engineering',
    salary: '$185,000 / year',
    joiningDate: '2026-07-10',
    reportingManager: 'David Vance',
    employmentType: 'Full-time',
    benefits: 'Comprehensive standard health package, technical gear and computing allowance, travel stipends, hybrid schedules.',
    termsAndConditions: 'All standard intellectual properties belong fully and completely to NexuHR Solutions.',
    status: 'Changes Requested',
    templateId: 'temp_2',
    header: 'NEXUHR HR SOLUTIONS GROUP\n100 Enterprise Way, Suite 400\nSunnyvale, CA 94089\nwww.nexuhr.com',
    bodyContent: 'Dear Alex Rivera,\n\nWe are stoked to offer you the position of Staff DevOps Engineer at NexuHR Solutions! Your outstanding dev background, systems expertise, and team leadership values blew us away during the technical evaluations.\n\nFor this technical tier, we are pleased to confirm a starting base remuneration of $185,000 / year per annum. You are also eligible for our Tech Team Performance Bonus and an initial grant of 5,000 company stock options vesting over 4 years.\n\nYour role will be housed in Engineering, reporting directly to David Vance. We hope you will log on and kick off with us starting 2026-07-10.',
    footer: 'CONFIDENTIAL OFFER OF EMPLOYMENT\nPage 1 of 1 • NexuHR Solutions is an Equal Opportunity Employer.',
    fontFamily: 'JetBrains Mono',
    fontSize: '11pt',
    themeColors: {
      header: '#0f766e',
      text: '#1e293b',
      primary: '#0f766e',
      background: '#ffffff'
    },
    signatureBlocks: [
      { title: 'HR Authorized Director', name: 'Sarah Jenkins' },
      { title: 'Candidate Acceptance Sign', name: 'Alex Rivera' }
    ],
    visibilityControls: {
      showHeader: true,
      showLogo: true,
      showTerms: true,
      showFooter: true,
      showSignatures: true
    },
    createdDate: '2026-05-19',
    updatedDate: '2026-05-20',
    history: [
      {
        id: 'hist_12',
        step: 'Recruiter',
        action: 'Created',
        actorName: 'Michael Chang',
        actorRole: 'Recruiter',
        comments: 'DevOps lead role draft.',
        timestamp: '2026-05-19T10:00:00Z'
      },
      {
        id: 'hist_13',
        step: 'Hiring Manager',
        action: 'Changes Requested',
        actorName: 'David Vance',
        actorRole: 'Hiring Manager',
        comments: 'We agreed to add $10,000 key signing bonus! Please adjust salary or add a specific signing bonus line in benefits.',
        timestamp: '2026-05-20T09:12:00Z'
      }
    ]
  },
  {
    id: 'letter_6',
    candidateId: 'cand_7',
    candidateName: 'Isabella Garcia',
    candidateEmail: 'isabella.garcia@mediasolve.io',
    companyName: 'NexuHR Solutions',
    position: 'Growth Marketing Manager',
    department: 'Marketing',
    salary: '$95,000 / year',
    joiningDate: '2026-07-01',
    reportingManager: 'David Vance',
    employmentType: 'Full-time',
    benefits: 'Marketing budget ownership, medical coverage options, mental wellness coaching subscription.',
    termsAndConditions: 'Standard 12 month non-solicitation agreement.',
    status: 'Pending HR Admin Approval',
    templateId: 'temp_11',
    header: 'NEXUHR HR SOLUTIONS GROUP\n100 Enterprise Way, Suite 400\nSunnyvale, CA 94089\nwww.nexuhr.com',
    bodyContent: 'Dear Isabella Garcia,\n\nWe are pleased to extend this offer of employment for the position of Growth Marketing Manager in our Marketing department. Reporting directly to David Vance, you will execute on our acquisition efforts.\n\nYour starting compensation will be $95,000 / year, payable in accordance with our standard company packages. You will also qualify for our general wellness benefits, and comprehensive healthcare solutions.\n\nWe expect your start date to be 2026-07-01.',
    footer: 'CONFIDENTIAL OFFER OF EMPLOYMENT\nPage 1 of 1 • NexuHR Solutions is an Equal Opportunity Employer.',
    fontFamily: 'Inter',
    fontSize: '11pt',
    themeColors: {
      header: '#ec4899',
      text: '#1e293b',
      primary: '#ec4899',
      background: '#ffffff'
    },
    signatureBlocks: [
      { title: 'HR Authorized Director', name: 'Sarah Jenkins' },
      { title: 'Candidate Acceptance Sign', name: 'Isabella Garcia' }
    ],
    visibilityControls: {
      showHeader: true,
      showLogo: true,
      showTerms: true,
      showFooter: true,
      showSignatures: true
    },
    createdDate: '2026-05-29',
    updatedDate: '2026-05-30',
    history: [
      {
        id: 'hist_14',
        step: 'Recruiter',
        action: 'Created',
        actorName: 'Michael Chang',
        actorRole: 'Recruiter',
        comments: 'Marketing specialist proposal.',
        timestamp: '2026-05-29T14:00:00Z'
      },
      {
        id: 'hist_15',
        step: 'Hiring Manager',
        action: 'Approved',
        actorName: 'David Vance',
        actorRole: 'Hiring Manager',
        comments: 'Approved, salary matches expectations perfectly.',
        timestamp: '2026-05-30T11:00:00Z'
      }
    ]
  }
];

// Seeded Notifications
export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'n_1',
    title: 'New Candidate Applied',
    message: 'Dr. Evelyn Reed submitted an application for Senior Clinical Specialist.',
    category: 'Candidate',
    isRead: false,
    timestamp: '2026-06-01T09:12:00Z'
  },
  {
    id: 'n_2',
    title: 'Changes Requested on Offer',
    message: 'David Vance requested changes on DevOps Engineer offer (Alex Rivera). Comment: "Add signing bonus".',
    category: 'Offer',
    isRead: false,
    timestamp: '2026-05-20T09:12:00Z'
  },
  {
    id: 'n_3',
    title: 'Offer Accepted!',
    message: 'Sophia Patel signed and accepted the Lead Financial Analyst Offer!',
    category: 'Offer',
    isRead: true,
    timestamp: '2026-05-13T09:44:00Z'
  },
  {
    id: 'n_4',
    title: 'Template Marketplace Added',
    message: 'Specialized Founding Architect Template was updated by the design panel.',
    category: 'Template',
    isRead: true,
    timestamp: '2026-05-18T15:30:00Z'
  },
  {
    id: 'n_5',
    title: 'New Candidate Interview scheduled',
    message: 'Alex Rivera was moved to Interviewing stage by Michael Chang.',
    category: 'Candidate',
    isRead: true,
    timestamp: '2026-05-18T10:00:00Z'
  }
];

// Seeded Activities log (Dashboard Audit trail)
export const SEED_ACTIVITIES: Activitylog[] = [
  {
    id: 'act_1',
    user: 'Sarah Jenkins',
    role: 'HR Admin',
    action: 'Approved Offer',
    target: 'Sophia Patel (Lead Financial Analyst)',
    timestamp: '2026-05-11 14:00'
  },
  {
    id: 'act_2',
    user: 'Michael Chang',
    role: 'Recruiter',
    action: 'Created Offer Draft',
    target: 'Eleanor Vance (Senior UI/UX Architect)',
    timestamp: '2026-05-16 10:00'
  },
  {
    id: 'act_3',
    user: 'David Vance',
    role: 'Hiring Manager',
    action: 'Requested Changes',
    target: 'Alex Rivera (Staff DevOps Engineer)',
    timestamp: '2026-05-20 09:12'
  },
  {
    id: 'act_4',
    user: 'David Vance',
    role: 'Hiring Manager',
    action: 'Approved Offer',
    target: 'Isabella Garcia (Growth Marketing Manager)',
    timestamp: '2026-05-30 11:00'
  },
  {
    id: 'act_5',
    user: 'Michael Chang',
    role: 'Recruiter',
    action: 'Emailed Offer Letter',
    target: 'Amara Okafor (Founding Frontend Engineer)',
    timestamp: '2026-05-10 12:00'
  }
];

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'NexuHR Solutions',
  companyLogo: 'NH',
  address: '100 Enterprise Way, Suite 400, Sunnyvale, CA 94089',
  email: 'hr@nexuhr.com',
  phone: '+1 (555) 500-1000',
  website: 'https://nexuhr.com'
};
