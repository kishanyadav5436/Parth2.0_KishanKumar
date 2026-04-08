import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, Loader2, Sparkles, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAppContext } from "../context/AppContext";
import { API_BASE_URL } from "../config";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const redirectTo = searchParams.get("redirect") || "/";
  const { setUser } = useAppContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setUser(data.user);
      navigate(redirectTo);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: roleParam === 'provider' ? 'provider' : 'user'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      
      setUser(data.user);
      navigate(redirectTo);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link to="/" className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all mb-8 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            BACK TO HOME
          </Link>

          <Card className="glass-card border-white/20 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="h-32 w-32 dark:text-white" />
            </div>

            <div className="text-center mb-10">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${roleParam === 'provider' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-blue-600 shadow-blue-600/20'}`}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {roleParam === 'provider' ? 'Join as Provider' : 'Marketplace'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {roleParam === 'provider' ? 'Start earning with your skills today' : 'Your neighborhood service hub'}
              </p>
            </div>

            {/* Provider Registration Banner */}
            {roleParam === 'provider' && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start space-x-3">
                <div className="text-2xl">🔧</div>
                <div>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Registering as a Service Provider</p>
                  <p className="text-emerald-600 dark:text-emerald-500 text-xs mt-0.5">You can list services, accept bookings, and earn from local clients.</p>
                </div>
              </div>
            )}

            <Tabs defaultValue="login" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 dark:text-gray-400 dark:data-[state=active]:text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 dark:text-gray-400 dark:data-[state=active]:text-white">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-12 h-14 bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-12 h-14 bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20"
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-800 mr-2 accent-blue-600" />
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 transition-colors">Keep me signed in</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "SIGN IN"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="John Doe"
                        className="pl-12 h-14 bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20"
                        required
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-12 h-14 bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-12 h-14 bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20"
                        required
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-12 h-14 bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20"
                        required
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "JOIN NOW"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-10">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-slate-400">
                  <span className="px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full">Or Social Sign In</span>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-2xl font-bold border-slate-200 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800">
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl font-bold border-slate-200 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800">
                  <Github className="h-5 w-5 mr-3" />
                  GitHub
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
