import { createContext, useState } from "react";
import birdStrikes from "./assets/birdstrikes.json";

export type BirdStike = typeof birdStrikes;
export type BirdStrikeKeys = keyof (typeof birdStrikes)[0];
type FilterList = Partial<{
  [key in BirdStrikeKeys]: Set<string | number>;
}>;
type DataContextType = {
  source: typeof birdStrikes;
  filteredSource: typeof birdStrikes;
  setFilterList: React.Dispatch<React.SetStateAction<FilterList>>;
};

export const DataContext = createContext<DataContextType>(null);
export function GlobalContext({ children }) {
  const [filterList, setFilterList] = useState<FilterList>({
    "Origin State": new Set(),
    "Wildlife Size": new Set(),
  });
  const filterKeys = Object.keys(filterList) as BirdStrikeKeys[];
  // 두 필터 값이 모두 적용되는 .filter 함수 완성하기
  const filteredSource = birdStrikes.filter((birdStrike) => true);

  console.log({ birdStrikes, filteredSource });
  return (
    <DataContext.Provider
      value={{ source: birdStrikes, filteredSource, setFilterList }}
    >
      {children}
    </DataContext.Provider>
  );
}
