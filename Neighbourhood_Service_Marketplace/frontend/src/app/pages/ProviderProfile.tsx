import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, MapPin, BadgeCheck, Clock, Award, Calendar, ChevronRight, MessageSquare, History } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try fetching by Profile ID first
        let profileRes = await fetch(`/api/providers/${id}`);
        
        // If not found, try fetching by User ID
        if (!profileRes.ok) {
          profileRes = await fetch(`/api/providers/user/${id}`);
        }
        
        if (!profileRes.ok) throw new Error('Profile not found');
        const profileData = await profileRes.json();
        setProvider(profileData);

        const userId = profileData.user?._id || profileData.user;

        // Fetch Reviews
        const reviewsRes = await fetch(`/api/reviews/provider/${userId}`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }

        // Fetch Services for this provider
        const servicesRes = await fetch(`/api/services?provider=${userId}`);
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return <div className="min-h-screen flex items-center justify-center dark:text-white">Provider not found</div>;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Header Mesh Gradient Background */}
      <div className="h-48 md:h-64 mesh-gradient opacity-30 absolute top-0 left-0 right-0 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 pt-12 md:pt-24 relative z-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-card overflow-hidden rounded-[2rem] border-white/20 dark:border-slate-800">
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <Avatar className="h-40 w-40 border-4 border-white dark:border-slate-900 shadow-2xl relative">
                    <AvatarImage src={provider.image || "https://images.unsplash.com/photo-1630481721508-5d37097dd8fc?auto=format&fit=crop&q=80&w=400"} alt={provider.user?.name} />
                    <AvatarFallback className="text-4xl">{provider.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 border-4 border-white dark:border-slate-900 shadow-lg">
                    <BadgeCheck className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold dark:text-white mb-2">
                       {provider.user?.name}
                    </h1>
                    <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">{provider.category}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4">
                      <div className="flex items-center text-lg">
                        <Star className="h-6 w-6 fill-amber-400 text-amber-400 mr-2" />
                        <span className="font-bold dark:text-white mr-1">{provider.averageRating || "5.0"}</span>
                        <span className="text-gray-500 dark:text-gray-400">({provider.totalReviews || 0} reviews)</span>
                      </div>
                      <div className="flex items-center text-lg text-gray-500 dark:text-gray-400">
                        <MapPin className="h-6 w-6 mr-2 text-rose-500" />
                        Locally Verified
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Badge variant="secondary" className="px-4 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800">
                      Top Pro 2024
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800">
                      ID Verified
                    </Badge>
                  </div>
                </div>

                <div className="w-full md:w-auto text-center md:text-right flex flex-col items-center md:items-end">
                  <p className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                    ₹{provider.hourlyRate}<span className="text-sm font-normal text-gray-500">/hr</span>
                  </p>
                  <Link to={`/booking/${services[0]?._id || id}`} className="w-full md:w-auto">
                    <Button size="lg" disabled={services.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto px-10 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/20 transition-transform active:scale-95">
                      <Calendar className="h-5 w-5 mr-3" />
                      {services.length > 0 ? "Book Expert Service" : "No Services Available"}
                    </Button>
                  </Link>

                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 bg-white/50 dark:bg-slate-800/30 p-6 rounded-3xl border border-white/20">
                {[
                  { icon: Award, value: "150+", label: "Tasks Done", color: "text-blue-600" },
                  { icon: Clock, value: "1hr", label: "Response", color: "text-emerald-500" },
                  { icon: History, value: "2 Years+", label: "Experience", color: "text-purple-600" },
                  { icon: MessageSquare, value: provider.totalReviews || 0, label: "Reviews", color: "text-orange-500" },
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color} transition-transform group-hover:scale-110`} />
                    <p className="text-xl font-bold dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Dynamic Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="about" className="space-y-8">
            <TabsList className="bg-transparent border-b dark:border-slate-800 w-full justify-start rounded-none p-0 h-auto gap-8">
              <TabsTrigger value="about" className="data-[state=active]:border-blue-600 dark:data-[state=active]:text-white border-b-2 border-transparent rounded-none px-2 py-4 bg-transparent text-lg font-bold text-gray-500">
                About The Pro
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:border-blue-600 dark:data-[state=active]:text-white border-b-2 border-transparent rounded-none px-2 py-4 bg-transparent text-lg font-bold text-gray-500">
                Services Offered ({services.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:border-blue-600 dark:data-[state=active]:text-white border-b-2 border-transparent rounded-none px-2 py-4 bg-transparent text-lg font-bold text-gray-500">
                Client Reviews ({reviews.length})
              </TabsTrigger>

            </TabsList>

            <TabsContent value="about" className="mt-6">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 p-8 rounded-3xl border-white/20 dark:border-slate-800">
                  <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center">
                    Professional Background
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {provider.bio || "This professional provider hasn't shared their background yet, but they are fully verified and ready to help you with high-quality service."}
                  </p>

                  <Separator className="my-8 opacity-50" />

                  <h3 className="text-xl font-bold mb-4 dark:text-white">Expertise & Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {['certified', 'experienced', 'punctual', 'reliable'].map((tag) => (
                      <Badge key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full uppercase text-xs tracking-tighter">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="p-6 bg-blue-600 text-white rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <h3 className="text-xl font-bold mb-2">Need This Fixed?</h3>
                    <p className="mb-6 text-blue-100">Most appointments for {provider.category} are scheduled within 24 hours.</p>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6 rounded-2xl font-bold">
                      Check Availability
                    </Button>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service: any) => (
                  <Card key={service._id} className="p-6 rounded-[2rem] border-white/20 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2 truncate max-w-[150px]">
                          {service.category}
                        </Badge>
                        <h3 className="text-xl font-black dark:text-white leading-tight">{service.title}</h3>
                      </div>
                      <p className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{service.price}</p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 min-h-[40px]">
                      {service.description || "High-quality professional service guaranteed to meet your needs."}
                    </p>
                    <Link to={`/booking/${service._id}`}>
                      <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white rounded-xl font-bold py-5">
                        Book This Service
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">

              <div className="grid md:grid-cols-1 gap-6">
                {reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={review._id}>
                      <Card className="p-8 rounded-3xl border-white/20 dark:border-slate-800">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 text-xl">
                              {review.user?.name?.[0] || 'C'}
                            </div>
                            <div>
                              <p className="font-bold text-lg dark:text-white">{review.user?.name || 'Customer'}</p>
                              <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-300 italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-xl text-gray-500">No reviews yet for this provider.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}