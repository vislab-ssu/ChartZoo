import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CandlestickChart = () => {
  const newData = [
    { date: new Date("2022-01-01"), open: 100, high: 110, low: 90, close: 105 },
    { date: new Date("2022-01-02"), open: 105, high: 115, low: 95, close: 110 },
    { date: new Date("2022-01-03"), open: 125, high: 115, low: 95, close: 110 },
    // 추가 데이터 필요
  ];
  const data = Object.values(newData);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(svgRef.current).selectAll("svg").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    // const width = data.length * 75; // 해결책이라는데 모르겠음
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);

    const y = d3.scaleLinear().range([height, 0]);

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.date.toISOString()));

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)]);

    g.selectAll(".candle")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "candle")
      .attr("x", (d) => xScale(d.date.toISOString()))
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("width", "20px")
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", (d) => (d.close >= d.open ? "green" : "red"));

    g.selectAll(".wick")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "wick")
      .attr("x", (d) => xScale(d.date.toISOString()) + 10)
      .attr("y", (d) => yScale(d.high))
      .attr("width", "1px")
      .attr("height", (d) => yScale(d.low) - yScale(d.high))
      .attr("fill", (d) => (d.close >= d.open ? "green" : "red"));

    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);

    const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(10);

    g.append("g")
      .attr("transform", `translate(0,${height})`)

      .attr("dx", "10em")
      .style("display", "flex")
      .style("text-anchor", "center")
      .style("font-size", "12px")
      .style("margin", "20px")
      .attr("overflow", "scroll")
      .style("color", "white");

    g.append("g").call(yAxis).style("color", "white");

    g.selectAll("xGrid")
      .data(x.ticks().slice(1))
      .join("line")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "red")
      .attr("stroke-width", 0.5);

    g.selectAll("yGrid")
      .data(y.ticks().slice(1))
      .join("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "green")
      .attr("stroke-width", 0.5);
  }, [data]);

  return (
    <div ref={svgRef} style={{ width: "auto", overflowX: "scroll" }}></div>
  );
};

export default CandlestickChart;
