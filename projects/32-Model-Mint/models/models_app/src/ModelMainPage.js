import React,{ useState } from "react";
import NewModel from "./Newmodel";
import Grid from "./grid";

function ModelMainPage()
{
    const [addFunc, setaddFun] = useState();

  const handleDataChange = (func) => {
    setaddFun(func);
  };

    return(
        <div>
        <NewModel func ={addFunc}/>
        <Grid onNewModel={handleDataChange}/>
        </div>

    )
}

export default ModelMainPage;
