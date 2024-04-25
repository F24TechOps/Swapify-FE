import "../css/body.css";
import React, { useEffect, useState } from "react";

const Input = () => {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    fetch("../.env/force/microsite/json/mapping.json")
      .then((response) => response.json())
      .then((data) => setJsonData(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div id="input-body">
        <h2>Brand Guidelines Form</h2>
        <form action="">
          <div>
            <label htmlFor="">Background Colour</label>
            <input type="text" />
          </div>
        </form>
        {jsonData ? <p>{JSON.stringify(jsonData)}</p> : null}
      </div>
    </>
  );
};

export default Input;
