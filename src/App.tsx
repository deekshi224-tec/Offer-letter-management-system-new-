/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Activitylog, 
  Candidate, 
  CompanySettings, 
  Notification, 
  OfferLetter, 
  OfferLetterStatus, 
  SystemSettings, 
  Template, 
  User, 
  UserRole,
  ApprovalHistoryItem
} from './types';
import { 
  SEED_USERS, 
  SEED_CANDIDATES, 
  SEED_TEMPLATES, 
  SEED_OFFER_LETTERS, 
  SEED_NOTIFICATIONS, 
  SEED_ACTIVITIES, 
  DEFAULT_COMPANY_SETTINGS 
} from './mockData';

// Import Modular Presentation components
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CandidateManagement from './components/CandidateManagement';
import TemplateMarketplace from './components/TemplateMarketplace';
import TemplateEditor from './components/TemplateEditor';
import LetterGenerator from './components/LetterGenerator';
import OfferLettersList from './components/OfferLettersList';
import NotificationsPanel from './components/NotificationsPanel';
import Settings from './components/Settings';

export default function App() {
  
  // 1. Authentication Status (Bypassed to TRUE initially to let the user explore rich analytics immediately, with quick logout option)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const cached = localStorage.getItem('olms_auth');
    return cached === 'true' || true; // Defaulting to logged in
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const cached = localStorage.getItem('olms_current_user');
    return cached ? JSON.parse(cached) : SEED_USERS[0]; // Sarah Jenkins (HR Admin)
  });

  // 2. Active View selection
  const [activeView, setActiveView] = useState<string>(() => {
    return currentUser.role === 'Employee' ? 'offers' : 'dashboard';
  });

  // 3. Database Core States
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const cached = localStorage.getItem('olms_candidates');
    return cached ? JSON.parse(cached) : SEED_CANDIDATES;
  });

  const [templates, setTemplates] = useState<Template[]>(() => {
    const cached = localStorage.getItem('olms_templates');
    return cached ? JSON.parse(cached) : SEED_TEMPLATES;
  });

  const [offers, setOffers] = useState<OfferLetter[]>(() => {
    const cached = localStorage.getItem('olms_offers');
    return cached ? JSON.parse(cached) : SEED_OFFER_LETTERS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const cached = localStorage.getItem('olms_notifications');
    return cached ? JSON.parse(cached) : SEED_NOTIFICATIONS;
  });

  const [activities, setActivities] = useState<Activitylog[]>(() => {
    const cached = localStorage.getItem('olms_activities');
    return cached ? JSON.parse(cached) : SEED_ACTIVITIES;
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const cached = localStorage.getItem('olms_company_settings');
    return cached ? JSON.parse(cached) : DEFAULT_COMPANY_SETTINGS;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const cached = localStorage.getItem('olms_system_settings');
    return cached ? JSON.parse(cached) : {
      theme: 'Dark',
      notificationPreferences: {
        newCandidate: true,
        offerSent: true,
        offerApproved: true,
        offerRejected: true,
        templateUpdated: true
      }
    };
  });

  // Cross-Navigation Context buffers
  const [selectedTemplateFromMarketplace, setSelectedTemplateFromMarketplace] = useState<Template | null>(null);
  const [selectedCandidateFromManager, setSelectedCandidateFromManager] = useState<Candidate | null>(null);

  // 4. Persistence Sync Handlers
  useEffect(() => {
    localStorage.setItem('olms_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('olms_current_user', JSON.stringify(currentUser));
    if (currentUser.role === 'Employee' && activeView !== 'settings' && activeView !== 'offers') {
      setActiveView('offers'); // Redirect restricted portal
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('olms_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('olms_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('olms_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('olms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('olms_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('olms_company_settings', JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem('olms_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  // Unified Notification & Logging dispatch helper
  const dispatchAlert = (title: string, message: string, category: 'Candidate' | 'Offer' | 'Template' | 'General') => {
    const newNotif: Notification = {
      id: `n_dyn_${Date.now()}`,
      title,
      message,
      category,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const dispatchActivity = (action: string, target: string) => {
    const newLog: Activitylog = {
      id: `act_dyn_${Date.now()}`,
      user: currentUser.name,
      role: currentUser.role,
      action,
      target,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setActivities(prev => [newLog, ...prev]);
  };

  // 5. DB Mutation handlers passed to children
  const handleLoginSuccess = (userTarget: User) => {
    setCurrentUser(userTarget);
    setIsAuthenticated(true);
    setActiveView(userTarget.role === 'Employee' ? 'offers' : 'dashboard');
    dispatchActivity('Logged In', 'Workspace Portal');
  };

  const handleLogout = () => {
    dispatchActivity('Logged Out', 'Workspace Exit');
    setIsAuthenticated(false);
    localStorage.setItem('olms_auth', 'false');
  };

  // Candidate Mutations
  const handleAddCandidate = (cand: Omit<Candidate, 'id' | 'createdDate'>) => {
    const fresh: Candidate = {
      ...cand,
      id: `cand_dyn_${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setCandidates(prev => [fresh, ...prev]);
    dispatchActivity('Registered Candidate', `${fresh.name} (${fresh.position})`);
    dispatchAlert('New Candidate added to Database', `${fresh.name} was registered under target department of ${fresh.department}`, 'Candidate');
  };

  const handleUpdateCandidate = (cand: Candidate) => {
    setCandidates(prev => prev.map(c => c.id === cand.id ? cand : c));
    dispatchActivity('Updated Candidate Profile', cand.name);
  };

  const handleDeleteCandidate = (id: string) => {
    const match = candidates.find(c => c.id === id);
    if (!match) return;
    setCandidates(prev => prev.filter(c => c.id !== id));
    dispatchActivity('Purged Candidate Profile file', match.name);
  };

  // Template Mutations
  const handleSaveTemplate = (temp: Template) => {
    setTemplates(prev => {
      const match = prev.find(t => t.id === temp.id);
      if (match) {
        return prev.map(t => t.id === temp.id ? temp : t);
      } else {
        return [temp, ...prev];
      }
    });
    dispatchActivity('Saved Template Structure layout', temp.name);
    dispatchAlert('Template Model Updated', `Template draft: "${temp.name}" layout definitions synchronized.`, 'Template');
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Offer Letters Mutations
  const handleSaveOfferLetter = (letter: OfferLetter) => {
    setOffers(prev => {
      const match = prev.find(o => o.id === letter.id);
      if (match) {
        return prev.map(o => o.id === letter.id ? letter : o);
      } else {
        return [letter, ...prev];
      }
    });

    // Update status mapping in candidate file automatically if binding matches!
    if (letter.candidateId && letter.candidateId !== 'unbound') {
      setCandidates(prev => prev.map(c => {
        if (c.id === letter.candidateId) {
          // Sync candidate stage to Offered / review based on status
          return { 
            ...c, 
            status: letter.status === 'Accepted' ? 'Accepted' : 'Offered' 
          };
        }
        return c;
      }));
    }

    dispatchActivity('Compiled offer letter document draft', `${letter.candidateName} (${letter.position})`);
    dispatchAlert('Offer Letter Registered', `An offer file was mapped to candidate ${letter.candidateName}. Base status: ${letter.status}`, 'Offer');
  };

  const handleUpdateOfferStatus = (
    id: string, 
    newStatus: OfferLetterStatus, 
    comment: string,
    actorName: string,
    actorRole: UserRole
  ) => {
    setOffers(prev => prev.map(o => {
      if (o.id === id) {
        // Append step verification log
        const historyItem: ApprovalHistoryItem = {
          id: `hist_step_${Date.now()}`,
          step: newStatus === 'Pending HR Admin Approval' ? 'Hiring Manager' : 
                newStatus === 'Final Approved' ? 'HR Admin' : 'Final',
          action: newStatus === 'Changes Requested' ? 'Changes Requested' : 'Approved',
          actorName,
          actorRole,
          comments: comment,
          timestamp: new Date().toISOString()
        };
        
        return {
          ...o,
          status: newStatus,
          history: [...o.history, historyItem],
          updatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return o;
    }));

    // Trigger state in Candidate
    const targetLetter = offers.find(o => o.id === id);
    if (targetLetter && targetLetter.candidateId) {
      setCandidates(prev => prev.map(c => {
        if (c.id === targetLetter.candidateId) {
          if (newStatus === 'Accepted') return { ...c, status: 'Accepted' };
          if (newStatus === 'Rejected') return { ...c, status: 'Rejected' };
          return c;
        }
        return c;
      }));
    }

    dispatchActivity(`Triggered workflow action: [${newStatus}]`, targetLetter?.candidateName || 'offer letter');
    dispatchAlert('Offer Lifecycle stage update', `Offer file mapped to ${targetLetter?.candidateName} is now set to ${newStatus}. Action comments: "${comment}"`, 'Offer');
  };

  const handleDeleteOffer = (id: string) => {
    const match = offers.find(o => o.id === id);
    if (!match) return;
    setOffers(prev => prev.filter(o => o.id !== id));
    dispatchActivity('Purged Offer Letter file', match.candidateName);
  };

  const handleDuplicateOffer = (letter: OfferLetter) => {
    const dup: OfferLetter = {
      ...letter,
      id: `letter_dup_${Date.now()}`,
      candidateName: `${letter.candidateName} Copy`,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      history: [
        {
          id: `hist_${Date.now()}`,
          step: 'Recruiter',
          action: 'Created',
          actorName: currentUser.name,
          actorRole: currentUser.role,
          comments: `Duplicated copies of transaction template.`,
          timestamp: new Date().toISOString()
        }
      ]
    };
    setOffers(prev => [dup, ...prev]);
    dispatchActivity('Dupled current Offer contract draft', letter.candidateName);
  };

  // Cross-Navigation triggers mapping
  const handleDraftLetterFromCandidate = (cand: Candidate) => {
    setSelectedCandidateFromManager(cand);
    setActiveView('generator');
  };

  const handleSelectTemplateForGenerator = (temp: Template) => {
    setSelectedTemplateFromMarketplace(temp);
    setActiveView('generator');
  };

  const handleSelectTemplateForEditor = (temp: Template) => {
    setSelectedTemplateFromMarketplace(temp);
    setActiveView('template-editor');
  };

  // Alert Log utilities
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Unread notification computation count banner
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[#0a0a0c] font-sans text-slate-200 overflow-hidden">
      
      {/* 1. App Sidebar Navigation component */}
      <Sidebar
        currentUser={currentUser}
        onSetCurrentUser={setCurrentUser}
        activeView={activeView}
        onChangeView={setActiveView}
        onLogout={handleLogout}
        notificationCount={unreadCount}
      />

      {/* 2. Primary Workspace Body container with transitions */}
      <main className="flex-1 overflow-y-auto custom-scrollbar h-screen relative bg-[#0a0a0c]">
        
        {/* Dynamic backdrop subtle light glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        
        {activeView === 'dashboard' && (
          <Dashboard
            candidates={candidates}
            offers={offers}
            templates={templates}
            activities={activities}
            onChangeView={setActiveView}
          />
        )}

        {activeView === 'candidates' && (
          <CandidateManagement
            candidates={candidates}
            onAddCandidate={handleAddCandidate}
            onUpdateCandidate={handleUpdateCandidate}
            onDeleteCandidate={handleDeleteCandidate}
            currentUserRole={currentUser.role}
            onDraftLetterFromCandidate={handleDraftLetterFromCandidate}
          />
        )}

        {activeView === 'marketplace' && (
          <TemplateMarketplace
            templates={templates}
            onSelectTemplateForGenerator={handleSelectTemplateForGenerator}
            onSelectTemplateForEditor={handleSelectTemplateForEditor}
          />
        )}

        {activeView === 'offers' && (
          <OfferLettersList
            offers={offers}
            onUpdateOfferStatus={handleUpdateOfferStatus}
            onDeleteOffer={handleDeleteOffer}
            onDuplicateOffer={handleDuplicateOffer}
            currentUser={currentUser}
          />
        )}

        {activeView === 'generator' && (
          <LetterGenerator
            candidates={candidates}
            templates={templates}
            onSaveOfferLetter={handleSaveOfferLetter}
            selectedTemplateFromMarketplace={selectedTemplateFromMarketplace}
            selectedCandidateFromManager={selectedCandidateFromManager}
            onChangeView={setActiveView}
          />
        )}

        {activeView === 'template-editor' && (
          <TemplateEditor
            initialTemplatesList={templates}
            onSaveTemplate={handleSaveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            selectedTemplateFromMarketplace={selectedTemplateFromMarketplace}
          />
        )}

        {activeView === 'settings' && (
          <Settings
            companySettings={companySettings}
            onSaveCompanySettings={setCompanySettings}
            systemSettings={systemSettings}
            onSaveSystemSettings={setSystemSettings}
            currentUserRole={currentUser.role}
            allActivityCount={activities.length}
          />
        )}

        {activeView === 'notifications-panel' && (
          <NotificationsPanel
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearNotifications}
          />
        )}

      </main>

    </div>
  );
}

