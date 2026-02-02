import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Atom, Zap, ArrowRight, BrainCircuit, Bot, Network } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function useOnScreen(ref: React.RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
           setIntersecting(true);
           observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
}

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
      }`}
    >
      {children}
    </div>
  );
};

export function FuturesPage() {
  return (
    <div className="min-h-screen bg-blue-950 text-blue-50 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Hero Section - distinct tech aesthetic */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-950 to-slate-950"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm mb-6">
            <Zap size={14} /> <span>New Tech Curriculum Launching Soon</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 ">
            Future Courses
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            We are transcending traditional education. Dive into the technologies that are rewriting the rules of the world.
          </p>
          </FadeIn>
        </div>
      </section>

      {/* Course Section 1: React JS */}
      <section className="py-24 border-t border-slate-900">
        <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1 order-2 md:order-1">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-[400px] w-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                   {/* Abstract Representation */}
                   <Atom size={120} className="text-cyan-400 animate-[spin_10s_linear_infinite]" />
                   <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent">
                     <span className="font-mono text-cyan-400 text-sm">npm install react@latest</span>
                   </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">React JS</h2>
              <p className="text-xl text-slate-400 mb-6 leading-relaxed">
                Master the art of building fluid, interactive user interfaces. React is the library of choice for the world's leading tech companies. 
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div> Component-Based Architecture
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div> Virtual DOM & Performance
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div> Modern Hooks & State Management
                </li>
              </ul>
              {/* <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300">
                View Curriculum <ArrowRight className="ml-2 h-4 w-4" />
              </Button> */}
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Course Section 2: Next JS */}
      <section className="py-24 border-t border-slate-900 bg-slate-950/50">
        <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Next.js</h2>
              <p className="text-xl text-slate-400 mb-6 leading-relaxed">
                The React Framework for the Web. Step into full-stack development with server-side rendering, static site generation, and powerful routing.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-white"></div> Server Components
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-white"></div> API Routes & Backend Integration
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-white"></div> SEO Optimization
                </li>
              </ul>
              {/* <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Curriculum <ArrowRight className="ml-2 h-4 w-4" />
              </Button> */}
            </div>
            <div className="flex-1">
               <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-200 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-[400px] w-full bg-black rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                   <div className="text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
                     NEXT.JS
                   </div>
                   <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-2 py-1 rounded">Full Stack Web Development</div>
                </div>
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Course Section 3: Artificial Intelligence */}
      <section className="py-24 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-purple-950/20">
        <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1 order-2 md:order-1">
               <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-[400px] w-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                   <Bot size={120} className="text-purple-500" />
                   {/* Decorative elements */}
                   <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none">
                      <div className="w-64 h-64 border border-purple-500 rounded-full animate-ping shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                   </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-pink-900/30 text-pink-300 text-xs font-bold border border-pink-500/30">TRENDING</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Artificial Intelligence</h2>
              <p className="text-xl text-slate-400 mb-6 leading-relaxed">
                Explore the frontiers of intelligence. Understand the ethics, history, and applications of generating human-like capabilities in machines.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> Generative AI & LLMs
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> Natural Language Processing
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> Computer Vision Applications
                </li>
              </ul>
              {/* <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-950 hover:text-purple-300">
                View Curriculum <ArrowRight className="ml-2 h-4 w-4" />
              </Button> */}
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Course Section 4: Machine Learning */}
      <section className="py-24 border-t border-slate-900 bg-slate-950">
        <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Machine Learning</h2>
              <p className="text-xl text-slate-400 mb-6 leading-relaxed">
                Dive deep into the algorithms that learn from data. From regression to deep neural networks, master the math behind the magic.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Supervised & Unsupervised Learning
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Neural Networks Architecture
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Data Preprocessing & Feature Engineering
                </li>
              </ul>
              {/* <Button variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-950 hover:text-indigo-300">
                View Curriculum <ArrowRight className="ml-2 h-4 w-4" />
              </Button> */}
            </div>
            <div className="flex-1">
               <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-[400px] w-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                   <Network size={120} className="text-indigo-500" />
                   {/* Decorative binary stream */}
                   <div className="absolute inset-0 flex justify-between px-8 opacity-10 font-mono text-xs text-indigo-300 pointer-events-none">
                     <div className="flex flex-col gap-2 pt-4">
                        <span>101010</span><span>010011</span><span>111000</span>
                     </div>
                     <div className="flex flex-col gap-2 pt-12">
                        <span>001101</span><span>101010</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready for the Future?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            These programs are launching soon. Secure your spot on the waitlist and get early bird pricing.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200">
               <Link to="/register">Join Waitlist</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
               <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
