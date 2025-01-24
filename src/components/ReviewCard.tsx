import { Star } from "lucide-react";
import { Review } from "../types/review";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-indigo-400">
            {review.ertekelo_neve}
          </h4>
          <p className="text-sm text-slate-400">{review.velemeny}</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-current text-yellow-400" />
          <span className="text-slate-300">{review.ertekeles}</span>
        </div>
      </div>
      <p className="text-slate-300 mb-2">{review.velemeny}</p>
      <p className="text-sm text-slate-500">
        {new Date(review.letrehozasIdopontja).toLocaleDateString()}
      </p>
    </div>
  );
}
