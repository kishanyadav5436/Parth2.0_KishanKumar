import { useState } from "react";
import { X, Plus, Wrench, DollarSign, MapPin, Image as ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAppContext } from "../context/AppContext";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceAdded?: (newService: any) => void;
}

const CATEGORIES = [
  "AC Repair",
  "Plumbing",
  "Electrician",
  "Home Cleaning",
  "Painting",
  "Gardening",
  "Appliance Repair",
  "Pest Control"
];

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1620253610989-3ab05e06030c?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1626501244050-ad05a356bb27?auto=format&w=400&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695ce6952?auto=format&fit=crop&w=400&q=80",
];

export default function AddServiceModal({ isOpen, onClose, onServiceAdded }: AddServiceModalProps) {
  const { addNotification } = useAppContext();
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    price: "499",
    experience: "5 Years",
    location: "Mumbai",
    image: PRESET_IMAGES[0],
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newService = {
      id: "srv-" + Date.now(),
      name: form.title,
      service: form.category,
      price: `₹${form.price}/hr`,
      experience: form.experience,
      location: form.location,
      image: form.image,
      rating: 5.0,
      reviews: 1,
      verified: true,
      description: form.description,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onServiceAdded) onServiceAdded(newService);

      addNotification({
        title: "New Service Published! 🚀",
        message: `Your listing "${form.title}" is now active in ${form.category}.`,
        type: "provider",
        link: "/services"
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white leading-snug">Create New Service Listing</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Reach thousands of nearby customers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Service Successfully Published!</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your service is live and visible to customers in your location.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Service Title</Label>
                <Input
                  required
                  placeholder="e.g. Master AC Cleaning & Gas Refill"
                  className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl h-11 text-slate-900 dark:text-white font-medium"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Category</Label>
                  <Select value={form.category} onValueChange={cat => setForm({ ...form, category: cat })}>
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl h-11 text-slate-900 dark:text-white font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c} className="font-semibold">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Price (₹ per hour)</Label>
                  <Input
                    required
                    type="number"
                    placeholder="499"
                    className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl h-11 text-slate-900 dark:text-white font-medium"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Experience</Label>
                  <Input
                    required
                    placeholder="5 Years"
                    className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl h-11 text-slate-900 dark:text-white font-medium"
                    value={form.experience}
                    onChange={e => setForm({ ...form, experience: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">City / Location</Label>
                  <Input
                    required
                    placeholder="Mumbai"
                    className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl h-11 text-slate-900 dark:text-white font-medium"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Cover Image Banner</Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {PRESET_IMAGES.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setForm({ ...form, image: imgUrl })}
                      className={`h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        form.image === imgUrl ? "border-blue-600 ring-2 ring-blue-500/30" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail preset" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <Input
                  placeholder="Or enter custom image URL"
                  className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl h-10 text-xs text-slate-900 dark:text-white"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Description</Label>
                <Textarea
                  rows={3}
                  placeholder="Describe your expertise, equipment used, and service terms..."
                  className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium resize-none"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-600/30"
                >
                  {isSubmitting ? "Publishing Service..." : "Publish Service Listing"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
