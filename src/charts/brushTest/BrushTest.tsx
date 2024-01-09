import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function BubblePlot() {
  const svgRef = useRef<SVGSVGElement>();
  const containerRef =
    useRef<d3.Selection<SVGGElement, unknown, null, undefined>>();
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    render();
  }, []);

  const render = () => {
    const margin = { left: 10, right: 10 };
    const width = 600 - margin.left - margin.right;
    const height = 400;
    const history = [[0, 100]];
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height);
    if (!containerRef.current) {
      containerRef.current = svg
        .append("g")
        .attr("class", "container")
        .attr("transform", `translate(${margin.left}, 0)`);
    }

    // 랜덤 데이터 생성
    const data = Array.from(
      { length: 20 },
      () => +(Math.random() * 100).toFixed(0)
    );
    console.log({ data });

    // x축 함수 정의
    const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
    // x축을 삽입할 위치
    containerRef.current
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0,220)`);

    // brush 함수 정의
    const brush = d3
      .brushX()
      .extent([
        [0, 150],
        [width, 250],
      ])
      .on("end", brushing);
    // brush함수를 적용할 위치에 호출
    const brushElement = containerRef.current.call(brush);

    function brushing(e: d3.D3BrushEvent<number>) {
      if (!e.sourceEvent) return; // brushElement.call(brush.clear); 을 위한 방어코드, 없을 경우 무한 루프에 빠짐
      if (!e.selection) {
        // 더블클릭시 e.selection은 null, 확대 초기화 진행
        x.domain([0, 100]);
        update();
        return;
      }
      // 범위를 값으로 변환하기(range -> domain)
      const newDomain = e.selection.map((val) => x.invert(val));
      x.domain(newDomain);
      console.log(
        `selection: [${e.selection}] => invert: [${newDomain.map((n) =>
          n.toFixed(2)
        )}]`
      );
      update();

      // brush기록 저장
      history.push(newDomain);
      d3.select(divRef.current)
        .selectAll("button")
        .data(history)
        .join("button")
        .text((d, i) => i)
        .on("click", (e, d) => (x.domain(d), update()));

      brushElement.call(brush.clear); // 이 라인을 실행하면 brushing 함수를 호출하는데, 이 때 sourceEvent는 undefined임
    }

    const update = () => {
      // x축 삽입할 위치에 호출
      containerRef.current
        .select(".xAxis")
        .transition()
        .duration(500)
        .call(d3.axisBottom(x) as any);

      containerRef.current
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("id", (d) => d)
        .attr("r", 10)
        .attr("fill", "#69a3b2")
        .attr("cy", 200)
        .transition()
        .duration(500)
        .attr("cx", (d) => x(d));
    };
    update();
  };

  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={divRef}></div>
    </>
  );
}
