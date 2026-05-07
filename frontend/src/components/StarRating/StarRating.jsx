import React, { useState } from 'react'
import './StarRating.css'

const StarRating = ({ onRate, value = 0 }) => {

  const [hover, setHover] = useState(0)

  const handleClick = (starValue) => {
    if (onRate) onRate(starValue)
  }

  return (
    <div className="stars">

      {Array.from({ length: 5 }, (_, i) => {

        const starValue = i + 1

        return (
          <span
            key={i}
            className={
              starValue <= (hover || value)
                ? "filled"
                : "empty"
            }
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHover(starValue)}
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