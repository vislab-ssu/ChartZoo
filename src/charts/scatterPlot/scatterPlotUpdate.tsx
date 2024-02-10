import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

// 사용할 데이터셋 url 목록
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

  /* 
    [ 실행 흐름 순서 ]
    1. 첫 실행
    2. 전부 초기화
    3. useEffect 호출 -> renderLayou 호출
    4. 정적인 부분 생성
    5. useEffect 호출 -> d3.csv(dataUrL) 호출
    6. .then(updateRef.current) 호출
    7. 동적인 부분 생성

    이후 change 버튼을 누를 때마다...
    1. setDataUrl 호출 및 dataUrl 변경
    2. re-render
    3. useEffect 호출 -> d3.csv(dataUrl) 호출
    4. .then(updateRef.current) 호출
    5. 동적인 부분 업데이트
  */

  // useEffect : 초기화 후 한번 호출 => (레이아웃만 그려줌[크기, margin, 축 등])
  useEffect(() => {
    renderLayout();
  }, []);

  // useEffect : 데이터셋이 바뀔 때마다 호출
  // => d3.csv 함수로 csv 파일 parsing 하고 updateRef 함수 호출
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
      .append("g")
      .attr("class", "container")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    ///////////////////////
    // 변하지 않는 정적인 부분 //
    ///////////////////////

    // scale 함수(변하지 않는 정적인 부분)
    // 결과값인 range만 설정
    const x = d3.scaleLinear().range([0, width]);

    const y = d3.scaleLinear().range([height, 0]);

    const color = d3
      .scaleOrdinal<string>()
      .range(["#440154ff", "#21908dff", "#fde725ff", "red", "blue"]);

    // 축 및 scatter 그룹(변하지 않는 정적인 부분)
    // 축을 생성하는 .call(d3.axisXXX)함수만 빼고 설정
    const xAxis = container
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${height})`);

    const yAxis = container.append("g").attr("class", "yAxis");

    // scatter그룹도 그룹만 설정하고 끝
    const scatters = container.append("g").attr("class", "scatters");

    ////////////////////////
    // 변할 수 있는 동적인 부분 //
    ////////////////////////
    // (scale함수의 domain 설정/변경, scatter 생성/업데이트 등)

    updateRef.current = function (data) {
      //////////////////////////////////////////////////
      // dataset의 변경에 따라 x, y축 key가 달라지는 문제 해결 //
      //////////////////////////////////////////////////
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
        Math.floor(Math.min(...data.map((d) => +d[xKey]))),
        Math.ceil(Math.max(...data.map((d) => +d[xKey]))),
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

      const scatterColor = d3
        .scaleOrdinal<string>()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#440154ff", "#21908dff", "#fde725ff"]);

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
        .attr("r", 5)
        .style("fill", function (d) {
          console.log(scatterColor(d[color]));
          console.log(d[color]);
          return scatterColor(d[color]);
        });
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
