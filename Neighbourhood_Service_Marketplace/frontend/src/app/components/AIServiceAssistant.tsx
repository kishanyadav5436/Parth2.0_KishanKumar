import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, Sparkles, User, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "ac-repair", keywords: ["ac", "air conditioner", "cooling", "heat", "filter", "ac repair"], name: "AC Repair" },
  { id: "plumbing", keywords: ["water", "leak", "pipe", "tap", "bathroom", "toilet", "drain", "plumber"], name: "Plumbing" },
  { id: "electrical", keywords: ["light", "switch", "wire", "shock", "fan", "electricity", "power", "electrician"], name: "Electrician" },
  { id: "cleaning", keywords: ["clean", "dust", "mop", "wash", "house", "apartment", "sofa", "cleaning"], name: "Home Cleaning" },
  { id: "painting", keywords: ["paint", "color", "wall", "interior", "exterior", "brush", "painting"], name: "Painting" },
  { id: "pest-control", keywords: ["pest", "ant", "roach", "termite", "bug", "insect", "spider", "pest control"], name: "Pest Control" },
];

export default function AIServiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your Service Assistant. How can I help you with your home today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const lowerInput = userMessage.toLowerCase();
      let matchedCategory = null;

      for (const cat of categories) {
        if (cat.keywords.some(k => lowerInput.includes(k))) {
          matchedCategory = cat;
          break;
        }
      }

      let response = "";
      let suggestion = null;

      if (matchedCategory) {
        response = `It sounds like you need help with **${matchedCategory.name}**. I can show you our top-rated experts in this category!`;
        suggestion = matchedCategory;
      } else {
        response = "I'm not exactly sure which service you need, but you can browse all our categories or tell me more about the problem!";
      }

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response,
        suggestion: suggestion
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl text-white cursor-pointer group overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-8 w-8" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageSquare className="h-8 w-8" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-blue-600"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] h-[550px] max-h-[80vh]"
          >
            <Card className="flex flex-col h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2rem] overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black tracking-tight">AI Assistant</h3>
                    <p className="text-xs text-blue-100 font-medium">Online • Powered by ServiceHub AI</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="h-20 w-20" />
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/50 dark:bg-slate-950/20"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`mt-1 shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                        {msg.role === 'user' ? <User className="h-4 w-4 text-blue-600" /> : <Bot className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="space-y-3">
                        <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                        }`}>
                          <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                        
                        {(msg as any).suggestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Button 
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/services?q=${(msg as any).suggestion.id}`);
                              }}
                              className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 rounded-xl py-6 flex items-center justify-between group h-auto"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🔧</span>
                                <div className="text-left">
                                  <p className="font-black text-sm">View {(msg as any).suggestion.name}</p>
                                  <p className="text-xs text-slate-400 font-medium">Explore verified experts</p>
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="h-1.5 w-1.5 bg-slate-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2"
                >
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your problem..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 shrink-0"
                    disabled={!input.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
                <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                  Powered by Neighborhood AI • Beta
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
