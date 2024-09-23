// hooks/useMediaQuery.js
import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set the initial value
    setMatches(mediaQueryList.matches);

    // Attach the listener
    mediaQueryList.addEventListener("change", handleChange);

    // Cleanup the listener on component unmount
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};
