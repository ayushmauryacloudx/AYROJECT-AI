import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Loader2, ArrowLeft, Send, User, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Mentor() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!auth.currentUser || !id) return;
      try {
        const { db } = await import('../lib/firebase');
        const { doc, getDoc, collection, query, orderBy, getDocs } = await import('firebase/firestore');
        const docRef = doc(db, 'users', auth.currentUser.uid, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProject({ id: docSnap.id, ...docSnap.data() });

        const messagesRef = collection(db, 'users', auth.currentUser.uid, 'projects', id, 'mentorMessages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));
        const messagesSnap = await getDocs(q);
        setMessages(messagesSnap.docs.map(d => d.data() as { role: 'user' | 'ai'; content: string }).filter(m => m && m.role && m.content));
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, auth.currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !project || !auth.currentUser) return;

    const userMessage = input;
    setInput('');
    
    const newMsg = { role: 'user' as const, content: userMessage, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    setSending(true);

    try {
      const { db } = await import('../lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      
      // Save user message
      const messagesRef = collection(db, 'users', auth.currentUser!.uid, 'projects', id!, 'mentorMessages');
      await addDoc(messagesRef, newMsg);

      const token = await auth.currentUser!.getIdToken();
      const res = await fetch(`/api/projects/${id}/mentor`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          projectData: project,
          history: messages.slice(-5)
        })
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      const aiMsg = { role: 'ai' as const, content: data.response, createdAt: new Date().toISOString() };
      
      // Save AI message
      await addDoc(messagesRef, aiMsg);
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600"/></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link to={`/projects/${id}`} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white dark:text-white font-medium text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Project
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Project Mentor</h1>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6" aria-live="polite">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
              Hello! I am your AI Mentor for <strong>{project?.title}</strong>. 
              {project?.blueprint ? " I've reviewed your blueprint and architecture." : " We haven't generated a blueprint yet, but I know your tech stack."} 
              What do you need help with?
            </div>
          </div>

          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-slate-900" : "bg-indigo-100")}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Brain className="w-6 h-6 text-indigo-600" />}
              </div>
              <div className={cn("p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap", 
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-800"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about architecture, features, debugging..."
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              disabled={sending}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || sending}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
