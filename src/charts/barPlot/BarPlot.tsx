import * as d3 from "d3"; // 자동완성으로 추가하면 import d3 from "d3"; 가 추가되는데, 항상 * as 를 붙여야 함
import { useEffect, useRef } from "react";

/** https://d3-graph-gallery.com/graph/barplot_basic.html */
export const BarPlot = () => {
  const svgRef = useRef<SVGElement>();

  useEffect(() => {
    render();
  }, []);

  const render = () => {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // 추가 : 중복 생성된 내부 element 제거
    // 코드 수정할 때마다 차트 중복 생성 방지
    d3.select(svgRef.current).select('g').remove();
    
    // append the svg object to the body of the page
    // id=my_dataviz인 DOM 선택 후 자식으로 svg 생성
    // const svg = d3.select("#my_dataviz") ->
    // useRef를 통해 svg DOM 객체를 svgRef에 할당
    const svg = d3.select(svgRef.current)
      // .append("svg") 이미 svg라서 필요없음
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv").then(function (data) {

      // X axis
      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Country))
        .padding(0.2);
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, 13000])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Bars
      svg.selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.Country))
        .attr("y", d => y(+d.Value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(+d.Value))
        .attr("fill", "#69b3a2")

    })
  }
  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  )
}