import { USAMap } from "./USAMap"
import { BarPlot } from "./barPlot"

export const MCV = () => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <USAMap></USAMap>
        <BarPlot xKey={"Wildlife Size"}></BarPlot>
      </div>
    </>
  )
}

