import { createContext, useState } from "react";

export const DataContext = createContext(null);

export function GlobalContext({ children }) {
  const [data, setData] = useState(1);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}
