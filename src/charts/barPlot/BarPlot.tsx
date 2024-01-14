import * as d3 from "d3"; // 자동완성으로 추가하면 import d3 from "d3"; 가 추가되는데, 항상 * as 를 붙여야 함
import { useEffect, useRef } from "react";

/** https://d3-graph-gallery.com/graph/barplot_basic.html */
export const BarPlot = () => {
  const svgRef = useRef();

  useEffect(() => {
    render();
  }, []);

  const render = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    d3.select(svgRef.current).select("g").remove();
    // append the svg object to the body of the page
    const svg = d3
      .select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
    ).then(function (data) {
      // X axis
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.Country))
        .padding(0.2);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Add Y axis
      const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Bars
      svg
        .selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.Country))
        .attr("y", (d) => y(+d.Value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(+d.Value))
        .attr("fill", "#69b3a2");
    });
  };
  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};
