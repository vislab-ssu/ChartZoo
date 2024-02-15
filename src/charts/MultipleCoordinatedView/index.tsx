import { USAMap } from "./USAMap";
import { BarPlot } from "./barPlot";

// MultipleCoordinatedView 메인 화면 컴포넌트
export const MCV = () => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <USAMap></USAMap>
        <BarPlot xKey={"Wildlife Size"}></BarPlot>
      </div>
    </>
  );
};
