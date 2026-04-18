import { useEffect, useState } from "react";

export function useTypewriter(text, speed = 8, threshold = 200) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplay("");
      return;
    }
    if (text.length > threshold) {
      setDisplay(text);
      return;
    }
    setDisplay("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, threshold]);

  return display;
}
