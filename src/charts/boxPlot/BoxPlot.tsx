import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BoxPlotChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    render();
  }, []);

  const render = async () => {
    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    d3.select(svgRef.current).select("g").remove();
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = await d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
    );

    // d3.group으로 Species 별로 데이터 그룹화
    const groupedData = d3.group(data, (d) => d.Species);

    // d3.rollup으로 그룹별 요약 통계 계산
    const sumstat = Array.from(groupedData).map(([key, values]) => {
      const sepalLengths = values
        .map((d) => +d.Sepal_Length)
        .sort(d3.ascending); // 숫자로 변환
      const q1 = d3.quantileSorted(sepalLengths, 0.25);
      const median = d3.quantileSorted(sepalLengths, 0.5);
      const q3 = d3.quantileSorted(sepalLengths, 0.75);
      const interQuantileRange = q3 - q1;
      const min = q1 - 1.5 * interQuantileRange;
      const max = q3 + 1.5 * interQuantileRange;
      return {
        Species: key,
        q1,
        median,
        q3,
        interQuantileRange,
        min,
        max,
      };
    });

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(["setosa", "versicolor", "virginica"])
      .paddingInner(1)
      .paddingOuter(0.5);
    svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([3, 9]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("vertLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.Species); // 수정
      })
      .attr("x2", function (d) {
        return x(d.Species); // 수정
      })
      .attr("y1", function (d) {
        return y(d.min); // 수정
      })
      .attr("y2", function (d) {
        return y(d.max); // 수정
      })
      .attr("stroke", "black")
      .style("width", 40);

    // rectangle for the main box
    const boxWidth = 100;

    svg
      .selectAll("boxes")
      .data(sumstat)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.Species) - boxWidth / 2; // 수정
      })
      .attr("y", function (d) {
        return y(d.q3); // 수정
      })
      .attr("height", function (d) {
        return y(d.q1) - y(d.q3); // 수정
      })
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", "#69b3a2");
    // Show the median
    svg
      .selectAll("medianLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.Species) - boxWidth / 2;
      })
      .attr("x2", function (d) {
        return x(d.Species) + boxWidth / 2;
      })
      .attr("y1", function (d) {
        return y(d.median);
      })
      .attr("y2", function (d) {
        return y(d.median);
      })
      .attr("stroke", "black")
      .style("width", 80);
  };

  return <svg ref={svgRef}></svg>;
};

export default BoxPlotChart;
