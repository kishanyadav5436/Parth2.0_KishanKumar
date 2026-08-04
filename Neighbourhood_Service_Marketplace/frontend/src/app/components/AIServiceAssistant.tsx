import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, Sparkles, User, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

// ── Category knowledge base ──
const categories = [
  { id: "ac-repair", keywords: ["ac", "air conditioner", "cooling", "heat", "filter", "ac repair", "hvac", "not cooling", "compressor", "gas refill", "split ac", "window ac"], name: "AC Repair", icon: "❄️", avgPrice: "₹400–₹800" },
  { id: "plumbing", keywords: ["water", "leak", "pipe", "tap", "bathroom", "toilet", "drain", "plumber", "faucet", "geyser", "water heater", "clogged", "blockage", "shower", "cistern"], name: "Plumbing", icon: "🔧", avgPrice: "₹300–₹600" },
  { id: "electrical", keywords: ["light", "switch", "wire", "shock", "fan", "electricity", "power", "electrician", "short circuit", "mcb", "inverter", "wiring", "socket", "plug", "bulb"], name: "Electrician", icon: "⚡", avgPrice: "₹250–₹500" },
  { id: "cleaning", keywords: ["clean", "dust", "mop", "wash", "house", "apartment", "sofa", "cleaning", "deep clean", "kitchen", "carpet", "bathroom clean", "sanitize", "disinfect"], name: "Home Cleaning", icon: "🧹", avgPrice: "₹500–₹1500" },
  { id: "painting", keywords: ["paint", "color", "wall", "interior", "exterior", "brush", "painting", "whitewash", "primer", "putty", "texture", "room paint"], name: "Painting", icon: "🎨", avgPrice: "₹15–₹25/sqft" },
  { id: "pest-control", keywords: ["pest", "ant", "roach", "termite", "bug", "insect", "spider", "pest control", "cockroach", "mosquito", "rat", "mice", "bed bug", "fumigation"], name: "Pest Control", icon: "🐜", avgPrice: "₹800–₹2000" },
  { id: "gardening", keywords: ["garden", "plant", "lawn", "tree", "landscaping", "hedge", "pruning", "mowing", "soil", "flower", "pot", "grass"], name: "Gardening", icon: "🌱", avgPrice: "₹300–₹700" },
  { id: "beauty", keywords: ["beauty", "salon", "haircut", "facial", "wax", "manicure", "pedicure", "spa", "massage", "makeup", "bridal", "grooming", "threading"], name: "Beauty & Wellness", icon: "💄", avgPrice: "₹500–₹2000" },
];

// ── Quick response chips shown initially and after no-match ──
const quickChips = [
  { label: "❄️ AC not cooling", query: "AC not cooling properly" },
  { label: "💧 Leaking pipe", query: "Water leaking from pipe" },
  { label: "⚡ Power issue", query: "Lights flickering and power problem" },
  { label: "🧹 Deep cleaning", query: "Need deep cleaning for home" },
  { label: "🎨 Wall painting", query: "Want to paint my room" },
  { label: "🐜 Pest problem", query: "Cockroaches and ants in kitchen" },
];

type MessageType = {
  role: "assistant" | "user";
  content: string;
  suggestion?: { id: string; name: string; icon: string; avgPrice: string } | null;
  followUps?: string[];
};

export default function AIServiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your **AI Service Assistant**. Tell me about your home issue and I'll find the perfect expert for you!",
      followUps: undefined,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastCategory, setLastCategory] = useState<(typeof categories)[0] | null>(null);
  const [showQuickChips, setShowQuickChips] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const processMessage = (userMessage: string) => {
    const lowerInput = userMessage.toLowerCase();
    let matchedCategory = null;
    let bestScore = 0;

    for (const cat of categories) {
      let score = 0;
      for (const kw of cat.keywords) {
        if (lowerInput.includes(kw)) {
          score += kw.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        matchedCategory = cat;
      }
    }

    const isPriceQuery = /how much|price|cost|rate|charge|expensive|cheap|budget/i.test(lowerInput);
    const isTimeQuery = /how long|when|time|fast|quick|urgent|emergency|today|tomorrow/i.test(lowerInput);
    const isQualityQuery = /safe|verified|trust|reliable|review|good|quality|guarantee/i.test(lowerInput);

    if (!matchedCategory && lastCategory && (isPriceQuery || isTimeQuery || isQualityQuery)) {
      let response = "";
      if (isPriceQuery) {
        response = `For **${lastCategory.name}**, typical prices range from **${lastCategory.avgPrice}**. Actual cost depends on the job scope. Want to see experts with their rates?`;
      } else if (isTimeQuery) {
        response = `Our **${lastCategory.name}** experts typically respond within **2 hours** and most visits happen **same day**. 🕐 Want to book one now?`;
      } else {
        response = `All our **${lastCategory.name}** experts are **verified**, background-checked, and maintain **4.5★+** ratings. Your satisfaction is guaranteed! 🛡️`;
      }

      return {
        content: response,
        suggestion: lastCategory,
        followUps: ["📋 Book Now", "👀 See All Experts", "💬 Ask Something Else"],
      };
    }

    if (matchedCategory) {
      setLastCategory(matchedCategory);
      const responses = [
        `I can see you need help with **${matchedCategory.name}** ${matchedCategory.icon}. Great choice — we have top-rated experts in this category!\n\nAverage pricing: **${matchedCategory.avgPrice}**`,
        `Sounds like a **${matchedCategory.name}** job ${matchedCategory.icon}! Our verified experts can handle this perfectly.\n\nTypical cost: **${matchedCategory.avgPrice}**`,
        `Got it! **${matchedCategory.name}** ${matchedCategory.icon} is one of our most popular services. Let me connect you with the best pros!\n\nExpected price: **${matchedCategory.avgPrice}**`,
      ];
      return {
        content: responses[Math.floor(Math.random() * responses.length)],
        suggestion: matchedCategory,
        followUps: ["📋 Book Now", "💰 Price Details", "⏰ How Fast?", "🛡️ Is It Safe?"],
      };
    }

    if (/emergency|urgent|asap|right now|immediately/i.test(lowerInput)) {
      return {
        content: "🚨 **Emergency detected!** I'll help you find an expert available right now. Which service do you need urgently?",
        suggestion: null,
        followUps: quickChips.map(c => c.label),
      };
    }

    if (/^(hi|hello|hey|good morning|good evening|good afternoon)/i.test(lowerInput.trim())) {
      return {
        content: "Hello! 👋 I'm here to help you find the perfect home service expert. What issue are you facing today?",
        suggestion: null,
        followUps: quickChips.slice(0, 4).map(c => c.label),
      };
    }

    return {
      content: "I'm not sure which service matches that, but don't worry! You can try one of these common issues below, or browse all our services directly. 👇",
      suggestion: null,
      followUps: quickChips.map(c => c.label),
    };
  };

  const handleSend = (messageOverride?: string) => {
    const userMessage = (messageOverride || input).trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);
    setShowQuickChips(false);

    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const result = processMessage(userMessage);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: result.content,
        suggestion: result.suggestion,
        followUps: result.followUps,
      }]);
      setIsTyping(false);
    }, delay);
  };

  const handleFollowUp = (action: string) => {
    const clean = action.replace(/^[^\w]*/, "").trim().toLowerCase();

    if (clean.startsWith("book now") && lastCategory) {
      setIsOpen(false);
      navigate(`/services/${lastCategory.id}`);
      return;
    }
    if (clean.startsWith("see all experts") && lastCategory) {
      setIsOpen(false);
      navigate(`/services?q=${lastCategory.id}`);
      return;
    }
    if (clean.startsWith("price")) {
      handleSend("How much does it cost?");
      return;
    }
    if (clean.startsWith("how fast")) {
      handleSend("How quickly can someone come?");
      return;
    }
    if (clean.startsWith("is it safe")) {
      handleSend("Are the experts verified and safe?");
      return;
    }
    if (clean.startsWith("ask something")) {
      inputRef.current?.focus();
      return;
    }

    handleSend(action);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/30 text-white cursor-pointer group overflow-hidden"
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
            className="fixed bottom-24 right-6 z-50 w-[360px] md:w-[420px] h-[600px] max-h-[80vh]"
          >
            <Card className="flex flex-col h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2rem] overflow-hidden">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-black tracking-tight text-base">AI Service Assistant</h3>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                        <p className="text-xs text-blue-100 font-medium">Online • Instant help</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="h-20 w-20" />
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide bg-slate-50/50 dark:bg-slate-950/20"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 5 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[88%] flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`mt-1 shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                        {msg.role === 'user' ? <User className="h-3.5 w-3.5 text-blue-600" /> : <Bot className="h-3.5 w-3.5 text-purple-600" />}
                      </div>
                      <div className="space-y-2.5">
                        <div className={`p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                          msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm font-semibold'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200 dark:border-slate-700'
                        }`}>
                          <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                        </div>

                        {/* Category suggestion card */}
                        {msg.suggestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Button
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/services/${msg.suggestion!.id}`);
                              }}
                              className="w-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 rounded-xl py-5 flex items-center justify-between group h-auto shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{msg.suggestion.icon}</span>
                                <div className="text-left">
                                  <p className="font-black text-sm">View {msg.suggestion.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Explore verified experts →</p>
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </motion.div>
                        )}

                        {/* Follow-up quick reply buttons */}
                        {msg.followUps && msg.followUps.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="flex flex-wrap gap-1.5"
                          >
                            {msg.followUps.map((fu, fi) => (
                              <button
                                key={fi}
                                onClick={() => handleFollowUp(fu)}
                                className="px-3 py-1.5 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all hover:scale-105 active:scale-95"
                              >
                                {fu}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="flex gap-2.5">
                      <div className="mt-1 shrink-0 h-7 w-7 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                        <Bot className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                              className="h-2 w-2 bg-blue-400 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Chips Area */}
              {showQuickChips && messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 pb-2"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Quick Issues</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickChips.map((chip, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleSend(chip.query)}
                        className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        {chip.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Input */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2"
                >
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your issue..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl h-12 px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-blue-600/20 shrink-0 transition-all active:scale-95"
                    disabled={!input.trim() || isTyping}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
                <p className="text-[10px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest">
                  Powered by ServiceHub AI • Instant Recommendations
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
