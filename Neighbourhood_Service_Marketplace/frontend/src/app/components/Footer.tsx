import { Link } from "react-router-dom";
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
    { label: "About Us", to: "/" },
    { label: "How It Works", to: "/#how-it-works" },
    { label: "Become a Provider", to: "/auth?role=provider" },
    { label: "Browse All", to: "/services" },
    { label: "Sign In", to: "/auth" },
  ],
  Support: [
    { label: "Help Center", to: "/" },
    { label: "Safety Tips", to: "/" },
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Service", to: "/" },
    { label: "Contact Us", to: "/" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

const stats = [
  { icon: Shield, value: "10,000+", label: "Verified Pros" },
  { icon: Star, value: "4.9★", label: "Average Rating" },
  { icon: Zap, value: "50,000+", label: "Jobs Completed" },
  { icon: Heart, value: "98%", label: "Satisfaction Rate" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Stats Row */}
      <div className="border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center space-x-3 group">
                <div className="p-2.5 bg-blue-600/20 rounded-xl group-hover:bg-blue-600/30 transition-colors">
                  <stat.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">ServiceHub</span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm font-medium">
              Connecting neighbourhoods with trusted service professionals. Fast, reliable, and community-driven.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5">
              {[
                { icon: Mail, text: "support@servicehub.in" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: MapPin, text: "Mumbai, Maharashtra, India" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2.5 text-slate-400 hover:text-blue-400 transition-colors group">
                  <item.icon className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="h-9 w-9 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-600 rounded-xl flex items-center justify-center transition-all group"
                >
                  <social.icon className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="space-y-5">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-1.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-400" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm font-medium">
            © 2026 ServiceHub. Built with <Heart className="h-3.5 w-3.5 inline text-rose-500 mx-1" /> for Hackathon.
          </p>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-bold">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
