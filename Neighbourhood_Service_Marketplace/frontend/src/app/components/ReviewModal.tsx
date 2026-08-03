import { useState } from "react";
import { Star, X, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAppContext } from "../context/AppContext";
import { API_BASE_URL } from "../config";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onReviewSubmitted?: (review: any) => void;
}

const TAGS = [
  "⚡ Punctual & Fast",
  "⭐ High Quality Work",
  "🧹 Clean & Neat",
  "😊 Polite & Respectful",
  "💰 Fair & Transparent Price",
  "🛠️ Great Equipment"
];

export default function ReviewModal({ isOpen, onClose, booking, onReviewSubmitted }: ReviewModalProps) {
  const { addNotification } = useAppContext();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !booking) return null;

  // Resolve provider and service names from actual booking data shape
  const providerName = booking.provider?.name || booking.providerName || "Service Expert";
  const serviceName = booking.service?.title || booking.serviceName || "Service";
  const providerId = booking.provider?._id || booking.provider;
  const bookingId = booking._id;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Build comment with tags included
      const fullComment = [
        comment,
        selectedTags.length > 0 ? `\nHighlights: ${selectedTags.join(", ")}` : ""
      ].join("").trim();

      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          bookingId,
          rating,
          comment: fullComment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to submit review. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);

      if (onReviewSubmitted) {
        onReviewSubmitted({
          ...data.review,
          rating,
          comment: fullComment,
          tags: selectedTags,
          providerName,
        });
      }

      addNotification({
        title: "Review Submitted! ⭐",
        message: `Thank you for rating ${providerName} ${rating} stars.`,
        type: "booking"
      });

      setTimeout(() => {
        setIsSubmitted(false);
        setRating(5);
        setHoverRating(0);
        setSelectedTags([]);
        setComment("");
        setError("");
        onClose();
      }, 1500);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white leading-snug">Rate & Review Service</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {serviceName} by {providerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/40 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <ThumbsUp className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Thank You for Your Feedback!</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your review helps keep our neighborhood marketplace trusted and transparent.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error display */}
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 text-sm font-semibold">
                  {error}
                </div>
              )}

              {/* Star rating selector */}
              <div className="text-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Overall Satisfaction</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => {
                    const activeRating = hoverRating || rating;
                    const isFilled = star <= activeRating;
                    return (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star className={`h-8 w-8 ${
                          isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                        }`} />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 block">
                  {rating === 5 ? "Excellent! ⭐⭐⭐⭐⭐" : rating === 4 ? "Very Good! ⭐⭐⭐⭐" : rating === 3 ? "Average ⭐⭐⭐" : "Needs Improvement ⭐⭐"}
                </span>
              </div>

              {/* Tag selector */}
              <div>
                <label className="block text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  What went well?
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Your Review Comments
                </label>
                <Textarea
                  rows={3}
                  placeholder="Share details of your experience with the pro..."
                  className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium resize-none"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-600/30"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting Review...</>
                ) : (
                  "Submit Verified Review"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
