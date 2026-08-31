import React, { useState } from "react";
import { ResearchProject, CanvasMode } from "../../types";
import { 
  BrainCircuit, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Download, 
  Search, 
  FileText, 
  Code, 
  Printer, 
  ShieldAlert, 
  HelpCircle,
  Plus,
  Mic,
  LogOut,
  User,
  Save,
  FolderOpen
} from "lucide-react";
import { logout } from "../../firebase";

interface NavbarProps {
  project: ResearchProject | null;
  user: any;
  onNewResearch: () => void;
  onOpenPassport: () => void;
  onOpenSources: () => void;
  onOpenContradictions: () => void;
  onOpenGaps: () => void;
  onOpenTimeline: () => void;
  onOpenAskCanvas: () => void;
  onToggleVoiceChat: () => void;
  onSaveProject: () => void;
  onOpenSavedProjects: () => void;
  isSaving: boolean;
}

export function Navbar({
  project,
  user,
  onNewResearch,
  onOpenPassport,
  onOpenSources,
  onOpenContradictions,
  onOpenGaps,
  onOpenTimeline,
  onOpenAskCanvas,
  onToggleVoiceChat,
  onSaveProject,
  onOpenSavedProjects,
  isSaving
}: NavbarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 select-none shadow-sm sticky top-0">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-4">
        <div 
          onClick={onNewResearch}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              ARC
            </span>
          </div>
        </div>

        {project && (
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Topic:
              </span>
              <span className="text-sm font-bold text-slate-800 truncate max-w-xs">
                {project.query}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 tracking-wider">
                {project.depth}
              </span>
            </div>

            <button
              onClick={onNewResearch}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow text-xs transition-all flex items-center gap-1.5 font-bold"
              title="Start New Research"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-bold hidden lg:inline">New</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tools & Modals */}
      {project && (
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPassport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm text-emerald-800 text-xs font-bold transition-all"
            title="Research Passport & Completeness Audit"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Passport</span>
          </button>

          <button
            onClick={onOpenSources}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 shadow-sm text-sky-800 text-xs font-bold transition-all"
            title="View Primary Sources & Bibliography"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Sources ({project.sources.length})</span>
          </button>

          <button
            onClick={onOpenAskCanvas}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-sm text-indigo-800 text-sm font-bold transition-all"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span>Ask Canvas</span>
          </button>

          <button
            onClick={onToggleVoiceChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 shadow-sm text-pink-800 text-sm font-bold transition-all"
          >
            <Mic className="w-4 h-4 text-pink-600" />
            <span>Voice</span>
          </button>
        </div>
      )}

      {/* Auth Tools */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSavedProjects}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-sm text-slate-700 text-xs font-bold transition-all"
              title="My Workspaces"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden md:inline">Library</span>
            </button>
            {project && (
              <button
                onClick={onSaveProject}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-900 shadow-sm text-white text-xs font-bold transition-all disabled:opacity-50"
                title="Save Workspace"
              >
                {isSaving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            )}
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 ml-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-4 h-4 text-slate-600" />
              )}
              <span className="text-xs font-bold truncate max-w-[100px] text-slate-700">{user.displayName || user.email}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 shadow-sm text-slate-500 transition-all ml-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
