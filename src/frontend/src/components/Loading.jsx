import React from "react";
import "../css/body.css";

function Loading() {
  return (
    <div className="wrapper">
      <svg>
        <text x="50%" y="50%" dy=".35em" textAnchor="middle">
          SWAP
        </text>
      </svg>
    </div>
  );
}

export default Loading;
