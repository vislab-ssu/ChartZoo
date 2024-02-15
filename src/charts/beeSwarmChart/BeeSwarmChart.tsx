import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface MyNodeDatum extends d3.SimulationNodeDatum {
  Sector: string;
  Return: number;

  // 또는 다른 적절한 숫자 타입으로 지정
  // 추가로 필요한 다른 속성들
}

export const BeeSwarmChart = () => {
  const svgRef = useRef();
  useEffect(() => {
    render();
  }, []);
  const render = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 50, right: 60, bottom: 50, left: 100 },
      width = 1920 - margin.left - margin.right,
      height = 1080 - margin.top - margin.bottom;

    // append the svg object to the body of the pages
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Read the data
    d3.csv(
      "https://raw.githubusercontent.com/janvarsa/D3-Swarm-Tutorial/master/data.csv"
    ).then(function (data: d3.DSVRowArray<string>) {
      const sectors = Array.from(new Set(data.map((d) => d.Sector)));

      // Add X axis, dot 위치를 결정해주는 코드였음;;
      const xScale = d3.scaleBand().domain(sectors).range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data.map((d) => +d["Return"])))
        .range([height, 0]);

      const color: d3.ScaleOrdinal<string, string> = d3
        .scaleOrdinal()
        .domain(sectors)
        .range(d3.schemePaired);
      console.log(color);

      const marketcapDomain = d3.extent(data.map((d) => +d["Market Cap"]));

      const size = d3.scaleSqrt().domain(marketcapDomain).range([3, 40]);
      // x 축그리기
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

      // y축 그리기
      svg.append("g").call(d3.axisLeft(yScale));

      svg
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("stroke", "black")
        .attr("fill", (d) => color(d.Sector))
        .attr("r", (d) => size(+d["Market Cap"]))
        .attr("cx", (d) => xScale(d.Sector))
        .attr("cy", (d) => yScale(+d.Return));

      d3.forceSimulation<MyNodeDatum>(data)
        .force(
          "x",
          d3
            .forceX<MyNodeDatum>(function (d) {
              return xScale(d.Sector);
            })
            .strength(0.2)
        )
        .force(
          "y",
          d3
            .forceY<MyNodeDatum>(function (d) {
              return yScale(d.Return);
            })
            .strength(1)
        )
        .force(
          "collide",
          d3.forceCollide((d) => {
            return size(+d["Market Cap"]);
          })
        )
        .alphaDecay(0)
        .alpha(0.3)
        .on("tick", tick);

      function tick() {
        d3.selectAll(".dot")
          .attr("cx", (d: MyNodeDatum) => d.x)
          .attr("cy", (d: MyNodeDatum) => d.y);
      }
    });
  };

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};
