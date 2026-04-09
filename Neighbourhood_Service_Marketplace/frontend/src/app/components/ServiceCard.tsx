import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ShieldCheck, ArrowRight, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ServiceCardProps {
  provider: {
    id: string;
    providerId?: string;
    name: string;
    service: string;
    rating: number;
    reviews: number;
    price: string;
    image: string;
    verified: boolean;
    experience: string;
    location?: string;
  };
}

export default function ServiceCard({ provider }: ServiceCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="h-full"
    >
      <div className="relative group h-full bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:shadow-2xl hover:shadow-blue-600/10 dark:hover:shadow-blue-900/20 transition-all duration-500 flex flex-col border border-slate-100 dark:border-white/5">

        {/* Image area */}
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700">
          {!imgError && provider.image ? (
            <img
              src={provider.image}
              alt={provider.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Fallback avatar when image fails or is missing */
            <div className="w-full h-full flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shadow-lg">
                <User className="h-10 w-10 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Verified badge */}
          {provider.verified && (
            <Badge className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-blue-600 dark:text-blue-400 border-0 shadow-lg px-3 py-1.5 rounded-xl font-bold text-xs gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Pro
            </Badge>
          )}

          {/* Price chip (top right) */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
            <p className="text-white font-black text-sm">{provider.price}</p>
          </div>

          {/* Bottom overlay content */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 px-2.5 py-1 rounded-lg gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-black text-white text-sm">{provider.rating}</span>
                <span className="text-white/70 text-xs">({provider.reviews})</span>
              </div>
              {provider.location && (
                <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-lg gap-1">
                  <MapPin className="h-3 w-3 text-white/80" />
                  <span className="text-white/90 text-xs font-medium">{provider.location.split(',')[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category pill */}
          <div className="mb-3">
            <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {provider.service}
            </span>
          </div>

          {/* Name & experience */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight mb-0.5">
                {provider.name}
              </h3>
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-medium gap-1">
                <Clock className="h-3 w-3" />
                <span>{provider.experience} Experience</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-4" />

          {/* CTA Buttons */}
          <div className="flex gap-2.5 mt-auto">
            <Link to={`/provider/${provider.providerId || provider.id}`} className="flex-1">

              <Button
                variant="outline"
                className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800 font-bold text-sm transition-all hover:border-blue-400 dark:hover:border-blue-600"
              >
                View Profile
              </Button>
            </Link>
            <Link to={`/booking/${provider.id}`} className="flex-1">
              <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all gap-1 group/btn">
                Book Now
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hover glow effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  );
}
