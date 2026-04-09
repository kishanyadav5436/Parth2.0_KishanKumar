import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, MapPin, Phone, User, CheckCircle2,
  XCircle, AlertCircle, Loader2, Lock, RefreshCw,
  ArrowRight, Package, Star, Banknote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAppContext } from "../context/AppContext";
import { format } from "date-fns";
import { API_BASE_URL } from "../config";

type BookingStatus = "pending" | "accepted" | "completed" | "rejected";

interface Booking {
  _id: string;
  provider: { _id: string; name: string; email: string };
  customer: { _id: string; name: string; email: string };
  service: { _id: string; title: string; category: string; price: number };
  date: string;

  timeSlot: string;
  description: string;
  phone: string;
  address: string;
  paymentMethod?: string;
  status: BookingStatus;
  createdAt: string;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; icon: any; dot: string }> = {
  pending: {
    label: "Pending",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    icon: AlertCircle,
    dot: "bg-amber-400",
  },
  accepted: {
    label: "Accepted",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    icon: CheckCircle2,
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Cancelled",
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800",
    icon: XCircle,
    dot: "bg-rose-500",
  },
};

const tabs: { id: string; label: string; statuses: BookingStatus[] | null }[] = [
  { id: "all", label: "All Bookings", statuses: null },
  { id: "active", label: "Active", statuses: ["pending", "accepted"] },
  { id: "completed", label: "Completed", statuses: ["completed"] },
  { id: "cancelled", label: "Cancelled", statuses: ["rejected"] },
];

export default function MyBookings() {
  const { user, isLoading: authLoading } = useAppContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/bookings");
      return;
    }
    if (!authLoading && user) fetchBookings();
  }, [user, authLoading]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(bookingId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "rejected" } : b))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab?.statuses) return true;
    return tab.statuses.includes(b.status);
  });

  const isProvider = user?.role === "provider";

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center shadow-xl border border-slate-100 dark:border-slate-800 max-w-sm w-full">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Sign In Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium text-sm">Please log in to view your bookings.</p>
          <Link to="/auth?redirect=/bookings">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-400/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs mb-2">
                {isProvider ? "Provider Dashboard" : "My Account"}
              </p>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {isProvider ? "Incoming Requests" : "My Bookings"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {isProvider
                  ? "Manage service requests from customers."
                  : "Track all your service appointments."}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={fetchBookings}
              disabled={isLoading}
              className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-700 dark:text-white gap-2 font-bold"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total", count: bookings.length, color: "text-slate-900 dark:text-white", bg: "bg-white dark:bg-slate-900" },
              { label: "Pending", count: bookings.filter(b => b.status === "pending").length, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "Completed", count: bookings.filter(b => b.status === "completed").length, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Cancelled", count: bookings.filter(b => b.status === "rejected").length, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-center`}>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.count}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              {tab.label}
              {tab.statuses && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                  {bookings.filter(b => tab.statuses!.includes(b.status)).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Booking List */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </motion.div>
          ) : filteredBookings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
            >
              <Package className="h-14 w-14 mx-auto text-slate-200 dark:text-slate-700 mb-4" />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No bookings here</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                {activeTab === "all" ? "You haven't made any bookings yet." : `No ${activeTab} bookings found.`}
              </p>
              {!isProvider && (
                <Link to="/services">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 gap-2">
                    Browse Services <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {filteredBookings.map((booking, i) => {
                const status = statusConfig[booking.status];
                const StatusIcon = status.icon;
                const otherParty = isProvider ? booking.customer : booking.provider;

                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all overflow-hidden"
                  >
                    {/* Top stripe by status */}
                    <div className={`h-1 w-full ${status.dot}`} />

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-5">
                        {/* Left: who + status */}
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                            {otherParty?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">
                              {isProvider ? "Customer" : "Service Provider"}
                            </p>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">
                              {booking.service?.title || booking.provider?.name || "Unknown Service"}
                            </h3>

                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                              {otherParty?.email || ""}
                            </p>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold ${status.bg} ${status.color} shrink-0`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </div>
                      </div>

                      {/* Details grid */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
                        {[
                          { icon: Calendar, label: "Date", value: booking.date ? format(new Date(booking.date), "MMM dd, yyyy") : "—" },
                          { icon: Clock, label: "Time", value: booking.timeSlot || "Not specified" },
                          { icon: Phone, label: "Phone", value: booking.phone || "Not provided" },
                          { icon: MapPin, label: "Address", value: booking.address || "Not provided" },
                          { icon: Banknote, label: "Payment", value: booking.paymentMethod ? booking.paymentMethod.toUpperCase() : "CASH" },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Icon className="h-3.5 w-3.5 text-slate-400" />
                              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{label}</p>
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Status Progress Tracker */}
                      <div className="mb-8 mt-2 px-2">
                        <div className="flex justify-between items-center relative">
                          {/* Background Line */}
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
                          
                          {/* Active Line (only for accepted/completed) */}
                          {(booking.status === 'accepted' || booking.status === 'completed') && (
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: booking.status === 'completed' ? '100%' : '50%' }}
                              className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0"
                            />
                          )}

                          {[
                            { id: "pending", icon: Clock, label: "Booking Placed" },
                            { id: "accepted", icon: Package, label: "Confirmed" },
                            { id: "completed", icon: CheckCircle2, label: "Finished" },
                          ].map((step, idx) => {
                            const isPast = (booking.status === 'accepted' && (step.id === 'pending')) || 
                                          (booking.status === 'completed' && (step.id === 'pending' || step.id === 'accepted'));
                            const isCurrent = booking.status === step.id;
                            const isCancelled = booking.status === 'rejected';

                            return (
                              <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                                  isCancelled && isCurrent ? 'bg-rose-500 border-white dark:border-slate-900 text-white shadow-lg shadow-rose-500/20' :
                                  isPast || isCurrent ? 'bg-blue-600 border-white dark:border-slate-900 text-white shadow-xl shadow-blue-600/30' : 
                                  'bg-slate-100 dark:bg-slate-800 border-white dark:border-slate-950 text-slate-400 dark:text-slate-600'
                                } transition-all duration-500`}>
                                  <step.icon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                </div>
                                <div className="absolute -bottom-7 whitespace-nowrap">
                                  <span className={`text-[11px] font-black uppercase tracking-tight ${
                                    isCancelled && isCurrent ? 'text-rose-500' :
                                    isPast || isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                                  }`}>
                                    {step.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                        </div>
                      </div>

                      {/* Description */}
                      {booking.description && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Job Description</p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            {booking.description}
                          </p>
                        </div>
                      )}


                      {/* Actions row */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          Booked {format(new Date(booking.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                        </p>

                        <div className="flex gap-2 flex-wrap">
                          {/* Provider actions */}
                          {isProvider && booking.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-9 px-4 shadow-sm text-xs gap-1"
                                onClick={async () => {
                                  const res = await fetch(`${API_BASE_URL}/api/bookings/${booking._id}/status`, {
                                    method: "PATCH", credentials: "include",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ status: "accepted" }),
                                  });
                                  if (res.ok) setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: "accepted" } : b));
                                }}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold rounded-xl h-9 px-4 text-xs gap-1"
                                onClick={() => handleCancel(booking._id)}
                                disabled={cancelling === booking._id}
                              >
                                {cancelling === booking._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                                Decline
                              </Button>
                            </>
                          )}

                          {/* Provider: mark complete */}
                          {isProvider && booking.status === "accepted" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-9 px-4 text-xs gap-1"
                              onClick={async () => {
                                const res = await fetch(`${API_BASE_URL}/api/bookings/${booking._id}/status`, {
                                  method: "PATCH", credentials: "include",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ status: "completed" }),
                                });
                                if (res.ok) setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: "completed" } : b));
                              }}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                            </Button>
                          )}

                          {/* Customer: cancel pending */}
                          {!isProvider && booking.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold rounded-xl h-9 px-4 text-xs gap-1"
                              onClick={() => handleCancel(booking._id)}
                              disabled={cancelling === booking._id}
                            >
                              {cancelling === booking._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                              Cancel
                            </Button>
                          )}

                          {/* Customer: leave review on completed */}
                          {!isProvider && booking.status === "completed" && (
                            <Link to={`/provider/${booking.provider?._id}`}>
                              <Button size="sm" variant="outline" className="border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-bold rounded-xl h-9 px-4 text-xs gap-1">
                                <Star className="h-3.5 w-3.5" /> Leave Review
                              </Button>
                            </Link>
                          )}

                          {/* View provider profile */}
                          {!isProvider && (
                            <Link to={`/provider/${booking.provider?._id}`}>
                              <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700 dark:text-white font-bold rounded-xl h-9 px-4 text-xs gap-1">
                                <User className="h-3.5 w-3.5" /> View Profile
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
