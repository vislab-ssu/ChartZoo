import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const urlList = [
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv",
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"
];
let index = false;

export const ScatterPlotUpdate = () => {
  const [dataUrl, setDataUrl] = useState(urlList[+index]);
  const svgRef = useRef();
  const updateRef = useRef<(data: any[]) => void>();

  useEffect(() => {
    renderLayout();
  }, []);

  useEffect(() => {
    console.log(dataUrl);
  }, [dataUrl])

  const renderLayout = () => {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    const container = d3.select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("class", 'container')
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
    ).then(function (data) {
      const x = d3.scaleLinear().domain([4, 8]).range([0, width]);
      container
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      const y = d3.scaleLinear().domain([0, 9]).range([height, 0]);
      container.append("g").call(d3.axisLeft(y));

      const color = d3
        .scaleOrdinal<string>()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#440154ff", "#21908dff", "#fde725ff"]);

      container
        .append("g")
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", (d) => x(+d.Sepal_Length))
        .attr("cy", (d) => y(+d.Petal_Length))
        .attr("r", 5)
        .style("fill", (d) => color(d.Species));
    });
  };

  return (
    <>
      <div>
        <button onClick={() => setDataUrl(urlList[+(index = !index)])}>change</button>
      </div>
      <svg ref={svgRef}></svg>
    </>
  )
};
