import React from "react";
import { reviews } from "../data/reviews";
import ReviewCard from "./ReviewCard";

interface BarberReviewsProps {
  barberId: number;
}

export default function BarberReviews({ barberId }: BarberReviewsProps) {
  const barberReviews = reviews.filter(
    (review) => review.barberId === barberId
  );

  const averageRating =
    barberReviews.reduce((acc, review) => acc + review.rating, 0) /
    barberReviews.length;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-indigo-400">
          Vásárlói Vélemények
        </h3>
        <div className="text-slate-300">
          <span className="font-bold">{averageRating.toFixed(1)}</span>
          <span className="text-slate-400"> / 5</span>
          <span className="text-slate-400 ml-2">
            ({barberReviews.length} vélemény)
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {barberReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
