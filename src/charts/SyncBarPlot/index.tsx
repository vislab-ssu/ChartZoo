import { useState } from "react";
import { BrushBarPlot } from "./BrushBarPlot";
import { ClickBarPlot } from "./ClickBarPlot";

export type SyncBarPlotProps = {
  dataUrl: string;
  selectedList: string[];
  setSelectedList: React.Dispatch<React.SetStateAction<string[]>>;
};

const urlList = [
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv",
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv",
];
let index = false;

export const SyncBarWorkspace = () => {
  const [dataUrl, setDataUrl] = useState(urlList[+index]);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const handleChangeButton = () => {
    setDataUrl(urlList[+(index = !index)]);
    setSelectedList([]); // dataset 바뀌면 선택 목록 초기화
  };
  console.log("rerender");
  return (
    <>
      <div>
        <button onClick={handleChangeButton}>dataset change</button>
      </div>
      <div style={{ display: "flex" }}>
        <ClickBarPlot
          dataUrl={dataUrl}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        ></ClickBarPlot>
        <BrushBarPlot
          dataUrl={dataUrl}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        ></BrushBarPlot>
      </div>
      <p>selected List</p>
      <ul>
        {selectedList.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    </>
  );
};
