import React, { useState } from 'react';
import { BrainCircuit, ArrowRight, ShieldCheck, Zap, Globe, Mail, Lock, Sparkles } from 'lucide-react';
import { auth, loginWithGoogle } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion, useScroll, useTransform } from 'motion/react';

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white font-sans selection:bg-cyan-500 selection:text-white flex flex-col overflow-y-auto overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: yBg }} className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-900/20 blur-[100px] rounded-full mix-blend-screen" />
        </motion.div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between bg-[#0a0a0e]/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-400 to-indigo-600 p-2 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">ARC</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Neural Canvas</a>
          <a href="#about" className="hover:text-cyan-400 transition-colors">Pipeline</a>
        </div>
        <div>
          <button 
            onClick={() => {
              const el = document.getElementById('login-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-sm backdrop-blur-md transition-all hover:scale-105"
          >
            Access Core
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 mt-32 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-24 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit text-sm font-bold">
            <Sparkles className="w-4 h-4" /> V2.0 Cognitive Engine Live
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tighter">
            Think <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500">Beyond</span> Data.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-xl font-medium">
            ARC translates complex research into a living neural graph. Accelerate discovery with an autonomous AI pipeline that retrieves, structures, and visualizes knowledge.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <button 
              onClick={() => {
                const el = document.getElementById('login-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-lg md:text-xl flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              Initialize Workspace <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-10 mt-8 border-t border-white/10 pt-8">
            <div className="flex flex-col gap-1">
              <span className="text-4xl font-black text-white">100<span className="text-cyan-500">x</span></span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Synthesis Speed</span>
            </div>
            <div className="w-px h-16 bg-white/10"></div>
            <div className="flex flex-col gap-1">
              <span className="text-4xl font-black text-white">0<span className="text-purple-500">%</span></span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Hallucination</span>
            </div>
          </div>
        </motion.div>

        {/* Login Form Section */}
        <motion.div 
          id="login-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 -z-10"></div>
          
          <h2 className="text-4xl font-black mb-2 text-white">{isSignUp ? 'Initialize Profile' : 'System Login'}</h2>
          <p className="text-slate-400 font-medium mb-10 text-lg">
            {isSignUp ? 'Create your neural workspace credentials.' : 'Authenticate to access your research environments.'}
          </p>

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-300 tracking-wide uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@arc.network"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-cyan-500 focus:bg-black/60 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 outline-none transition-all font-medium text-lg"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-300 tracking-wide uppercase">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-cyan-500 focus:bg-black/60 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 outline-none transition-all font-medium text-lg"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold border border-red-500/20 backdrop-blur-sm">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-lg shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Initialize' : 'Authenticate')}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Enterprise SSO</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-bold text-base flex items-center justify-center gap-3 transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wide"
            >
              {isSignUp ? 'Already provisioned? Login' : 'Request clearance? Sign Up'}
            </button>
          </div>
        </motion.div>
      </main>

      {/* The Thesis Section */}
      <section className="w-full relative z-10 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-[3rem] bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-white/10 backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">The end of flat-text reading.</h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
              Traditional research forces you to hold thousands of data points in your head. ARC externalizes your cognition. By translating unstructured PDFs, web data, and documentation into a spatial, interactive neural topology, ARC allows you to see the big picture without losing the granular details.
            </p>
            <p className="text-lg md:text-xl text-cyan-400 leading-relaxed font-black mt-6 tracking-wide">
              Understand everything. Miss nothing.
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="about" className="w-full bg-[#050508] py-32 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">The Neural Pipeline</h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium">A fully autonomous cognitive engine, from raw data to knowledge graph.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Ingest", desc: "Process natural language queries and aggregate context." },
              { title: "Retrieve", desc: "Scan trusted academic endpoints and extract raw signal." },
              { title: "Synthesize", desc: "Construct a semantic web of interconnected concepts." },
              { title: "Visualize", desc: "Interact with the neural map in real-time." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all backdrop-blur-md"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl font-black text-white/5 mb-6 absolute top-4 right-4">{idx + 1}</div>
                <h3 className="text-2xl font-black text-white mb-3 relative z-10">{step.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed relative z-10 font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-[#0a0a0e] py-32 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Core Capabilities</h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto">Engineered to bypass cognitive overload.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col gap-6 group hover:bg-white/10 transition-all backdrop-blur-md relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Dynamic Topology</h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">Map out complex concepts on an infinite canvas. Drag, drop, and connect nodes to visualize neural relationships dynamically.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col gap-6 group hover:bg-white/10 transition-all backdrop-blur-md relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Quantum Auditing</h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">Automatically flag conflicting information from massive datasets, ensuring neural pathways are robust and zero-hallucinated.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col gap-6 group hover:bg-white/10 transition-all backdrop-blur-md relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Vocal Telemetry</h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">Speak directly to your canvas using high-bandwidth audio links. Extract insights, navigate pathways, and ideate continuously.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full bg-[#050508] text-slate-500 py-12 text-center border-t border-white/5 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BrainCircuit className="w-5 h-5 text-cyan-500" />
          <span className="text-xl font-black text-white tracking-widest uppercase">ARC.Network</span>
        </div>
        <p className="font-bold text-sm tracking-wider uppercase">© {new Date().getFullYear()} ARC Cognitive Systems. All protocols secured.</p>
      </footer>
    </div>
  );
}
