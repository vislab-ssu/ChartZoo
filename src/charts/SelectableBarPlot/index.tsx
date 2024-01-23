import { useCallback, useMemo, useState } from "react"
import { SelectableBarPlot } from "./ClickBarPlot"
import { BrushBarPlot } from "./BrushBarPlot";

export const Workspace = () => {
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const [mode, setMode] = useState<'click' | 'brush'>('click');
    // setState(setSelectedList, setMode)할 때 마다 새로 barplot을 만들어내기 때문에 
    // useCallback으로 mode가 바뀔때만 다시 만들도록 캐싱
    const BarPlot = useCallback(() => {
        if (mode == 'click') return <SelectableBarPlot setSelectedList={setSelectedList}></SelectableBarPlot>;
        else if (mode == 'brush') return <BrushBarPlot setSelectedList={setSelectedList}></BrushBarPlot>;
    }, [mode]); 
    return (
        <>
            <div>
                <button onClick={() => setMode((prev) => prev == 'click' ? 'brush' : 'click')}>change interaction</button>
            </div>
            <BarPlot></BarPlot>
            <p>selected List</p>
            <ul>
                {selectedList.map(v => <li key={v}>{v}</li>)}
            </ul>
        </>
    )
}