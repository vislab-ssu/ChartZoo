import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import * as topojson from "topojson-client";
import { BirdStike as BirdStikes, DataContext } from "../../Context";
import USATopo from "../../assets/USA.json";

// 목표 : 주(state)를 클릭하면 테두리를 highlight 하고 setFilterList를 통해
// Origin State 필터 값 변경
export const USAMap = () => {
  const { source, filteredSource, setFilterList } = useContext(DataContext);
  const containerRef = useRef<SVGGElement>();
  // topology json 파일에서 state(미국 주) 경계 데이터 추출
  const states: d3.ExtendedFeature[] = topojson.feature(
    USATopo,
    USATopo.objects.states
  ).features;
  const width = 1200;
  const height = 800;
  const opacity = useMemo(() => d3.scaleLinear([0.2, 1]).unknown(0), []);

  useEffect(() => {
    render();
  }, []);

  useEffect(() => {
    update(filteredSource);
  }, [filteredSource]);

  const render = () => {
    const path = d3.geoPath();

    d3.select(containerRef.current)
      .selectAll("path")
      .data(states)
      .join("path")
      .attr("class", "state")
      .attr("fill", "darkred")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "lightgray")
      .attr("stroke-width", 1)
      .attr("cursor", "pointer")
      .attr("d", (d) => path(d))
      .on("click", function (e: MouseEvent, d: any) {
        // 테두리 highlight 로직 및 setFilterList 로직 작성
        setFilterList((prevFilterList) => {
          const has = prevFilterList["Origin State"].has(d.properties.name);
          if (has) {
            prevFilterList["Origin State"].delete(d.properties.name);
          } else {
            prevFilterList["Origin State"].add(d.properties.name);
          }
          d3.select(this).attr("stroke", has ? "lightgray" : "red");
          return { ...prevFilterList };
        });
      })
      .append("title")
      .text((d) => `${d.properties.name}\n`);
  };

  const update = (filteredSource: BirdStikes) => {
    // reduce로 값 개수 추출
    const numberOfStates = filteredSource.reduce((acc, val) => {
      if (!acc[val["Origin State"]]) acc[val["Origin State"]] = 0; 
      acc[val["Origin State"]]++;
      return acc;
    }, {});
    // title에 추가정보(개수) 표시
    d3.select(containerRef.current)
      .selectAll("path")
      .selectAll("title")
      .text((d: any) => `${d.properties.name}\n ${numberOfStates[d.properties.name]}`)
    console.log({numberOfStates});
    // opacity(scaleLinear)의 domain 값 설정
    const extent = d3.extent(Object.keys(numberOfStates).map(state => numberOfStates[state]));
    opacity.domain(extent);
    // 지도 색상 업데이트, 이 코드는 건드리지 않아도 됨
    d3.select(containerRef.current)
      .selectAll("path")
      .attr("fill-opacity", (d: (typeof states)[0]) =>
        opacity(+numberOfStates[d.properties.name])
      );
  };

  return (
    <svg
      width={width / 2}
      height={height / 2}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g transform="translate(100, 100)" ref={containerRef}></g>
    </svg>
  );
};
