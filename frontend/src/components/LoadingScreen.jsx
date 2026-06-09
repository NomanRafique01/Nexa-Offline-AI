// LoadingScreen Component
import { useEffect } from "react";

const LoadingScreen = ({ onDone }) => {
  useEffect(() => {
    const t1 = setTimeout(() => onDone(), 4000);
    return () => clearTimeout(t1);
  }, [onDone]);

  return null;
};

export default LoadingScreen;