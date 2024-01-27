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
    d3.csv(dataUrl).then(updateRef.current)
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

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const color = d3
      .scaleOrdinal<string>()
      .range(["#440154ff", "#21908dff", "#fde725ff", "red", "blue"]);

    const xAxis = container.append('g')
      .attr('class', 'xAxis')
      .attr("transform", `translate(0, ${height})`);
    const yAxis = container.append('g').attr('class', 'yAxis');
    const dots = container.append('g').attr('class', 'dots');

    const mapper = {
      0: {
        xKey: 'Sepal_Length',
        yKey: 'Petal_Length',
        colorKey: 'Species'
      },
      1: {
        xKey: 'gdpPercap',
        yKey: 'lifeExp',
        colorKey: 'continent'
      }
    }

    updateRef.current = function (data) {
      console.log(data, mapper[+index]);
      const { xKey, yKey, colorKey } = mapper[+index];
      const { xMap, yMap, colorMap } = data.reduce((acc, val) => {
        acc.xMap.push(val[xKey]);
        acc.yMap.push(val[yKey]);
        acc.colorMap.add(val[colorKey]);
        return acc;
      }, { xMap: [], yMap: [], colorMap: new Set() });

      const xMin = Math.min(...xMap);
      const xMax = Math.max(...xMap);

      const yMin = Math.min(...yMap);
      const yMax = Math.max(...yMap);

      console.log({ colorMap })

      x.domain([xMin, xMax]);
      y.domain([yMin, yMax]);
      color.domain(colorMap)
      xAxis.call(d3.axisBottom(x));
      yAxis.call(d3.axisLeft(y));

      dots.selectAll("circle")
        .data(data)
        .join("circle")
        .transition()
        .duration(500)
        .attr("cx", (d) => x(+d[xKey]))
        .attr("cy", (d) => y(+d[yKey]))
        .attr("r", 5)
        .style("fill", (d) => color(d[colorKey]));
    };
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
