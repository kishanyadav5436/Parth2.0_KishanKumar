import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Star, Shield, Clock, TrendingUp, ArrowRight, BadgeCheck,
  MapPin, Zap, Heart, Award, CheckCircle, Users, Quote
} from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import CategoryCard from "../components/CategoryCard";
import ServiceCard from "../components/ServiceCard";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";

const categories = [
  { id: "ac-repair", name: "AC Repair", icon: "❄️", image: "https://images.unsplash.com/photo-1630481721508-5d37097dd8fc?auto=format&fit=crop&q=80&w=400", providers: 68 },
  { id: "plumbing", name: "Plumbing", icon: "🔧", image: "https://images.unsplash.com/photo-1620253610989-3ab05e06030c?auto=format&fit=crop&q=80&w=400", providers: 92 },
  { id: "electrical", name: "Electrician", icon: "⚡", image: "https://images.unsplash.com/photo-1626501244050-ad05a356bb27?auto=format&fit=crop&q=80&w=400", providers: 84 },
  { id: "cleaning", name: "Home Cleaning", icon: "🧹", image: "https://images.unsplash.com/photo-1775178120132-f0ff7fd5cb40?auto=format&fit=crop&q=80&w=400", providers: 156 },
  { id: "painting", name: "Painting", icon: "🎨", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=400", providers: 45 },
  { id: "gardening", name: "Gardening", icon: "🌱", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400", providers: 32 },
  { id: "beauty", name: "Beauty & Wellness", icon: "💄", image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=400", providers: 110 },
  { id: "pest-control", name: "Pest Control", icon: "🐜", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400", providers: 28 },
];

const locations = [
  "Mumbai, Maharashtra", "Delhi, NCR", "Bangalore, Karnataka",
  "Pune, Maharashtra", "Hyderabad, Telangana", "Chennai, Tamil Nadu",
  "Kolkata, West Bengal", "Ahmedabad, Gujarat",
];

const testimonials = [
  { name: "Priya Sharma", role: "Homeowner, Mumbai", text: "Found an amazing AC technician within minutes. Professional, on-time, and very affordable. Will definitely use ServiceHub again!", rating: 5, avatar: "P" },
  { name: "Rohit Mehta", role: "Apartment Owner, Delhi", text: "The plumber came within 2 hours of booking. Fixed the leak perfectly. The whole experience was seamless!",rating: 5, avatar: "R" },
  { name: "Ananya Nair", role: "Working Professional, Bangalore", text: "Home cleaning service exceeded all expectations. The team was thorough and left my home spotless. Highly recommend!", rating: 5, avatar: "A" },
];

// Animated counter hook
function useAnimatedCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count, ref };
}

// Stats counter component
function StatCounter({ value, suffix, label, icon: Icon, color }: any) {
  const { count, ref } = useAnimatedCounter(value);
  return (
    <div ref={ref} className="text-center group">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${color} shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{label}</p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [featuredProviders, setFeaturedProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (location) params.append("loc", location);
    navigate(`/services?${params.toString()}`);
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Auto rotate testimonials
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        const mappedData = data.slice(0, 3).map((d: any) => ({
          id: d._id,
          providerId: d.provider?._id || d.provider,
          name: d.provider?.name || "Premium Provider",

          service: d.title,
          category: d.category,
          rating: d.rating || 5,
          reviews: d.reviews || 0,
          price: `₹${d.price}/hr`,
          location: d.location || "Mumbai, Maharashtra",
          image: d.image || "https://images.unsplash.com/photo-1581578731548-c64695ce6952?auto=format&fit=crop&q=80&w=400",
          verified: true,
          experience: "Expert"
        }));
        setFeaturedProviders(mappedData);
      })

      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative overflow-hidden mesh-gradient py-24 md:py-36 px-4 noise-overlay">
        {/* Floating orbs */}
        <div className="absolute top-10 left-[10%] w-64 h-64 bg-white/5 rounded-full blur-3xl float-anim pointer-events-none" />
        <div className="absolute bottom-10 right-[10%] w-48 h-48 bg-purple-400/10 rounded-full blur-3xl float-anim-delay pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-bold px-5 py-2 rounded-full mb-8 gap-2"
            >
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
              🏆 #1 Neighbourhood Services Platform in India
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[0.95]">
              Your Home,{" "}
              <span className="block text-glow text-blue-200">
                Perfectly Cared For
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-50/80 max-w-2xl mx-auto leading-relaxed font-medium">
              Book verified local experts in seconds. Trusted by <span className="text-white font-bold">50,000+</span> happy homeowners across India.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-card rounded-2xl p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-[2] flex items-center px-4 gap-3">
                  <Search className="h-5 w-5 text-white/60 shrink-0" />
                  <Input
                    placeholder="What service do you need?"
                    className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-white/50 text-base h-12 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="h-px md:h-auto md:w-px bg-white/20 mx-2" />
                <div className="flex-1 flex items-center px-4 gap-3">
                  <MapPin className="h-5 w-5 text-white/60 shrink-0" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Input
                        placeholder="Your location"
                        className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-white/50 text-base h-12 cursor-pointer font-medium"
                        value={location}
                        readOnly
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
                      <p className="px-3 py-2 text-xs font-black text-slate-400 uppercase tracking-widest">Popular Cities</p>
                      {locations.map((loc) => (
                        <button key={loc} onClick={() => setLocation(loc)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm font-semibold transition-colors dark:text-white flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-blue-400" />{loc}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="btn-glow bg-white text-blue-600 hover:bg-blue-50 md:w-auto w-full px-8 h-12 rounded-xl font-black text-base shadow-xl transition-all hover:scale-105"
                >
                  Search Now
                </Button>
              </div>

              {/* Trust chips */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-white/75 text-sm font-medium">
                {[
                  { icon: BadgeCheck, text: "100% Verified Pros" },
                  { icon: Shield, text: "Insured & Bonded" },
                  { icon: Star, text: "4.9★ Average Rating" },
                  { icon: Zap, text: "2-Hour Response" },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/15">
                    <item.icon className="h-4 w-4 text-blue-200" />
                    {item.text}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────── */}
      <section className="relative z-20 py-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <StatCounter value={50000} suffix="+" label="Happy Customers" icon={Users} color="bg-blue-600" />
            <StatCounter value={10000} suffix="+" label="Verified Experts" icon={Shield} color="bg-emerald-600" />
            <StatCounter value={98} suffix="%" label="Satisfaction Rate" icon={Heart} color="bg-rose-500" />
            <StatCounter value={250} suffix="+" label="Cities Covered" icon={MapPin} color="bg-purple-600" />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4"
          >
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs mb-3">What We Offer</p>
              <h2 className="text-4xl md:text-5xl font-black dark:text-white tracking-tight leading-tight">
                Browse by Category
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium max-w-lg">
                Every professional service you need, right in your neighbourhood.
              </p>
            </div>
            <Link to="/services" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-black gap-2 hover:gap-3 transition-all group text-sm uppercase tracking-widest">
              View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-blue-600 font-black uppercase tracking-widest text-xs mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-6xl font-black dark:text-white tracking-tight mb-4">
              3 Steps to a<br />
              <span className="gradient-text">Perfect Home</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-xl mx-auto">
              From search to service completed — we make it effortless.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-cyan-200 dark:from-blue-900 dark:via-purple-900 dark:to-cyan-900 z-0" />

            {[
              { step: "01", title: "Search & Discover", desc: "Browse hundreds of verified experts by category or search for exactly what you need.", icon: Search, color: "bg-blue-600", glow: "shadow-blue-600/30" },
              { step: "02", title: "Book Instantly", desc: "Pick your time slot and confirm your booking with safe & secure payment in under 60 seconds.", icon: Clock, color: "bg-purple-600", glow: "shadow-purple-600/30" },
              { step: "03", title: "Enjoy the Results", desc: "Your expert arrives on time and delivers quality work — backed by our satisfaction guarantee.", icon: CheckCircle, color: "bg-emerald-600", glow: "shadow-emerald-600/30" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 text-center group"
              >
                <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ${item.glow} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl font-black text-slate-100 dark:text-slate-800 -z-10 select-none">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROVIDERS ──────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-blue-600 font-black uppercase tracking-widest text-xs mb-3">Community Stars</p>
            <h2 className="text-4xl md:text-5xl font-black dark:text-white tracking-tight">
              Neighbourhood Favourites
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">
              Hand-picked top professionals, loved by thousands of clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[380px] w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[2rem] shimmer" />
              ))
            ) : featuredProviders.length > 0 ? (
              featuredProviders.map((provider, i) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ServiceCard provider={provider} />
                </motion.div>
              ))
            ) : (
              // Fallback mock cards if no API data
              [
                { id: "1", name: "Rajesh Sharma", service: "AC Repair", rating: 4.9, reviews: 127, price: "₹450/hr", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400", verified: true, experience: "10 years", location: "Mumbai, Maharashtra" },
                { id: "2", name: "Priya Patel", service: "Home Cleaning", rating: 4.8, reviews: 203, price: "₹300/hr", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", verified: true, experience: "6 years", location: "Delhi, NCR" },
                { id: "3", name: "Amit Verma", service: "Electrician", rating: 4.7, reviews: 89, price: "₹500/hr", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", verified: true, experience: "8 years", location: "Bangalore, Karnataka" },
              ].map((provider, i) => (
                <motion.div key={provider.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ServiceCard provider={provider} />
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" variant="outline" className="h-12 px-10 rounded-2xl font-black border-2 dark:border-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 gap-2">
                See All Experts <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────── */}
      <section className="py-24 px-4 bg-white dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-blue-600 font-black uppercase tracking-widest text-xs mb-4">Our Edge</p>
              <h2 className="text-4xl md:text-5xl font-black dark:text-white tracking-tight leading-tight mb-8">
                Built on <span className="gradient-text">Trust.</span><br />
                Powered by <span className="gradient-text">Community.</span>
              </h2>
              <div className="space-y-5">
                {[
                  { icon: BadgeCheck, title: "Rigorous 5-Step Verification", desc: "Every pro passes background checks, skill tests, and identity verification.", color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
                  { icon: Award, title: "Satisfaction Guarantee", desc: "If you're not 100% happy, we'll make it right or give you a full refund.", color: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
                  { icon: Zap, title: "Real-Time Booking", desc: "See live availability and get confirmed instantly — no waiting, no calls.", color: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
                  { icon: Shield, title: "Insured Work", desc: "All jobs are covered by our service guarantee policy for your peace of mind.", color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`p-3 rounded-2xl ${item.color} shrink-0`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black dark:text-white">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image + floating testimonial */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695ce6952?auto=format&fit=crop&q=80&w=800"
                  alt="Expert Service"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Floating stat card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 hidden md:block max-w-[220px]"
              >
                <div className="flex -space-x-2 mb-3">
                  {["B", "P", "R", "A"].map((l, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-black">{l}</div>
                  ))}
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">50k+</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Happy customers this year</p>
              </motion.div>

              {/* Floating rating card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 hidden md:block"
              >
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white">4.9 / 5.0</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Based on 12,500+ reviews</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-600 font-black uppercase tracking-widest text-xs mb-3">Social Proof</p>
            <h2 className="text-4xl md:text-5xl font-black dark:text-white tracking-tight">
              Loved by Homeowners
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:shadow-black/30 transition-shadow group"
              >
                <Quote className="h-8 w-8 text-blue-200 dark:text-blue-900 mb-4" />
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-95" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-bold px-5 py-2 rounded-full mb-8 gap-2">
              🔧 Join 10,000+ Active Providers
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Turn Your Skills Into a<br />
              <span className="text-blue-200">Thriving Business</span>
            </h2>
            <p className="text-xl text-white/80 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              Join ServiceHub as a provider and connect with thousands of customers in your city. Free to join, no commission on first 10 jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/auth?role=provider')}
                className="btn-glow bg-white text-blue-600 hover:bg-blue-50 px-10 h-14 rounded-2xl text-lg font-black shadow-2xl transition-transform hover:scale-105"
              >
                Apply as Provider — It's Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="px-10 h-14 rounded-2xl text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-colors"
              >
                Learn How It Works
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}