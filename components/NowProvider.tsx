import { createContext, useContext, useState, ReactNode } from "react";

type NowState = {
  now: Date | null;
  setNow: (datetime: Date | null) => void;
};

const NowContext = createContext<NowState | undefined>(undefined);

export const NowProvider = ({ children }: { children: ReactNode }) => {
  const [now, setNow] = useState<Date | null>(new Date());

  return (
    <NowContext.Provider value={{ now, setNow }}>
      {children}
    </NowContext.Provider>
  );
};

export const useNow = () => {
  const ctx = useContext(NowContext);
  if (!ctx) throw new Error("useNow must be used inside NowProvider");
  return ctx;
};
