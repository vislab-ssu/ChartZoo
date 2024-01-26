import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const urlList = [
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv",
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv",
];
let index = false;

export const BarPlotUpdate = () => {
  const [dataUrl, setDataUrl] = useState(urlList[+index]);
  const svgRef = useRef();
  const updateRef = useRef<(data: any[]) => void>();

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

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height], //[[x0,y0],[x1,y1]]
      ])
      .on("start", (e: d3.D3BrushEvent<any>) => {
        // console.log("start", e, this);
      }) //mousedown
      .on("brush", (e: d3.D3BrushEvent<any>) => {
        // console.log("brush", e, this);
      }) //mousemove
      .on("end", (e: d3.D3BrushEvent<any>) => {
        // console.log("end", e, this);
        const { selection } = e;
        if (!e.sourceEvent) return;
        const [x0, x1] = selection as [number, number];
        const xDomain = x.domain();
        const filter = xDomain
          .map((v) => x(v))
          .filter((v) => {
            const pos = v + x.bandwidth() / 2; // bandwitdh()는 막대의 width 값, 그것의 절반이니까 ~까지의 길이이다.
            return x0 <= pos && x1 >= pos;
          });
        //scaleLinaer도 revert? 를 이용해서 역산이 쉽게 가능하다.
        console.log("end", { x0, x1, filter });
        const left = Math.min(...filter);
        const right = Math.max(...filter) + x.bandwidth();
        // console.log(left, right + x.bandwidth());
        brushElement.call(brush.move, [left, right]);
      }); // mouseup
    const brushElement = container.call(brush);

    updateRef.current = function (data) {
      const keys = Object.keys(data[0]);
      console.log({ keys });
      const [xKey, yKey] = keys;
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
        .transition()
        .duration(500)
        .attr("x", (d) => x(d[xKey]))
        .attr("y", (d) => y(+d[yKey]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(+d[yKey]))
        .attr("fill", "#69b3a2")
        .on("click", function (e: MouseEvent, d) {
          // d는 데이터
          console.log({ e, d }, this);
          const rect = d3.select(this);
          const clicked = rect.attr("stroke") == "orange"; // attr 사용가능해짐
          rect.attr("stroke", clicked ? "black" : "orange");
        })
        .on("mouseover", function (e: MouseEvent, d) {
          // d는 데이터
          console.log({ e, d }, this);
          const rect = d3.select(this);

          rect.attr("stroke", "orange");
        })
        .on("mouseend", function (e: MouseEvent, d) {
          // d는 데이터
          console.log({ e, d }, this);
          const rect = d3.select(this);

          rect.attr("stroke", "black");
        })
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    };
  };
  return (
    <>
      <div>
        <button onClick={() => setDataUrl(urlList[+(index = !index)])}>
          change
        </button>
      </div>
      <svg ref={svgRef}></svg>
    </>
  );
};
