import { Route, Routes } from "react-router-dom";
import { GlobalContext } from "./Context";
import { MCV } from "./charts/MultipleCoordinatedView";
import { Workspace } from "./charts/SelectableBarPlot";
import { SyncBarWorkspace } from "./charts/SyncBarPlot";
import { BarPlotUpdate } from "./charts/barPlot/BarPlotUpdate";
import BrushTest from "./charts/brushTest/BrushTest";
import BubblePlot from "./charts/bubblePlot/BubblePlot";
import ForceDirectedDiagram from "./charts/forceDirectedDiagram/ForceDirectedDiagram";
import { ScatterPlotUpdate } from "./charts/scatterPlot/scatterPlotUpdate";
import Dashboard from "./workspace/Dashboard";

/**
 * routes 배열에 [화면 좌측 서랍에 표시될 이름, route url path, 차트 컴포넌트]를 넣으면 됨
 */
// eslint-disable-next-line react-refresh/only-export-components
export const routes: [string, string, JSX.Element][] = [
  ['home', '', <>좌측 메뉴에서 표시할 차트 클릭</>],
  ['test페이지', 'test1', <MCV />],
  ['bubblePlot', 'bubbleplot', <BubblePlot />],
  ['brush 테스트', 'brush', <BrushTest></BrushTest>],
  ['barPlot', 'bar', <BarPlotUpdate></BarPlotUpdate>],
  ['scatterPlot', 'scatter', <ScatterPlotUpdate></ScatterPlotUpdate>],
  ['selectableBarPlot', 'selectableBar', <Workspace></Workspace>],
  ['syncBarPlot', 'syncBar', <SyncBarWorkspace></SyncBarWorkspace>],
  ['multipleView', 'multi-view', <MCV></MCV>],
  ['forceDirectedDiagram', 'force-directed-diagram', <ForceDirectedDiagram></ForceDirectedDiagram>]

]

function App() {
  return (
    <>
      <GlobalContext>
        <Routes>
          <Route path="/" element={<Dashboard></Dashboard>}> {/* 기본 레이아웃 */}
            {routes.map(([, path, element]) => <Route path={path} element={element} key={path} />)}
          </Route>
        </Routes>
      </GlobalContext>
    </>
  );
}

export default App;
