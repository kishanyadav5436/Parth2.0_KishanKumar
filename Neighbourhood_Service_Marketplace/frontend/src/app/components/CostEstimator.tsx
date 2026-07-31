import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

const SERVICES = [
  { id: "ac-repair", name: "AC Repair & Servicing", base: 499, icon: "❄️" },
  { id: "plumbing", name: "Plumbing Service", base: 399, icon: "🚰" },
  { id: "cleaning", name: "Full Home Deep Cleaning", base: 699, icon: "🧹" },
  { id: "electrical", name: "Electrical Wiring & Repairs", base: 349, icon: "⚡" },
  { id: "painting", name: "Home Painting & Wall Care", base: 1199, icon: "🎨" },
];

const SCALES = [
  { id: "small", label: "Standard / 1 Room", multiplier: 1.0 },
  { id: "medium", label: "Medium / 2-3 Rooms", multiplier: 1.6 },
  { id: "large", label: "Large / Full Property", multiplier: 2.5 },
];

const ADDONS = [
  { id: "warranty", name: "90-Day Parts Warranty", price: 149 },
  { id: "eco", name: "Eco-Friendly Disinfection", price: 199 },
  { id: "priority", name: "1-Hour Emergency Rush", price: 250 },
];

export default function CostEstimator() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedScale, setSelectedScale] = useState(SCALES[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const basePrice = Math.round(selectedService.base * selectedScale.multiplier);
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const found = ADDONS.find(a => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);
  const subtotal = basePrice + addonsTotal;
  const estimatedTax = Math.round(subtotal * 0.05); // 5% GST
  const totalPrice = subtotal + estimatedTax;

  const handleBookWithEstimate = () => {
    navigate(`/services?q=${encodeURIComponent(selectedService.name)}&estimate=${totalPrice}`);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-blue-900/40 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Badge className="bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 gap-1.5 inline-flex items-center">
              <Calculator className="h-3.5 w-3.5" />
              Instant Estimator
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Calculate Instant Service Cost
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Select options below for a 100% transparent cost estimate before booking.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls - Left side (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Service */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                1. Select Service Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SERVICES.map(service => {
                  const isSelected = selectedService.id === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-20 ${
                        isSelected
                          ? "bg-blue-600 border-blue-500 text-white font-black shadow-lg shadow-blue-600/30"
                          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-xl">{service.icon}</span>
                      <span className="text-xs font-bold leading-tight line-clamp-1">{service.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Job Scale */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                2. Job Scope & Size
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SCALES.map(scale => {
                  const isSelected = selectedScale.id === scale.id;
                  return (
                    <button
                      key={scale.id}
                      onClick={() => setSelectedScale(scale)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "bg-blue-600 border-blue-500 text-white font-black shadow-lg shadow-blue-600/30"
                          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-xs font-bold block">{scale.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional Add-ons */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                3. Protection & Speed Add-ons
              </label>
              <div className="space-y-2">
                {ADDONS.map(addon => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? "bg-blue-950/60 border-blue-500 text-white font-bold"
                          : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                          isChecked ? "bg-blue-600 border-blue-500 text-white" : "border-slate-600"
                        }`}>
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-xs font-bold">{addon.name}</span>
                      </div>
                      <span className="text-xs font-black text-blue-400">+₹{addon.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Card - Right side (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Breakdown</span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-black">
                    Guaranteed Rate
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Service ({selectedScale.label.split('/')[0]})</span>
                    <span className="font-bold">₹{basePrice}</span>
                  </div>

                  {selectedAddons.map(addonId => {
                    const addon = ADDONS.find(a => a.id === addonId);
                    if (!addon) return null;
                    return (
                      <div key={addon.id} className="flex justify-between text-slate-400 text-xs">
                        <span>+ {addon.name}</span>
                        <span className="font-bold text-slate-300">₹{addon.price}</span>
                      </div>
                    );
                  })}

                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Taxes & Platform Fee (5%)</span>
                    <span className="font-bold text-slate-300">₹{estimatedTax}</span>
                  </div>

                  <div className="h-px bg-slate-800 my-2" />

                  <div className="flex justify-between items-baseline pt-2">
                    <div>
                      <span className="text-xs font-black uppercase text-slate-400 block">Total Estimated</span>
                      <span className="text-[10px] text-emerald-400 font-bold">No Hidden Charges</span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-white">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleBookWithEstimate}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Book Experts with This Estimate</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Backed by 100% Satisfaction Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
