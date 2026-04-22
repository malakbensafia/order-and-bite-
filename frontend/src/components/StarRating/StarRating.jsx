import React, { useState } from 'react'
import './StarRating.css'

const StarRating = ({ onRate }) => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  const handleClick = (value) => {
    setRating(value)
    if (onRate) onRate(value)
  }

  return (
    <div className="stars">
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1

        return (
          <span
            key={i}
            className={value <= (hover || rating) ? "filled" : "empty"}
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}

export default StarRating