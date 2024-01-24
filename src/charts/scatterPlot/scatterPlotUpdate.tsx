import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const urlList = [
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv",
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv",
];
let index = false;

export const ScatterPlotUpdate = () => {
  // 지금 데이터셋으로 사용할 url
  const [dataUrl, setDataUrl] = useState(urlList[+index]);
  // 데이터셋이 업데이트되면 호출할 업데이트 함수
  const updateRef = useRef<(data: any[]) => void>();

  // svg DOM 객체
  const svgRef = useRef();

  // useEffect : 초기화 후 한번 호출 (레이아웃만 그려줌[크기, margin, 축 등])
  useEffect(() => {
    renderLayout();
  }, []);

  // useEffect : 데이터셋이 바뀔 때마다 호출
  useEffect(() => {
    console.log(dataUrl);
    d3.csv(dataUrl).then(updateRef.current);
  }, [dataUrl]);

  const renderLayout = () => {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    // d3.select(svgRef.current).select('g').remove(); // react에 의해 중복 생성된 내부 element 제거
    const container = d3
      .select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("class", "container")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    /////////////////////////////
    // 변하지 않는 정적인 부분 //
    /////////////////////////////

    // scale 함수(변하지 않는 정적인 부분)
    // 결과값인 range만 설정
    const x = d3.scaleLinear().range([0, width]);

    const y = d3.scaleLinear().range([height, 0]);

    // 축 및 scatter 그룹(변하지 않는 정적인 부분)
    // 축을 생성하는 .call(d3.axisXXX)함수만 빼고 설정
    const xAxis = container
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${height})`);

    const yAxis = container.append("g").attr("class", "yAxis");

    // scatter그룹도 그룹만 설정하고 끝
    const scatters = container.append("g").attr("class", "scatters");

    //////////////////////////////
    // 변할 수 있는 동적인 부분 //
    //////////////////////////////
    // (scale함수의 domain 설정/변경, scatter 생성/업데이트 등)

    updateRef.current = function (data) {
      ///////////////////////////////////////////////////////////
      // dataset의 변경에 따라 x, y축 key가 달라지는 문제 해결 //
      ///////////////////////////////////////////////////////////
      const keys = Object.keys(data[0]);
      console.log({ keys });
      // Object.keys 함수로 key 추출 및 xKey, yKey, color로 구조 분해 할당
      let xKey: any, yKey: any, color: any;
      if (data.length === 150) {
        // x: Sepal_Length y: Petal_Length color: Species
        [xKey, , yKey, , color] = keys;
      } else {
        // x: gdpPercap, y: lifeExp, color: country
        [color, , yKey, , xKey] = keys;
      }

      ////////////////////////////
      // scale 함수 domain 설정 //
      ////////////////////////////
      x.domain([
        Math.min(...data.map((d) => +d[xKey])),
        Math.max(...data.map((d) => +d[xKey])),
      ]);
      y.domain([0, Math.max(...data.map((v) => +v[yKey]))]);

      ////////////////////////////////////////
      // .call(d3.axisXXX...)함수로 축 생성 //
      ////////////////////////////////////////
      xAxis.call(d3.axisBottom(x));
      // .selectAll("text")
      // .attr("transform", "translate(-10,0)rotate(-45)")
      // .style("text-anchor", "end");
      yAxis.call(d3.axisLeft(y));

      // const scatterColor = d3
      //   .scaleOrdinal<string>()
      //   .domain(["setosa", "versicolor", "virginica"])
      //   .range(["#440154ff", "#21908dff", "#fde725ff"]);

      //////////////////
      // scatter 생성 //
      //////////////////
      scatters
        .selectAll("circle")
        .data(data)
        .join("circle")
        .transition()
        .duration(500)
        .attr("cx", function (d) {
          return x(+d[xKey]);
        })
        .attr("cy", function (d) {
          return y(+d[yKey]);
        })
        .attr("r", 5);
      // .style("fill", function (d) {
      //   return scatterColor(d[color]);
      // });
    };
  };

  return (
    <>
      <div>
        <button onClick={() => setDataUrl(urlList[+(index = !index)])}>
          change
        </button>
      </div>
      <svg ref={svgRef}></svg>
    </>
  );
};
