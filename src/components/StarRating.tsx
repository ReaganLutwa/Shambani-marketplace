import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function StarRating({ rating, reviews, size = 'md', showCount = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3 && rating - fullStars <= 0.7;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${starSizes[size]} fill-sun text-sun`}
          />
        ))}
        {/* Half star */}
        {hasHalf && (
          <div className="relative">
            <Star className={`${starSizes[size]} text-fog fill-fog`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${starSizes[size]} fill-sun text-sun`} />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${starSizes[size]} text-fog fill-fog`}
          />
        ))}
      </div>
      <span className={`font-space font-bold text-sun ${textSizes[size]}`}>{rating}</span>
      {showCount && reviews !== undefined && (
        <span className={`text-stone ${textSizes[size]}`}>({reviews})</span>
      )}
    </div>
  );
}
