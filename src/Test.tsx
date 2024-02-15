import { useContext } from "react";
import { DataContext } from "./Context";

export const Test = () => {
  const { data, setData } = useContext(DataContext);
  console.log(data);
  return (
    <div>
      <button onClick={() => setData(data + 1)}>up</button>
    </div>
  );
};
