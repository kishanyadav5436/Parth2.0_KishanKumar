import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  HelpCircle, Shield, FileText, ScrollText, Mail,
  Phone, MapPin, ChevronDown, CheckCircle, AlertTriangle,
  Lock, UserCheck, Eye, MessageSquare, Clock, Star
} from "lucide-react";

const tabs = [
  { id: "help", label: "Help Center", icon: HelpCircle },
  { id: "safety", label: "Safety Tips", icon: Shield },
  { id: "privacy", label: "Privacy Policy", icon: Lock },
  { id: "terms", label: "Terms of Service", icon: ScrollText },
  { id: "contact", label: "Contact Us", icon: Mail },
];

const faqs = [
  {
    q: "How do I book a service?",
    a: "Browse services or categories on the home page, click on a service card, view the provider's profile, then click 'Book Now'. Fill in your details and confirm the booking.",
  },
  {
    q: "Are all service providers verified?",
    a: "Yes! Every provider on ServiceHub goes through a background check and identity verification process before being listed. Look for the 'Verified Pro' badge.",
  },
  {
    q: "How do I cancel or reschedule a booking?",
    a: "Go to 'My Bookings' from the navigation menu. Find your booking and click 'Cancel' or contact the provider directly to reschedule.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support UPI, credit/debit cards, net banking, and cash on service. Payment is processed securely after service completion.",
  },
  {
    q: "How do I become a service provider?",
    a: "Click 'Become a Provider' from the navigation or footer. Register with the 'Provider' role, fill in your service details, and our team will verify your profile within 24 hours.",
  },
  {
    q: "What if I'm not satisfied with the service?",
    a: "Contact us within 48 hours of service completion. We offer a 100% satisfaction guarantee and will arrange a re-service or full refund.",
  },
];

function HelpCenter() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Frequently Asked Questions</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Everything you need to know about ServiceHub. Can't find an answer? Contact our support team.</p>
      </div>
      <div className="space-y-3 max-w-3xl mx-auto">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={false}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left group"
            >
              <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-4">{faq.q}</span>
              <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-300 ${open === i ? "rotate-180 text-blue-500" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-6 pb-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SafetyTips() {
  const tips = [
    { icon: UserCheck, title: "Check Verified Badge", desc: "Always hire providers with the 'Verified Pro' badge. They've passed our background checks and identity verification." },
    { icon: Star, title: "Read Reviews First", desc: "Check the provider's ratings and customer reviews before booking. Providers with 4.5★ or higher are our top picks." },
    { icon: Eye, title: "Meet in Safe Spaces", desc: "For first-time service, ensure someone you trust is present at home. Share your booking details with a family member." },
    { icon: Lock, title: "Never Share OTPs", desc: "ServiceHub will never ask for your OTP or password. Do not share sensitive credentials with providers or anyone claiming to be us." },
    { icon: FileText, title: "Get a Service Receipt", desc: "Always request a digital receipt after service completion. This is your proof of service for any disputes or warranty claims." },
    { icon: AlertTriangle, title: "Report Suspicious Activity", desc: "If a provider asks for unusual payments or behaves suspiciously, report them immediately via the Contact Us section." },
  ];
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Safety Tips</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Your safety is our top priority. Follow these guidelines for a secure service experience.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 p-6 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <tip.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-base mb-2">{tip.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  const sections = [
    { title: "Information We Collect", content: "We collect information you provide directly to us, such as your name, email address, phone number, and location when you register for an account, book a service, or contact us for support. We also collect usage data such as pages visited, features used, and time spent on the platform." },
    { title: "How We Use Your Information", content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices, respond to your comments and questions, and send you information about services, promotions, and events." },
    { title: "Information Sharing", content: "We share your personal information with service providers only as necessary to fulfil your booking requests. We do not sell, trade, or rent your personal identification information to third parties. We may share aggregated, anonymized data for analytics purposes." },
    { title: "Data Security", content: "We take security seriously and implement industry-standard measures including HTTPS encryption, secure password hashing, and regular security audits to protect your personal information from unauthorized access, alteration, or disclosure." },
    { title: "Cookies", content: "We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies, but this may limit some features of our service." },
    { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data at any time. You may also object to processing, request data portability, or withdraw consent where processing is based on consent. Contact us at support@servicehub.in to exercise these rights." },
  ];
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Privacy Policy</h2>
        <p className="text-slate-500 dark:text-slate-400">Last updated: April 2026 &nbsp;·&nbsp; Effective immediately</p>
      </div>
      <div className="space-y-6">
        {sections.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 p-6 shadow-sm">
            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />{s.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TermsOfService() {
  const sections = [
    { title: "Acceptance of Terms", content: "By accessing and using ServiceHub, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our platform." },
    { title: "User Accounts", content: "You must register for an account to book or offer services. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
    { title: "Service Provider Obligations", content: "Service providers agree to maintain accurate profile information, provide services as described, arrive on time for bookings, and behave professionally. ServiceHub reserves the right to remove providers who violate these standards." },
    { title: "Booking & Payments", content: "Bookings are confirmed only upon receiving a confirmation notification from ServiceHub. Payments must be completed as agreed. Disputes regarding payments should be reported within 48 hours of service completion." },
    { title: "Prohibited Activities", content: "Users may not use the platform for fraudulent activities, false representations, harassment, or any illegal purposes. Any violation may result in immediate account suspension without refund." },
    { title: "Limitation of Liability", content: "ServiceHub acts as a marketplace connecting customers and providers. We are not liable for the quality of services rendered, though we maintain verification standards and a dispute resolution process to protect all users." },
  ];
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Terms of Service</h2>
        <p className="text-slate-500 dark:text-slate-400">Last updated: April 2026 &nbsp;·&nbsp; Please read carefully before using our platform</p>
      </div>
      <div className="space-y-6">
        {sections.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 p-6 shadow-sm">
            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-3 flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-blue-500 shrink-0" />{s.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactUs() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Contact Us</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Have a question or need help? Our support team is here for you 24/7.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email Support", value: "support@servicehub.in", sub: "We reply within 2 hours" },
            { icon: Phone, label: "Phone Support", value: "+91 98765 43210", sub: "Mon–Sat, 9 AM – 8 PM" },
            { icon: MapPin, label: "Office Address", value: "ServiceHub HQ, Bandra Kurla Complex", sub: "Mumbai, Maharashtra 400051" },
            { icon: Clock, label: "Support Hours", value: "24/7 Online Chat", sub: "via AI Assistant on the site" },
            { icon: MessageSquare, label: "Community Forum", value: "forum.servicehub.in", sub: "Ask the community" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="font-black text-slate-900 dark:text-white text-sm">{item.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 p-8 shadow-sm">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-10 gap-4"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Message Sent!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Thanks for reaching out. Our support team will get back to you within 2 hours.</p>
              <button onClick={() => setSent(false)} className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Send another message</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-black text-slate-900 dark:text-white text-lg mb-2">Send us a message</h3>
              {[
                { id: "name", label: "Your Name", type: "text", placeholder: "Kishan Kumar" },
                { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                { id: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    value={(form as any)[field.id]}
                    onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue or question in detail..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const tabContent: Record<string, JSX.Element> = {
  help: <HelpCenter />,
  safety: <SafetyTips />,
  privacy: <PrivacyPolicy />,
  terms: <TermsOfService />,
  contact: <ContactUs />,
};

export default function Support() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "help";
  const tab = tabContent[tabParam] ? tabParam : "help";

  const setTab = (id: string) => setSearchParams({ tab: id });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <div className="relative overflow-hidden bg-blue-950 py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <HelpCircle className="h-3.5 w-3.5" /> Support Center
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight mb-4">How can we <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">help you?</span></h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Browse FAQs, safety guidelines, policies, or get in touch — we're here 24/7.</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                  tab === t.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {tabContent[tab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

