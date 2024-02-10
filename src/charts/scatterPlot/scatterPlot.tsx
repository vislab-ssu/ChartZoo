import * as d3 from "d3";
import { useEffect, useRef } from "react";

/*
  [ 전체 코드 실행 순서 ]
  1. ScatterPlot 함수 호출
  2. useRef 초기화
  3. useEffect 등록 (호출 X)
  4. render 함수 초기화 (호출 X)
  5. jsx return 및 svg DOM 객체를 svgRef에 할당
  6. 등록했던 useEffect 호출
  7. render 함수 호출 (차트 그리기)
*/

export const ScatterPlot = () => {
  // let svgRef라고 할 경우 return을 <svg ref={(ref) => {svgRef = ref}}></svg> 로 하면 useRef 사용과 같은 효과
  const svgRef = useRef();

  useEffect(() => {
    render();
  }, []);

  /////////////////////////////
  //////// render 코드 ////////
  /////////////////////////////

  const render = () => {
    ////////////////////////
    // 차트 상하좌우 여백 //
    ////////////////////////
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      svgWidth = 460,
      svgHeight = 400,
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    /*
    d3.select() : 인자로 들어온 값을 선택

    d3.select 함수의 인자
    -> object 타입의 경우 DOM 객체
      - document.querySelector로 검색한 DOM
      - useRef로 뽑아낸 DOM
    -> string 타입의 경우 selector 형식
      - #my_dataviz
      - .container
      - div

    return :
    - 선택한 DOM 객체가 d3.Selection으로 wrapping 되어 반환됨
    - wrapping되어 반환된 객체는 d3.selection의 메서드들을 사용할 수 있음
      ( select, append, attr 등등 다시 사용 가능 )
    */

    // react에 의해 중복 생성된 내부 element 제거
    d3.select(svgRef.current).select("g").remove();

    ///////////////////////////////////////////////////
    // append the svg object to the body of the page //
    ///////////////////////////////////////////////////
    const svg = d3
      .select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g") // 선택된 DOM 객체[코드상 svg]의 자식(인자로 넣은 요소[코드상 g])를 추가하는 함수
      .attr("transform", `translate(${margin.left}, ${margin.top})`); // transform 속성의 값으로 translate(x,y) 사용
    // 메서드 체이닝에서 최종 return 값은 마지막 사용한 select/append (const svg는 g element가 할당)

    ///////////////////
    // Read the data //
    ///////////////////
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
    ).then(function (data) {
      ///////////////////
      // Add X. Y axis //
      ///////////////////
      const x = d3.scaleLinear().domain([4, 8]).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)); // axisBottom : 수평선-tick이 아래를 향함

      const y = d3.scaleLinear().domain([0, 9]).range([height, 0]); // y의 range는 반대
      svg.append("g").call(d3.axisLeft(y)); // axisLeft : 수직선-tick이 왼쪽을 향함

      // .call(d3.axisXyzw(domain과 range가 설정된 scale함수)) 형태로 사용

      // x축은 수평선 & tick이 아래를 향해야 하므로 axisBottom 사용
      // 컨테이너 때 사용한 transform, translate로 height만큼 내려 줌
      // y축은 수직선 & tick이 왼쪽을 향해야 하므로 axisLeft 사용
      // 0, 0에서 생성한 채로 둬도 되므로 transform, translate 사용 안함

      //////////////////////////////////////////////////////////
      // Color scale: give me a specie name, I return a color //
      //////////////////////////////////////////////////////////
      // scaleOrdinal 사용시 타입 주의하기 !!
      const color = d3
        .scaleOrdinal<string>() // color 함수 사용 시에는 타입 에러 방지를 위해 제네릭
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#440154ff", "#21908dff", "#fde725ff"]);

      //////////////
      // Add dots //
      //////////////
      // [ selectAll - data - join ]
      // 데이터 등록(첫 호출)을 통한 요소들의 삽입과 데이터 업데이트(두번째 호출부터)를 통한 요소들의 수정을 겸함
      // selectAll : 업데이트 대상 식별
      // data - json : data에 등록된 배열요소를 전부 circle로 만들기
      svg
        .append("g") // svg(container)에 그룹(g)을 추가
        .selectAll("dot") // "dot"이라는 selector를 전부 선택
        .data(data)
        // 데이터 등록 (두번째 인자로 key 전달, 없으면 index 기준 업데이트)
        // Iterable(배열 등) 타입의 변수를 인자로 받음
        .join("circle") // 등록한 배열의 length만큼 circle 요소 생성
        /* 
          selectAll("dot")은 "dot"이라는 selector를 전부 선택함
          dot은 존재하지 않으므로 빈 배열이 반환됨
          circle을 인자로 넣었다면 처음에는, 업데이트가 아닌 삽입으로 빈 배열이 반환되지만
          두번째 호출부터는 변수 svg의 자식으로 있는 circle들을 전부 반환함
        */

        // 속성 설정
        .attr("cx", function (d) {
          // .attr() : 속성 설정
          return x(+d.Sepal_Length);
        })
        .attr("cy", function (d) {
          return y(+d.Petal_Length);
        })
        .attr("r", 5)

        // css 설정
        .style("fill", function (d) {
          // .style() : css 설정
          return color(d.Species);
        });
    });
  };

  // jsx에 만든 svg를 useRef를 통해 그 svg DOM 객체를 svgRef에 할당
  return <svg ref={svgRef}></svg>;
};
