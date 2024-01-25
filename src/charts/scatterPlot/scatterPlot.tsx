import * as d3 from "d3";
import { useEffect, useRef } from "react";

export const ScatterPlot = () => {
  /* 
  let svgRef라고 할 경우 return을
  <svg ref={(ref) => {svgRef = ref}}></svg> 로 하면 useRef 사용과 같은 효과 
  */
  const svgRef = useRef();  //초기화, current = UNDEFINED

  useEffect(() => {
    render();
  }, []);

  const render = () => {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    // d3.select(svgRef.current).select('g').remove();
    // append the svg object to the body of the page
    const svg = d3.select(svgRef.current)
      // .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then(function (data) {

      // Add X axis
      const x = d3.scaleLinear()
        .domain([4, 8])
        .range([0, width]);

      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        // 아래로 내려야지 수평선
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, 9])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Color scale: give me a specie name, I return a color
      const color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#440154ff", "#21908dff", "#fde725ff"])

      // Add dots
      svg.append('g')
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x(+d.Sepal_Length); })
        .attr("cy", function (d) { return y(+d.Petal_Length); })
        .attr("r", 5)
        .style("fill", function (d) { return color(d.Species) })

    })
  }
  return <svg ref={svgRef}>
    
  </svg>   //svg DOM 객체를 svgRef에 할당
    ;
};  //useEffect 호출
