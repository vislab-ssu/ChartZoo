import * as d3 from "d3"; // 자동완성으로 추가하면 import d3 from "d3"; 가 추가되는데, 항상 * as 를 붙여야 함
import { useEffect, useRef, useState } from "react";

const urlList = [
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv",
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv",
];
let index = false;
type SelectableBarPlotProps = {
  setSelectedList: React.Dispatch<React.SetStateAction<string[]>>;
};

export const BrushBarPlot = ({ setSelectedList }: SelectableBarPlotProps) => {
  const [dataUrl, setDataUrl] = useState(urlList[+index]);
  const svgRef = useRef();
  const containerRef =
    useRef<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
  const updateRef = useRef<(data: any[]) => void>();
  const handleChangeButton = () => {
    setDataUrl(urlList[+(index = !index)]);
    setSelectedList([]); // dataset 바뀌면 선택 목록 초기화
  };

  useEffect(() => {
    renderLayout();
  }, []);

  useEffect(() => {
    d3.csv(dataUrl).then(updateRef.current);
  }, [dataUrl]);

  const renderLayout = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    containerRef.current = d3
      .select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("class", "container")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const container = containerRef.current;

    const x = d3.scaleBand().range([0, width]).padding(0.2);

    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = container
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${height})`);

    const yAxis = container.append("g").attr("class", "yAxis");

    const bars = container.append("g").attr("class", "bars");

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ]) // [[x0, y0], [x1, y1]] (좌상단, 우하단), brushing 가능 영역
      .on("brush", brushing) // mouse move
      .on("end", brushEnd); // mouse up

    const brushElement = container.call(brush);
    function brushing(e: d3.D3BrushEvent<any>) {
      if (!e.sourceEvent) return; // brush.move와 같은 코드상 이동에 대한 방어
      if (!e.selection) return; // 대충 클릭했을 때(?)
      const [x0, x1] = e.selection as [number, number]; //선택 영역 시작점 : x0 / 선택 영역 끝점 : x1
      const selectedList = x.domain().filter((d) => {
        const pos = x(d) + x.bandwidth() / 2;
        return pos >= x0 && pos <= x1;
      });
      const [left, right] = d3.extent(selectedList.map(x)); // extent 함수 : [최솟값, 최댓값] 반환
      // console.log({ left, right });
      // 실시간 적용이 하고싶으면 setSelectedList를 여기서 사용하고 brushEnd 핸들러 제거
      brushElement.call(brush.move, [left, right + margin.right]);
    }
    function brushEnd(e: d3.D3BrushEvent<any>) {
      if (!e.sourceEvent) return;
      if (!e.selection) {
        setSelectedList([]);
        return;
      }
      const [x0, x1] = e.selection as [number, number];
      const selectionList = x.domain().filter((v) => {
        const range = x(v);
        return range >= x0 && range <= x1;
      });
      console.log({ selectionList });
      setSelectedList(selectionList);
      // brushElement.call(brush.clear); // brush 끝내면 영역 상자 제거
    }
    updateRef.current = function (data) {
      const [xKey, yKey] = Object.keys(data[0]);
      console.log({ xKey, yKey });
      // X axis
      x.domain(data.map((d) => d[xKey]));
      y.domain([0, Math.max(...data.map((v) => +v[yKey]))]);

      xAxis
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
      yAxis.call(d3.axisLeft(y));

      bars
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .transition()
        .duration(500)
        .attr("x", (d) => x(d[xKey]))
        .attr("y", (d) => y(+d[yKey]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(+d[yKey]))
        .attr("fill", "#69b3a2");
    };
  };
  return (
    <>
      <p>[brush]selectable bar plot</p>
      <div>
        <button onClick={handleChangeButton}>dataset change</button>
      </div>
      <svg ref={svgRef}></svg>
    </>
  );
};
