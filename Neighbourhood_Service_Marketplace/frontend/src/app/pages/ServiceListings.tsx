import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowLeft, Filter, Star, MapPin, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";
import ServiceCard from "../components/ServiceCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import MapView from "../components/MapView";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { MOCK_PROVIDERS, getMockProviders } from "../data/mockData";

export default function ServiceListings() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const initialLocation = searchParams.get("loc") || "";

  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");


  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        const url = category 
          ? `/api/services?category=${category}` 
          : '/api/services';
        const res = await fetch(url);
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          setAllProviders(getMockProviders(category));
          setIsLoading(false);
          return;
        }

        const defaultImages: Record<string, string> = {
          "ac-repair": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80",
          "plumbing": "https://images.unsplash.com/photo-1620253610989-3ab05e06030c?auto=format&fit=crop&w=400&q=80",
          "electrical": "https://images.unsplash.com/photo-1626501244050-ad05a356bb27?auto=format&fit=crop&w=400&q=80",
          "cleaning": "https://images.unsplash.com/photo-1581578731548-c64695ce6952?auto=format&fit=crop&w=400&q=80",
          "painting": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80",
          "gardening": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80",
          "beauty": "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=400&q=80",
          "pest-control": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80"
        };

        // Map backend schema to UI format
        const mappedData = data.map((d: any) => {
          const cat = d.category?.toLowerCase() || "";
          return {
            id: d._id,
            providerId: d.provider?._id || d.provider,
            name: d.provider?.name || "Premium Provider",
            service: d.title,
            category: cat,
            rating: d.rating || 4.5,
            reviews: d.reviews || 0,
            price: `₹${d.price}/hr`,
            priceValue: d.price,
            location: d.location || "Mumbai, Maharashtra",
            image: d.image || defaultImages[cat] || "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80",
            verified: true,
            experience: "Expert"
          };
        });

        // Use real data if available, otherwise fall back to mock data
        if (mappedData.length > 0) {
          setAllProviders(mappedData);
        } else {
          setAllProviders(getMockProviders(category));
        }

      } catch (err) {
        console.error("Failed to fetch providers, using mock data:", err);
        // Fall back to mock data on any error
        setAllProviders(getMockProviders(category));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [category]);

  const filteredProviders = allProviders
    .filter((provider) => {
      const matchesSearch = !searchQuery || 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.service.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = !locationQuery || 
        provider.location.toLowerCase().includes(locationQuery.toLowerCase());

      if (!matchesSearch || !matchesLocation) return false;
      if (provider.priceValue < priceRange[0] || provider.priceValue > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return a.priceValue - b.priceValue;
      if (sortBy === "price-high") return b.priceValue - a.priceValue;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 block">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Filter by city..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="pl-10 h-11 bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 rounded-xl"
          />
          {locationQuery && (
            <button 
              onClick={() => setLocationQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 block">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 rounded-xl h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-200 dark:border-slate-800">
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest block">Price Range</Label>
          <span className="text-blue-600 dark:text-blue-400 font-bold">₹{priceRange[0]} - ₹{priceRange[1]}</span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={2000}
          step={50}
          className="mt-2"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
          <span>₹0</span>
          <span>₹2000+</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <Link to="/" className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all mb-4 group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              BACK TO EXPLORE
            </Link>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              {category
                ? `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}`
                : "All Services"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl font-medium">
              Discover top-rated professionals in your neighborhood, verified for quality and reliability.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'map' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm inline-flex items-center">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mr-2">{filteredProviders.length}</span>
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Experts Available</span>
            </div>
          </div>

        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters (Desktop) */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block space-y-8 sticky top-24 h-fit"
          >
            <div className="glass-card p-8 rounded-[2rem] border-white/20 dark:border-slate-800 shadow-xl shadow-black/5">
              <div className="flex items-center gap-2 mb-8 text-slate-900 dark:text-white font-black text-xl uppercase tracking-tight">
                <Filter className="h-6 w-6 text-blue-600" />
                Filters
              </div>
              <FilterContent />
            </div>
          </motion.aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search by name, expertise, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl text-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-200 dark:border-slate-800 dark:text-white font-black">
                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                    Refine
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] dark:bg-slate-950 dark:border-slate-800">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-12">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Provider Grid or Map */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-[400px] w-full rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  ))}
                </motion.div>
              ) : filteredProviders.length > 0 ? (
                viewMode === "grid" ? (
                  <motion.div 
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    {filteredProviders.map((provider) => (
                      <ServiceCard key={provider.id} provider={provider} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-[600px] w-full"
                  >
                    <MapView providers={filteredProviders} />
                  </motion.div>
                )
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="text-center py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-blue-200/50 dark:border-blue-500/20 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
                  
                  <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="relative w-56 h-56 mx-auto mb-8"
                  >
                    <div className="absolute inset-0 bg-blue-500/30 dark:bg-blue-600/20 blur-3xl rounded-full"></div>
                    <img 
                      src="/illustrations/empty_search.png" 
                      alt="No Results" 
                      className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                    />
                  </motion.div>
                  <h3 className="text-2xl font-black dark:text-white mb-2 tracking-tight">No Match Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Try adjusting your filters or search keywords to find what you're looking for.
                  </p>
                  <Button 
                    variant="link" 
                    className="mt-4 text-blue-600 font-bold"
                    onClick={() => {
                        setSearchQuery("");
                        setLocationQuery("");
                        setPriceRange([0, 2000]);
                    }}
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}