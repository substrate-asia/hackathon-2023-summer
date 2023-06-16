import React,{useState,useEffect} from 'react';
import { memo } from 'react';
import type { FC } from 'react';
import { useLocation } from 'react-router-dom';


import classes from './App.module.css';
import resets from './components/runmodel/_resets.module.css';
import { RunningModel } from './components/runmodel/RunningModel/RunningModel';
import ReadFromFirestore from './firebaseFunctions/ReadFromFirestore';


function useModel() {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await ReadFromFirestore('models', id);
      setData(response);
      console.log(response);
    }
    fetchData();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <RunningModel
        modelName={data.title}
        modelDescription={data.description}
        modelId={data.model_id}
        modelcreatedtime={data.created_time}
      />
    </div>
  );
}

export default useModel;