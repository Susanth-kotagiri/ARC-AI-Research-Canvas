import { collection, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { ResearchProject } from '../types';

export const saveProjectToDb = async (userId: string, project: ResearchProject) => {
  if (!project.id) {
    project.id = `proj_${Date.now()}`;
  }
  
  const projectRef = doc(db, 'projects', project.id);
  await setDoc(projectRef, {
    ...project,
    userId,
    updatedAt: Date.now()
  });
  
  return project;
};

export const loadProjectsFromDb = async (userId: string): Promise<ResearchProject[]> => {
  const projectsRef = collection(db, 'projects');
  const q = query(projectsRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'));
  
  const snapshot = await getDocs(q);
  const projects: ResearchProject[] = [];
  
  snapshot.forEach((doc) => {
    projects.push(doc.data() as ResearchProject);
  });
  
  return projects;
};
