import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    image: string;
    providers: number;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link to={`/services/${category.id}`}>
        <div className="relative overflow-hidden cursor-pointer group rounded-xl bg-slate-100 dark:bg-slate-900 h-64 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-800">

          {/* Background image */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Base gradient overlay - dynamic based on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/95 group-hover:via-black/40 transition-all duration-700" />


          {/* Pro count - top right */}
          <div className="absolute top-3 right-3 bg-blue-900/60 border border-white/20 px-2.5 py-1 rounded-lg">
            <span className="text-white text-xs font-black">{category.providers}+ Pros</span>
          </div>

          {/* Content - bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {/* Icon */}
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 origin-left inline-block">
              {category.icon}
            </div>

            {/* Name */}
            <h3 className="font-black text-xl text-white tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
              {category.name}
            </h3>

            {/* Browse link — reveals on hover */}
            <div className="flex items-center gap-1.5 text-white/70 text-xs font-bold mt-1.5 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              Browse experts <ArrowRight className="h-3 w-3" />
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
