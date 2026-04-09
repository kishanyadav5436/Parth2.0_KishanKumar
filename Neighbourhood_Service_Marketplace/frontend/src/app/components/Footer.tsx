import { Link, useNavigate } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Github, Twitter, Instagram, Linkedin, ArrowRight, Heart, Shield, Star, Zap } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "AC Repair", to: "/services/ac-repair" },
    { label: "Plumbing", to: "/services/plumbing" },
    { label: "Electrician", to: "/services/electrical" },
    { label: "Home Cleaning", to: "/services/cleaning" },
    { label: "Painting", to: "/services/painting" },
    { label: "Gardening", to: "/services/gardening" },
  ],
  Company: [
    { label: "About Us", to: "/services" },
    { label: "How It Works", to: "/services", anchor: "how-it-works" },
    { label: "Become a Provider", to: "/auth?role=provider" },
    { label: "Browse All", to: "/services" },
    { label: "Sign In", to: "/auth" },
  ],
  Support: [
    { label: "Help Center", to: "/auth" },
    { label: "Safety Tips", to: "/services" },
    { label: "Privacy Policy", to: "/auth" },
    { label: "Terms of Service", to: "/auth" },
    { label: "Contact Us", to: "/auth" },
  ],
};


const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
];

const stats = [
  { icon: Shield, value: "10,000+", label: "Verified Pros" },
  { icon: Star, value: "4.9★", label: "Average Rating" },
  { icon: Zap, value: "50,000+", label: "Jobs Completed" },
  { icon: Heart, value: "98%", label: "Satisfaction Rate" },
];

export default function Footer() {
  const navigate = useNavigate();

  const handleNavClick = (to: string, anchor?: string) => {
    navigate(to);
    if (anchor) {
      // Allow time for the page to render before scrolling to anchor
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-black text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500 border-t border-slate-200 dark:border-white/5">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Stats Row */}
      <div className="border-b border-slate-200 dark:border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center space-x-4 group">
                <div className="p-3 bg-blue-600/10 dark:bg-blue-600/20 rounded-2xl group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-600/20">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">ServiceHub</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base max-w-sm font-medium">
              Revolutionizing local service discovery by connecting verified professionals with your neighbourhood. Simple, fast, and trusted.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: Mail, text: "support@servicehub.in" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: MapPin, text: "Mumbai, Maharashtra, India" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group cursor-default">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-sm font-bold">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-11 w-11 bg-white dark:bg-white/5 hover:bg-blue-600 dark:hover:bg-blue-600 border border-slate-200 dark:border-white/10 hover:border-blue-600 dark:hover:border-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group shadow-sm hover:shadow-blue-600/30 hover:shadow-lg"
                >
                  <social.icon className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="space-y-7">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{heading}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavClick(link.to, (link as any).anchor)}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-all flex items-center group cursor-pointer bg-transparent border-none p-0"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-bold flex-1 text-center md:text-left">
            Service Support Company © 2026 ServiceHub.
          </div>
          <div className="text-slate-400 dark:text-slate-600 text-xs font-medium flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            Crafted with <Heart className="h-3.5 w-3.5 mx-1.5 text-rose-500 fill-rose-500" /> for the Hackathon judges.
          </div>
          <div className="flex items-center space-x-4 flex-1 justify-center md:justify-end">
             <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-full border border-emerald-100 dark:border-emerald-900/30">
               <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">Global Status: Live</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

