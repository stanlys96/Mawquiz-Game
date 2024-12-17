import React, { useState, useEffect } from "react";

// Custom hook to animate a number
export const useAnimatedNumber = (target, duration = 2000) => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const increment = target / (duration / 10); // Increment based on 10ms intervals
    let currentNumber = 0;

    const timer = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= target) {
        currentNumber = target;
        clearInterval(timer);
      }
      setNumber(Math.round(currentNumber));
    }, 10);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [target, duration]);

  return number;
};
