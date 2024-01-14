import * as d3 from "d3";
import { useEffect, useRef } from "react";

// https://d3-graph-gallery.com/graph/scatter_grouped.html
// 그룹 산점도 그래프 : 최서현

export const scatterPlot = () => {
  const svgRef = useRef();

  useEffect(() => {
    render();
  }, []);

  const render = () => {};

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};
