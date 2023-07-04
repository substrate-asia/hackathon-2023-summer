import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWorkerList, getWorkerInfo} from '../services/marketplaceService';
import styles from '../styles/WorkerLists.module.css'; 

const UserOrders = () => {
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkerInfos = async () => {
      try {
        var workerAddresss = await getWorkerList();
        const workerDetailsPromises = workerAddresss.map((workerAddress) => getWorkerInfo(workerAddress));
        const workers = await Promise.all(workerDetailsPromises);
        setWorkers(workers);
      } catch (error) {
        console.error("Error fetching worker list:", error);
      }
    };
    fetchWorkerInfos();
  });

  return (
    <div className={styles.container}>
      <h2>Worker Lists</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Index</th>
            <th>Worker ID</th>
            <th>Computing Power</th>
            <th>Have Task</th>
            <th>IsActivate</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{worker.workerId}</td>
              <td>{worker.computingPower}</td>
              <td>{worker.isBusy}</td>
              <td>{worker.isActivate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.navigation}>
        <Link to="/">
          <button>Back to Home</button>
    </Link>
  </div>
</div>
);
};

export default UserOrders;
