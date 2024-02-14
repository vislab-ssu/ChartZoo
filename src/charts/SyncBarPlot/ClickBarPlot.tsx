import * as d3 from "d3"; // 자동완성으로 추가하면 import d3 from "d3"; 가 추가되는데, 항상 * as 를 붙여야 함
import { useEffect, useRef } from "react";
import { SyncBarPlotProps } from ".";

export const ClickBarPlot = ({
  dataUrl,
  selectedList,
  setSelectedList,
}: SyncBarPlotProps) => {
  const svgRef = useRef();
  // const containerRef =
  //   useRef<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
  const updateRef = useRef<(data: any[]) => void>();
  const xKeyRef = useRef<string>();

  useEffect(() => {
    renderLayout();
  }, []);

  useEffect(() => {
    d3.csv(dataUrl).then(updateRef.current);
  }, [dataUrl]);

  useEffect(() => {
    d3.selectAll("g.bars")
      .selectAll("rect")
      .attr("stroke", (d) =>
        selectedList.includes(d[xKeyRef.current]) ? "red" : "black"
      );
  }, [selectedList]);

  const renderLayout = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // containerRef.current = d3
    //   .select(svgRef.current)
    //   .attr("width", svgWidth)
    //   .attr("height", svgHeight)
    //   .append("g")
    //   .attr("class", "container")
    //   .attr("transform", `translate(${margin.left},${margin.top})`);
    // const container = containerRef.current;
    const container = d3
      .select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("class", "container")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).padding(0.2);

    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = container
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${height})`);

    const yAxis = container.append("g").attr("class", "yAxis");

    const bars = container.append("g").attr("class", "bars");

    updateRef.current = function (data) {
      const [xKey, yKey] = Object.keys(data[0]);
      xKeyRef.current = xKey;
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
        // d3.selection 객체에 on 메서드가 있으며 이 함수로 이벤트 등록 가능
        .on(
          "click",
          function (
            e: MouseEvent,
            d: any /** data에 타입을 설정하면 그것으로 지정됨 */
          ) {
            setSelectedList((prevSelectionList) => {
              let next;
              const has = prevSelectionList.includes(d[xKey]);
              if (has) {
                next = prevSelectionList.filter((v) => v != d[xKey]);
              } else {
                next = [...prevSelectionList];
                next.push(d[xKey]);
              }
              d3.select(this).attr("stroke", has ? "black" : "red"); // .on(event, ...)에서 화살표함수 말고 function을 쓰면 this는 rect element가 됨
              return next;
            });
          }
        )
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
      <p>[click]selectable bar plot</p>
      <svg ref={svgRef}></svg>
    </>
  );
};
