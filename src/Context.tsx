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

/* 
[ Context API ]
개별 컴포넌트에서 Context로 정해 놓은 데이터를 hook 형태로 가져와 사용할 수 있음
-> props drilling의 불편함을 해결
-> 여러 컴포넌트를 거칠 필요 없음
-> 필요한 props가 줄어듦에 따라 jsx에서 읽을 코드 감소
*/

// 1) context 생성 : React.createContext 함수를 통해 전역 상태(context)를 만들 수 있음
export const DataContext = createContext<DataContextType>(null);

// 2) Provider 컴포넌트 작성
/* 
< Provieder 컴포넌트의 필수 구현 사항>
- props로 children을 받음
- Context.provider 사용
  -> 자식으로 chilren만 사용
  -> value라는 prop에 전역 상태로 사용할 값을 삽입
  -> value의 타입은 무엇이든지 가능
- 전역상태로 사용할 값은 자유롭게 지정
*/
export function GlobalContext({ children }) {
  const [filterList, setFilterList] = useState<FilterList>({
    "Origin State": new Set(),
    "Wildlife Size": new Set(),
  });

  // 1) filterList에 들어있는 필터 값 리스트 획득
  const filterKeys = Object.keys(filterList) as BirdStrikeKeys[];
  // console.log("filterList :", filterList);
  // console.log("filterKeys :", filterKeys); // ['Origin State', 'Wildlife Size']

  // 두 필터 값이 모두 적용되는 .filter 함수 완성하기
  // 2) filteredSource
  const filteredSource = birdStrikes.filter((birdStrike) => {
    // console.log(birdStrike);
    return filterKeys.every((filterKey) => {
      // 배열의 array 함수와 sum 함수
      // console.log(filterKey);
      const filterValues = filterList[filterKey];
      if (filterValues.size === 0) {
        return true;
      }
      return filterValues.has(birdStrike[filterKey]);
    });
  });

  console.log({ birdStrikes, filteredSource });
  return (
    <DataContext.Provider
      value={{ source: birdStrikes, filteredSource, setFilterList }}
    >
      {children}
    </DataContext.Provider>
  );
}
