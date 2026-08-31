import React, { useEffect, useState } from "react";
import { X, Clock, BrainCircuit, Trash2, FolderOpen } from "lucide-react";
import { ResearchProject } from "../../types";
import { loadProjectsFromDb } from "../../lib/db";
import { motion, AnimatePresence } from "motion/react";

interface SavedProjectsModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (project: ResearchProject) => void;
}

export function SavedProjectsModal({ userId, isOpen, onClose, onLoadProject }: SavedProjectsModalProps) {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      loadProjectsFromDb(userId).then(data => {
        setProjects(data);
        setLoading(false);
      });
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Workspaces</h2>
              <p className="text-sm text-slate-500 font-medium">Load previous research projects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <BrainCircuit className="w-10 h-10 animate-pulse mb-4 text-indigo-300" />
              <p className="font-medium">Retrieving neural archives...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-lg font-bold text-slate-700">No saved workspaces yet</p>
              <p className="text-sm mt-1 max-w-sm">Generate a new ARC research project and save it to access it here later.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {projects.map((proj, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={proj.id || idx}
                    onClick={() => {
                      onLoadProject(proj);
                      onClose();
                    }}
                    className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-indigo-600 transition-colors">
                          {proj.query}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1 font-medium">
                        {proj.executiveSummary}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <BrainCircuit className="w-3.5 h-3.5" />
                          {proj.nodes?.length || 0} Nodes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date((proj as any).updatedAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex shrink-0">
                      <button className="px-5 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-bold rounded-xl text-sm transition-colors border border-slate-200 hover:border-indigo-200">
                        Open Workspace
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
