import { useState } from "react";

const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial])

  const transition = (newMode, replace) => {
    if (replace) {
      setMode(newMode);
    } else {
      setMode(newMode);
      setHistory(prev => ([...prev, newMode]));
    }
  }

  const back = () => {
    if (history.length > 1) {
      const prevHistory = history.slice(0, history.length -1);

      setHistory([...prevHistory]);
      setMode(prevHistory[prevHistory.length - 1]);
    }
  }

  return { mode, transition, back }
}

export default useVisualMode;