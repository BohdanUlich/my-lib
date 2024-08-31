"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ProgressBarContextType {
  loadingProgress: boolean;
  setLoadingProgress: Dispatch<SetStateAction<boolean>>;
}

const ProgressBarContext = createContext<ProgressBarContextType>({
  loadingProgress: false,
  setLoadingProgress: () => false,
});

export const useProgress = () => useContext(ProgressBarContext);

export const ProgressBarProvider = ({ children }: { children: ReactNode }) => {
  const [loadingProgress, setLoadingProgress] = useState(false);

  return (
    <ProgressBarContext.Provider
      value={{ loadingProgress, setLoadingProgress }}
    >
      {children}
    </ProgressBarContext.Provider>
  );
};
