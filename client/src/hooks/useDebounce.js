// src/hooks/useDebounce.js
// Delays updating a value until user stops typing

import { useState, useEffect } from "react";

/**
 * useDebounce
 * Returns a debounced version of the value
 * Useful for search inputs to avoid API call on every keystroke
 * @param {any} value - Value to debounce
 * @param {number} delay - Milliseconds to wait (default: 400ms)
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup on each change
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
