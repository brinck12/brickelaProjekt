import { Review } from '../types/review';

export const reviews: Review[] = [
  {
    id: 1,
    barberId: 1,
    authorName: "Michael Smith",
    rating: 5,
    comment: "James is a true master of his craft. The attention to detail in my classic cut was impressive.",
    date: "2024-03-01",
    serviceType: "Classic Haircut"
  },
  {
    id: 2,
    barberId: 1,
    authorName: "David Brown",
    rating: 5,
    comment: "Best beard trim I've ever had. Very precise and exactly what I wanted.",
    date: "2024-02-28",
    serviceType: "Beard Trim"
  },
  {
    id: 3,
    barberId: 2,
    authorName: "Chris Wilson",
    rating: 5,
    comment: "Michael's fade work is incredible. The blend is perfect every time.",
    date: "2024-03-02",
    serviceType: "Fade & Style"
  },
  {
    id: 4,
    barberId: 3,
    authorName: "Kevin Lee",
    rating: 5,
    comment: "David really understands Asian hair texture. Great style and advice!",
    date: "2024-03-01",
    serviceType: "Haircut"
  }
];