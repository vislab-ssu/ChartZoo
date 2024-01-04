import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function BubblePlot() {
  const svgRef = useRef();
  const tooltipRef = useRef();
  useEffect(() => {
    render();
  }, []);
  const render = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 40, right: 150, bottom: 60, left: 30 },
      width = 1200 - margin.left - margin.right,
      height = 900 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svgRoot = d3
      .select(svgRef.current)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    svgRoot.select("g.container").remove();
    const svg = svgRoot
      .append("g")
      .attr("class", "container")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"
    ).then((data) => {
      // ---------------------------//
      //       AXIS  AND SCALE      //
      // ---------------------------//

      // Add X axis
      const x = d3.scaleLinear().domain([0, 45000]).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(3));

      // Add X axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 50)
        .text("Gdp per Capita");

      // Add Y axis
      const y = d3.scaleLinear().domain([35, 90]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Add Y axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("Life expectancy")
        .attr("text-anchor", "start");

      // Add a scale for bubble size           1318683096
      const z = d3.scaleSqrt().domain([200000, 1310000000]).range([2, 30]);

      // Add a scale for bubble color
      const myColor = d3
        .scaleOrdinal<string, string>()
        .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
        .range(d3.schemeSet1);

      // ---------------------------//
      //      TOOLTIP               //
      // ---------------------------//

      // -1- Create a tooltip div that is hidden by default:
      const tooltip = d3
        .select(tooltipRef.current)
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

        .style("position", "fixed")
        .style("z-index", "1000")
        .style("display", "block");

      // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
      const showTooltip = function (event, d) {
        tooltip.transition().duration(200);
        tooltip
          .style("opacity", 1)
          .html("Country: " + d.country)
          .style("left", event.x + "px")
          .style("top", event.y + 30 + "px")
          .style("display", "block");
      };
      const moveTooltip = function (event, d) {
        tooltip.style("left", event.x + "px").style("top", event.y + 30 + "px");
      };
      const hideTooltip = function (event, d) {
        tooltip.style("opacity", 0).style("display", "none");
      };

      // ---------------------------//
      //       HIGHLIGHT GROUP      //
      // ---------------------------//

      // What to do when one group is hovered
      const highlight = function (event, d) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", 0.05);
        // expect the one that is hovered
        d3.selectAll("." + d).style("opacity", 1);
      };

      // And when it is not hovered anymore
      const noHighlight = function (event, d) {
        d3.selectAll(".bubbles").style("opacity", 1);
      };

      // ---------------------------//
      //       CIRCLES              //
      // ---------------------------//
      // Add dots
      const dots = svg.append("g").attr("class", "dots");
      console.log(svg.select("g"));
      dots
        .selectAll("circle.bubbles")
        .data(data)
        .join("circle")
        .attr("class", function (d: any) {
          return "bubbles " + d.continent;
        })
        .attr("cx", (d: any) => x(d.gdpPercap))
        .attr("cy", (d: any) => y(d.lifeExp))
        .attr("r", (d: any) => z(d.pop))
        .style("fill", (d: any) => myColor(d.continent))
        // -3- Trigger the functions for hover
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

      // ---------------------------//
      //       LEGEND               //
      // ---------------------------//
      // Add one dot in the legend for each name.
      const size = 20;
      const allgroups = ["Asia", "Europe", "Americas", "Africa", "Oceania"];
      const legend = svg.append("g").attr("class", "legend");
      legend
        .selectAll("circle.legend-dot")
        .data(allgroups)
        .join("circle")
        .attr("class", "legend-dot")
        .attr("cx", width - 200)
        .attr("cy", (d, i) => 300 + i * (size + 5))
        .attr("r", 7)
        .style("fill", (d) => myColor(d))
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

      // Add labels beside legend dots
      legend
        .selectAll("legend-Labels")
        .data(allgroups)
        .join("text")
        .attr("class", "legend-Labels")
        .attr("x", width - 200 + size * 0.8)
        .attr("y", (d, i) => 300 + i * (size + 5))
        .style("fill", (d) => myColor(d))
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);
    });
  };
  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
}
