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
    d3.csv(dataUrl).then(updateRef.current)
  }, [dataUrl])

  const renderLayout = () => {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    // d3.select(svgRef.current).select('g').remove(); // react에 의해 중복 생성된 내부 element 제거
    const container = d3.select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("class", 'container')
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
      .range([0, width])
      // .padding(0.2);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const xAxis = container
      .append("g")
      .attr('class', 'xAxis')
      .attr("transform", `translate(0, ${height})`);

    const yAxis = container
      .append("g")
      .attr('class', 'yAxis');

    const scatters = container
      .append('g')
      .attr('class', 'scatters');

    updateRef.current = function (data) {
      const keys = Object.keys(data[0]);
      console.log({ keys });
      let [xKey, , yKey, , colorKey] = keys;
      if (index) [ , colorKey, yKey, , xKey] = keys;
      console.log({xKey, yKey})

      x.domain([0, Math.max(...data.map(d => d[xKey]))]);
      y.domain([0, Math.max(...data.map(v => +v[yKey]))]);

      xAxis.call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
      yAxis.call(d3.axisLeft(y));

      const color = d3
        .scaleOrdinal<string>()
        .domain([...new Set(data.map(c => c[colorKey]))])
        .range(["#440154ff", "#21908dff", "#fde725ff"]);
      console.log(color.domain())
      scatters
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => x(d[xKey]))
        .attr("cy", (d) => y(+d[yKey]))
        .attr("r", 5)
        .style("fill", (d) => color(d[colorKey]));
    }
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
