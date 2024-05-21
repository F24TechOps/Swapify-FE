import "../css/body.css";
import React, { useState, useEffect } from "react";
import {
  getMappingData,
  createMappingData,
  updateMappingData,
  makeSwap,
  createZip,
} from "../services/api";

function Input({ type, company }) {
  const [mappingData, setMappingData] = useState(null);

  useEffect(() => {
    getMappingData(type, company).then((response) => {
      setMappingData(response.data);
    });
  }, [type, company]);

  const handleChange = (e, category, key) => {
    const newMappingData = { ...mappingData };
    const newValues = Object.keys(newMappingData[category][key])[1];
    newMappingData[category][key][newValues] = e.target.value;
    setMappingData(newMappingData);
  };

  const handleUpdate = async () => {
    try {
      await updateMappingData(type, company, mappingData);
      await makeSwap(type, company, mappingData).then((res) => {
        console.log(res.data);
      });
      console.log(mappingData);
      location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    createZip(type, company)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${company}.zip`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.error("Error creating zip file:", err);
      });
  };

  if (!mappingData) {
    return <div>...loading</div>;
  }

  return (
    <div id="input-body">
      <form>
        {Object.keys(mappingData).map((category) => (
          <div key={category}>
            <h3>{category}</h3>
            {Object.keys(mappingData[category]).map((key) => {
              const newValues = Object.keys(mappingData[category][key])[1];
              return (
                <div key={key}>
                  <label>
                    {key}
                    <input
                      type="text"
                      value={mappingData[category][key][newValues] || ""}
                      onChange={(e) => handleChange(e, category, key)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </form>
      <button onClick={handleUpdate}>Submit</button>
      <button onClick={handleDownload}>Copy/Download Zip</button>
    </div>
  );
}

export default Input;
