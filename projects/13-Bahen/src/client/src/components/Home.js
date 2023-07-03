import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
const Home = () => {
  return (
    <div className="home-container">
      <h2 style={{ fontSize: 60, fontWeight: 'bold', maxWidth: 950 }}>
        Embrace decentralized computing for AI development.
      </h2>
      <p style={{ fontSize: 20, maxWidth: 660, marginTop: 36 }}>
        Introducing BAHEN Network, the pioneering decentralized platform
        revolutionizing AI training and dataset transactions.
      </p>
    </div>
  );
};

export default Home;
