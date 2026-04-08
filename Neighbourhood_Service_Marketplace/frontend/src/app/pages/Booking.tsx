import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, MapPin, User, Mail, Phone, MessageSquare,
  ArrowLeft, ShieldCheck, CheckCircle2, Loader2, AlertCircle, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import { useAppContext } from "../context/AppContext";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

export default function Booking() {
  const { providerId: serviceId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAppContext();

  const [service, setService] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  // Populate form from user context once available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${serviceId}`, { credentials: 'include' });
        if (!res.ok) throw new Error("Service not found");
        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error(err);
        setError("Could not load service details.");
      } finally {
        setIsLoading(false);
      }
    };
    if (serviceId) fetchService();
  }, [serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Auth gate — redirect to login if not logged in
    if (!user) {
      navigate(`/auth?redirect=/booking/${serviceId}`);
      return;
    }

    if (!date) { setError("Please select a service date."); return; }
    if (!selectedTime) { setError("Please select a time slot."); return; }
    if (!formData.phone) { setError("Please enter your phone number."); return; }
    if (!formData.address) { setError("Please enter your service address."); return; }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        credentials: 'include',           
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          date: format(date, "yyyy-MM-dd"),
          timeSlot: selectedTime,
          description: formData.message,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => navigate('/'), 3500);
      } else if (response.status === 401) {
        setError("You must be logged in to book a service.");
        setTimeout(() => navigate(`/auth?redirect=/booking/${serviceId}`), 1500);
      } else {
        setError(data.message || "Booking failed. Please try again.");
      }

    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading skeleton
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] text-center max-w-lg w-full shadow-2xl dark:shadow-black/40 border border-slate-100 dark:border-slate-800"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Booking Confirmed!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-3">
            Your request has been sent to <span className="font-bold text-slate-900 dark:text-white">{service?.provider?.name || "the expert"}</span>.
          </p>

          <p className="text-slate-400 dark:text-slate-500 mb-8 text-sm font-medium">
            They will contact you at <span className="text-blue-600">{formData.phone}</span> to confirm the appointment.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting to home...
          </div>
        </motion.div>
      </div>
    );
  }

  // Not logged in — show gate
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Sign In Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
            You need to be logged in to book a service. It only takes 30 seconds.
          </p>
          <Link to={`/auth?redirect=/booking/${serviceId}`}>
            <Button size="lg" className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-lg shadow-blue-600/20">
              Sign In / Register
            </Button>
          </Link>
          <Link to={`/`} className="block mt-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-sm">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // Self-booking prevention
  const isSelfBooking = user?._id === service?.provider?._id || user?.id === service?.provider?._id;
  if (isSelfBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Booking Restricted</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
            You cannot book your own service. To manage your listings, please visit your provider dashboard.
          </p>
          <Link to="/bookings">
            <Button size="lg" className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg">
              Go to Dashboard
            </Button>
          </Link>
          <button onClick={() => navigate(-1)} className="block mt-4 w-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-sm">
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <Link to={`/services`} className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all mb-10 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          BACK TO SERVICES
        </Link>


        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          {/* ── BOOKING FORM ── */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Schedule Service</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Fill in the details and confirm your booking in seconds.</p>
            </motion.div>

            {/* Global error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-400"
              >
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <p className="font-semibold text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Details */}
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
                <h2 className="text-xl font-black dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-7 w-1 bg-blue-600 rounded-full" />
                  Contact Details
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", icon: User, key: "name", type: "text", placeholder: "Your full name" },
                    { label: "Email Address", icon: Mail, key: "email", type: "email", placeholder: "you@example.com" },
                    { label: "Phone Number", icon: Phone, key: "phone", type: "tel", placeholder: "+91 98765 43210" },
                    { label: "Service Address", icon: MapPin, key: "address", type: "text", placeholder: "Flat/House, Street, City" },
                  ].map(({ label, icon: Icon, key, type, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</Label>
                      <div className="relative">
                        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type={type}
                          required
                          placeholder={placeholder}
                          className="pl-10 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20"
                          value={(formData as any)[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Date & Time */}
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
                <h2 className="text-xl font-black dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-7 w-1 bg-purple-600 rounded-full" />
                  Date & Time
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Service Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-medium bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl dark:text-white gap-3"
                        >
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {date ? format(date, "PPP") : <span className="text-slate-400">Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden border-slate-200 dark:border-slate-800 dark:bg-slate-900" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Preferred Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl dark:text-white">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <SelectValue placeholder="Choose a slot" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl dark:bg-slate-900 dark:border-slate-800">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="font-medium">{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Job Description */}
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
                <h2 className="text-xl font-black dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-7 w-1 bg-emerald-500 rounded-full" />
                  Describe the Job
                </h2>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                  <Textarea
                    placeholder="e.g., 'AC unit is making a loud noise and not cooling properly. It's a 1.5 ton split AC.'"
                    className="pl-11 min-h-[140px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl py-3 dark:text-white resize-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </Card>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-lg font-black shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing Booking...</>
                ) : (
                  <><CheckCircle2 className="h-5 w-5" /> Confirm Booking Request</>
                )}
              </Button>

              <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                🔒 Your information is encrypted and stored securely. No payment required until job completion.
              </p>
            </form>
          </div>

          {/* ── BOOKING SUMMARY SIDEBAR ── */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 space-y-4"
            >
              <Card className="overflow-hidden rounded-3xl border-0 shadow-2xl dark:shadow-black/40">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <ShieldCheck className="h-28 w-28" />
                  </div>
                  <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-1">Booking Summary</p>
                  <h2 className="text-2xl font-black tracking-tight">{service?.provider?.name || "Expert"}</h2>
                  <p className="text-blue-200 font-semibold text-sm mt-0.5">{service?.title || "Service"}</p>

                </div>

                {/* Details */}
                <div className="bg-white dark:bg-slate-900 p-6 space-y-4">
                  {[
                    { label: "Date", value: date ? format(date, "MMM dd, yyyy") : "Not selected", icon: Calendar },
                    { label: "Time", value: selectedTime || "Not selected", icon: Clock },
                    { label: "Location", value: formData.address || "Not entered", icon: MapPin },
                    { label: "Contact", value: formData.phone || "Not entered", icon: Phone },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="font-bold text-sm">{label}</span>
                      </div>
                      <span className={`font-black text-sm text-right max-w-[55%] truncate ${value.includes('Not') ? 'text-slate-300 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}>
                        {value}
                      </span>
                    </div>
                  ))}

                  {/* Rate */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400 text-sm">Service Price</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{service?.price || 0}</span>
                  </div>

                </div>

                {/* Safety note */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      Protected by ServiceHub Guarantee. Pay only after the job is done to your satisfaction.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}