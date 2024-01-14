import * as d3 from "d3";
import { useEffect, useRef } from "react";

// https://d3-graph-gallery.com/graph/scatter_grouped.html
// 그룹 산점도 그래프 : 최서현

export const ScatterPlot = () => {
  const svgRef = useRef();
  useEffect(() => {
    render();
  }, []);
  const render = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    d3.select(svgRef.current).select("g").remove();

    // append the svg object to the body of the page
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Read the data
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
    ).then(function (data) {
      // Add X axis
      const x = d3.scaleLinear().domain([4, 8]).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear().domain([0, 9]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Color scale: give me a specie name, I return a color
      const color = d3
        .scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#440154ff", "#21908dff", "#fde725ff"]);

      // Add dots
      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) {
          return x(Number(d.Sepal_Length));
        })
        .attr("cy", function (d) {
          return y(Number(d.Petal_Length));
        })
        .attr("r", 5)
        .style("fill", function (d) {
          return color(d.Species) as string;
        });
    });
  };

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};
