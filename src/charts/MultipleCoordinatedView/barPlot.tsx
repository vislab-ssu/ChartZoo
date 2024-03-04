import * as d3 from "d3";
import { useContext, useEffect, useRef } from "react";
import { BirdStike, BirdStrikeKeys, DataContext } from "../../Context";

export const BarPlot = ({ xKey }: { xKey: BirdStrikeKeys }) => {
  const { source, filteredSource, setFilterList } = useContext(DataContext);
  const containerRef = useRef<SVGGElement>();
  const updateRef = useRef<(data: any[]) => void>();

  useEffect(() => {
    if (updateRef.current) {
      updateRef.current(filteredSource);
    }
  }, [filteredSource]);

  const margin = { top: 40, right: 30, bottom: 70, left: 60 },
    svgWidth = 460,
    svgHeight = 400,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

  const render = () => {
    // append the svg object to the body of the page
    const container = d3.select(containerRef.current);
    container.selectAll("*").remove();
    const x = d3.scaleBand().range([0, width]).padding(0.4);

    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = container
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${height})`);

    const xKeyLabel = container
      .append("text")
      .attr("transform", `translate(${width / 2 - margin.left}, -20)`)
      .text(xKey);

    const yAxis = container.append("g").attr("class", "yAxis");

    const bars = container.append("g").attr("class", "bars");

    const counterBars = container.append("g").attr("class", "counter-bars");

    const yKey = "value";
    const getNumberOfXKey = (acc, val) => {
      const isExist = acc.find((v) => v[xKey] == val[xKey]);
      if (isExist) {
        isExist.value++;
      } else {
        acc.push({
          [xKey]: val[xKey],
          value: 1,
        });
      }
      return acc;
    };
    const numberOfXKey = source.reduce(getNumberOfXKey, []);
    console.log(numberOfXKey);
    const xKeys = numberOfXKey.map((d) => d[xKey]);
    // X axis
    x.domain(xKeys);
    y.domain([0, Math.max(...numberOfXKey.map((v) => +v[yKey]))]);

    xAxis
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .attr("font-size", 13)
      .style("text-anchor", "end");
    yAxis.call(d3.axisLeft(y));

    bars
      .selectAll("rect")
      .data(numberOfXKey)
      .join("rect")
      .on("click", function (e, d) {
        // 테두리 굵기 highlighting 및 setFilterList 로직 작성
        console.log(d);
        setFilterList((prevFilterList) => {
          const has = prevFilterList["Wildlife Size"].has(d["Wildlife Size"]);
          if (has) {
            prevFilterList["Wildlife Size"].delete(d["Wildlife Size"]);
          } else {
            prevFilterList["Wildlife Size"].add(d["Wildlife Size"]);
          }
          d3.select(this).attr("stroke", has ? "black" : "red");
          return { ...prevFilterList };
        });
      })
      .attr("x", (d) => x(d[xKey]))
      .attr("y", (d) => y(+d[yKey]))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(+d[yKey]))
      .attr("opacity", 1)
      .attr("fill", "#69b3a2")
      .attr("cursor", "pointer");

    updateRef.current = function (filteredSource: BirdStike[]) {
      const numberOfFilteredData = filteredSource.reduce(getNumberOfXKey, []);
      const data = numberOfFilteredData.length ? numberOfFilteredData : [];

      // counter 역할을 할 막대 업데이트
      counterBars
        .selectAll("rect")
        .data(data)
        .join("rect")
        .on("click", function (e, d) {
          // 테두리 굵기 highlighting 및 setFilterList 로직 작성
          // bars에서 만들 것과 동일함
          // 전체, 개수 막대 모두 클릭이 가능하도록 해야 함
          setFilterList((prevFilterList) => {
            const has = prevFilterList["Wildlife Size"].has(d["Wildlife Size"]);
            if (has) {
              prevFilterList["Wildlife Size"].delete(d["Wildlife Size"]);
            } else {
              prevFilterList["Wildlife Size"].add(d["Wildlife Size"]);
            }
            d3.select(this).attr("stroke", has ? "black" : "red");
            return { ...prevFilterList };
          });
        })
        .attr("fill", "darkred")
        .attr("x", (d) => x(d[xKey]))
        .attr("y", (d) => y(+d[yKey]))
        .attr("height", (d) => height - y(+d[yKey]))
        .attr("width", x.bandwidth())
        .attr("opacity", 1)
        .attr("cursor", "pointer");

      // 개수 text 표시
      counterBars
        .selectAll("text")
        .data(data)
        .join("text")
        .text((d: any) => d.value)
        .attr("x", (d) => x(d[xKey]) + x.bandwidth() / 3)
        .attr("y", (d) => y(+d[yKey]) - 5);
    };
  };

  useEffect(() => {
    render();
  }, []);

  useEffect(() => {
    updateRef.current(filteredSource);
  }, [filteredSource]);

  return (
    <>
      <svg width={svgWidth} height={svgHeight}>
        <g
          ref={containerRef}
          className="container"
          transform={`translate(${margin.left},${margin.top})`}
        ></g>
      </svg>
    </>
  );
};
