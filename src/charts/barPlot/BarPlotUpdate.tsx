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
        .attr("fill", "#69b3a2");
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
