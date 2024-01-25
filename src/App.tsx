import { Route, Routes } from "react-router-dom";
import { BarPlot } from "./charts/barPlot/BarPlot";
import { ScatterPlot } from "./charts/scatterPlot/ScatterPlot";
import BrushTest from "./charts/brushTest/BrushTest";
import BubblePlot from "./charts/bubblePlot/BubblePlot";
import Test from "./charts/test";
import Dashboard from "./workspace/Dashboard";
import { BarPlotUpdate } from "./charts/barPlot/BarPlotUpdate";
import { ScatterPlotUpdate } from "./charts/scatterPlot/ScatterPlotUpdate";

/**
 * routes 배열에 [화면 좌측 서랍에 표시될 이름, route url path, 차트 컴포넌트]를 넣으면 됨
 */
// eslint-disable-next-line react-refresh/only-export-components
export const routes: [string, string, JSX.Element][] = [
  ["home", "", <>좌측 메뉴에서 표시할 차트 클릭</>],
  ["test페이지", "test1", <Test />],
  ["bubblePlot", "bubbleplot", <BubblePlot />],
  ["brush 테스트", "brush", <BrushTest></BrushTest>],
  ["barPlot", "bar", <BarPlot></BarPlot>],
  ["barPlotUpdate", "barupdate", <BarPlotUpdate></BarPlotUpdate>],
  ["scatterPLot", "scatter", <ScatterPlot></ScatterPlot>],
  [
    "scatterPlotUpdate",
    "scatterupdate",
    <ScatterPlotUpdate></ScatterPlotUpdate>,
  ],
];

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard></Dashboard>}>
          {" "}
          {/* 기본 레이아웃 */}
          {routes.map(([, path, element]) => (
            <Route path={path} element={element} key={path} />
          ))}
        </Route>
      </Routes>
    </>
  );
}

export default App;
