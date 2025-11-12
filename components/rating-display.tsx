import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  totalReviews?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
}

export function RatingDisplay({ rating, totalReviews, size = "md", showCount = true }: RatingDisplayProps) {
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize[size]} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className={`font-medium ${textSize[size]}`}>{rating.toFixed(1)}</span>
      {showCount && totalReviews !== undefined && (
        <span className={`text-gray-500 ${textSize[size]}`}>({totalReviews})</span>
      )}
    </div>
  )
}
