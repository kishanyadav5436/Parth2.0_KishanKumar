import React from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Moon, Sun, LogOut, ChevronRight, Save, Wrench, Star, Zap, BookOpen, ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { useNavigate, Link } from "react-router-dom";

export default function Settings() {
  const { user, setUser, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();
  const isProvider = user?.role === 'provider';

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <h1 className="text-4xl font-black dark:text-white mb-2 tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your account preferences and application appearance.</p>
        </motion.div>

        <div className="grid gap-8">

          {/* Role Info Banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className={`rounded-3xl p-6 flex items-center justify-between ${isProvider ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'}`}>
              <div className="flex items-center space-x-4">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg ${isProvider ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-blue-600 shadow-blue-600/20'}`}>
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest mb-0.5 ${isProvider ? 'text-emerald-500 dark:text-emerald-400' : 'text-blue-500 dark:text-blue-400'}`}>
                    {isProvider ? '🔧 Service Provider Account' : '👤 Customer Account'}
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{user?.name || 'Guest'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user?.email || ''}</p>
                </div>
              </div>
              <div className="hidden md:block text-right">
                {isProvider ? (
                  <div className="space-y-1">
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm"><Star className="h-4 w-4 mr-1" /> List your services</div>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm"><Zap className="h-4 w-4 mr-1" /> Accept bookings</div>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm"><Wrench className="h-4 w-4 mr-1" /> Manage your profile</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm"><Star className="h-4 w-4 mr-1" /> Browse services</div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm"><Zap className="h-4 w-4 mr-1" /> Book appointments</div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm"><User className="h-4 w-4 mr-1" /> Rate providers</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Account Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">Profile Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal details.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</Label>
                  <Input
                    defaultValue={user?.name || ""}
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl h-12 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</Label>
                  <Input
                    defaultValue={user?.email || ""}
                    disabled
                    className="bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-500 rounded-xl h-12 opacity-70"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-blue-600/20">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* My Bookings Quick Access */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white">
                      {isProvider ? "Manage Bookings" : "My Bookings"}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {isProvider ? "View and manage incoming service requests." : "View all your booked appointments."}
                    </p>
                  </div>
                </div>
                <Link to="/bookings">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-6 gap-2 shadow-lg shadow-blue-600/20">
                    {isProvider ? "View Requests" : "View Bookings"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Provider-specific section */}
          {isProvider && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 p-8 rounded-3xl shadow-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
                    <Wrench className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white">Provider Profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your services and availability.</p>
                  </div>
                  <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 ml-auto font-black uppercase text-xs">Active</Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                  As a service provider, you can manage your service profile, set your rates, and track your bookings from this panel. Clients will see your profile in search results.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Manage Listings', icon: Wrench, desc: 'Update your services', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
                    { label: 'View Bookings', icon: Zap, desc: 'Track appointments', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
                    { label: 'My Reviews', icon: Star, desc: 'Client feedback', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
                  ].map((item) => (
                    <button key={item.label} className={`p-4 rounded-2xl border text-left transition-transform hover:scale-105 ${item.bg}`}>
                      <item.icon className={`h-6 w-6 mb-2 ${item.color}`} />
                      <p className={`font-bold text-sm ${item.color}`}>{item.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Theme & Appearance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                  {theme === 'light' ? <Sun className="h-6 w-6 text-purple-600" /> : <Moon className="h-6 w-6 text-purple-400" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">Appearance</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Customize how the app looks.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                      <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Reduce glare, easier on the eyes at night.</p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                      <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Push Notifications</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for new bookings. (Coming soon)</p>
                    </div>
                  </div>
                  <Switch disabled />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl">
                  <Shield className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">Security</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage your password and security settings.</p>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 group font-semibold">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-3 text-slate-400" />
                  <span>Update Password</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </motion.div>

          {/* Sign Out */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-2">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 w-full h-14 rounded-2xl text-base font-bold border border-rose-200 dark:border-rose-900/50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out of Account
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
