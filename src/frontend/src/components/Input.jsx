import "../css/body.css";
import React, { useState, useEffect } from "react";
import {
  getMappingData,
  updateMappingData,
  makeSwap,
  createZipOrCopy,
} from "../services/api";
import { formatLabel } from "../utils/format";

const categoryTitles = {
  links: "Links",
  backgroundColors: "Background Colours",
  fontFamily: "Font Family",
  fontColor: "Font Colour",
  fontSize: "Font Size",
  images: "Images",
  buttons: "Buttons",
  allButtons: "All Buttons",
  backgroundImg: "Main Images",
};

function Input({ type, company }) {
  const [mappingData, setMappingData] = useState(null);

  useEffect(() => {
    getMappingData(type, company).then((response) => {
      setMappingData(response.data);
    });
  }, [type, company]);

  const handleChange = (e, category, key, subKey = null) => {
    const { value } = e.target;
    const newMappingData = { ...mappingData };

    if (subKey) {
      const keys = subKey.split(".");
      if (keys.length === 2) {
        newMappingData[category][key][keys[0]][keys[1]] = value;
      } else {
        newMappingData[category][key][subKey] = value;
      }
    } else {
      newMappingData[category][key] = value;
    }
    setMappingData(newMappingData);
    console.log(mappingData);
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

  const handleDownload = async () => {
    try {
      const res = await createZipOrCopy(type, company);
      if (type === "microsite") {
        const text = await res.data;
        await navigator.clipboard.writeText(text);
        alert("Microsite Template copied to clipboard");
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${company}.zip`);
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      console.error("Error creating zip file:", err);
    }
  };

  if (!mappingData) {
    return <div>..loading</div>;
  }

  return (
    <div id="input-body">
      <form>
        {Object.keys(mappingData).map((category) => {
          const title = categoryTitles[category] || category;

          return (
            <div key={category}>
              <h2>{title}</h2>
              {category === "allButtons"
                ? Object.keys(mappingData[category]).map((attr) => (
                    <div key={attr}>
                      <label>
                        {formatLabel(attr)}
                        <input
                          type="text"
                          value={mappingData[category][attr] || ""}
                          onChange={(e) => handleChange(e, category, attr)}
                        />
                      </label>
                    </div>
                  ))
                : category === "buttons"
                ? Object.keys(mappingData[category]).map((key) => (
                    <div key={key}>
                      <h3>{formatLabel(key)}</h3>
                      {Object.keys(mappingData[category][key]).map((attr) =>
                        typeof mappingData[category][key][attr] === "object" &&
                        attr.includes("new") ? (
                          Object.keys(mappingData[category][key][attr]).map(
                            (subAttr) => (
                              <div key={`${key}-${attr}-${subAttr}`}>
                                <label>
                                  {formatLabel(subAttr)}
                                  <input
                                    type="text"
                                    value={
                                      mappingData[category][key][attr][
                                        subAttr
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        category,
                                        key,
                                        `${attr}.${subAttr}`
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            )
                          )
                        ) : attr.includes("new") ? (
                          <div key={`${key}-${attr}`}>
                            <label>
                              {formatLabel(attr)}
                              <input
                                type="text"
                                value={mappingData[category][key][attr] || ""}
                                onChange={(e) =>
                                  handleChange(e, category, key, attr)
                                }
                              />
                            </label>
                          </div>
                        ) : null
                      )}
                    </div>
                  ))
                : Object.keys(mappingData[category]).map((key) => {
                  const newValuesKey = Object.keys(
                    mappingData[category][key]
                  )[1];
                    return (
                      <div key={key}>
                        <label>
                          {formatLabel(key)}
                          <input
                            type="text"
                            value={mappingData[category][key][newValuesKey] || ""}
                            onChange={(e) => handleChange(e, category, key, newValuesKey)}
                          />
                        </label>
                      </div>
                    );
                  })}
            </div>
          );
        })}
      </form>
      <button type="button" onClick={handleUpdate}>
        Submit
      </button>
      <button type="button" onClick={handleDownload}>
        Copy/Download Zip
      </button>
    </div>
  );
}

export default Input;
