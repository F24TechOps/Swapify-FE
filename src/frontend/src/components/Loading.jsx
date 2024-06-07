import React from 'react';
import '../css/body.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
}

export default Loading;
