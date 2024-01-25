import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
const urlList = [
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv",
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv",
];
let index = false;
export const ScatterPlotUpdate = () => {
  const [dataUrl, setDataUrl] = useState(urlList[+index]);
  const svgRef = useRef();
  const updateRef = useRef<(data: any[]) => void>();

  useEffect(() => {
    render();
  }, []);

  useEffect(() => {
    d3.csv(dataUrl).then(updateRef.current);
  }, [dataUrl]);
  const render = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;
    //   width = 460 - margin.left - margin.right,
    //   height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("class", "svg")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear().range([0, width]);

    // Add Y axis
    const y = d3.scaleLinear().range([height, 0]);

    // svg.append("g").call(d3.axisLeft(y));
    const xAxis = svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0,${height})`);

    const yAxis = svg.append("g").attr("class", "yAxis");

    const dots = svg.append("g").attr("class", "dots");

    updateRef.current = function (data) {
      const keys = Object.keys(data[0]);

      let colorKey, yKey, xKey;
      console.log(keys[0].length);
      if (keys[0].length === 7) {
        [colorKey, , yKey, , xKey] = keys;
        console.log(colorKey, xKey);
      } else {
        [xKey, , yKey, , colorKey] = keys;
      }
      console.log(colorKey);
      // Color scale: give me a specie name, I return a color
      const color = d3
        .scaleOrdinal<string>()

        .range(["#440154ff", "#21908dff", "#fde725ff"]);

      x.domain([
        Math.min(...data.map((d) => +d[xKey])),
        Math.max(...data.map((d) => +d[xKey])),
      ]);

      y.domain([0, Math.max(...data.map((v) => +v[yKey]))]);

      xAxis.call(d3.axisBottom(x));
      // .attr("transform", "translate(-10,0)rotate(-45)")
      // .style("text-anchor", "end");
      yAxis.call(d3.axisLeft(y));

      dots
        .selectAll("circle")
        .data(data)
        .join("circle")
        .transition()
        .duration(500)
        .attr("cx", function (d) {
          return x(Number(+d[xKey]));
        })
        .attr("cy", function (d) {
          return y(Number(+d[yKey]));
        })
        .attr("r", 5)
        .style("fill", function (d): string {
          return color(String(d[colorKey]));
        });
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
