import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types/review';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-indigo-400">{review.authorName}</h4>
          <p className="text-sm text-slate-400">{review.serviceType}</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-current text-yellow-400" />
          <span className="text-slate-300">{review.rating}</span>
        </div>
      </div>
      <p className="text-slate-300 mb-2">{review.comment}</p>
      <p className="text-sm text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
    </div>
  );
}