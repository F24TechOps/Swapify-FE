import React, { useEffect, useState } from "react";
import { formatLabel } from "../utils/format";

function AllButtons({ category, data, handleChange, type }) {
  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

  if (!data) return null;

  const renderEmailButtons = () => {
    const duplicateEmailAttributes = ["background-color", "border-radius"];

    const outerEmailAttributes = ["border"];

    const innerEmailAttributes = [
      "color",
      "font-family",
      "font-size",
      "font-weight",
    ];

    return (
      <div id="all-buttons">
        <div id="button-encasing">
          <div className="input-group-container">
            {duplicateEmailAttributes.map((attr) => (
              <div key={attr} className="input-group">
                <label>
                  {formatLabel(attr)}
                  <input
                    type="text"
                    value={
                      data.innerButton[attr] !== null &&
                      data.outerButton[attr] !== undefined
                        ? data.innerButton[attr]
                        : data.outerButton[attr] || ""
                    }
                    onChange={(e) =>
                      handleChange(e, category, "outerButton", attr, true)
                    }
                  />
                </label>
              </div>
            ))}

            {outerEmailAttributes.map((attr) => (
              <div key={attr} className="input-group">
                <label>
                  {formatLabel(attr)}
                  <input
                    type="text"
                    value={
                      data.innerButton[attr] !== null &&
                      data.outerButton[attr] !== undefined
                        ? data.outerButton[attr]
                        : ""
                    }
                    onChange={(e) =>
                      handleChange(e, category, "outerButton", attr, true)
                    }
                  />
                </label>
              </div>
            ))}

            {innerEmailAttributes.map((attr) => (
              <div key={attr} className="input-group">
                <label>
                  {formatLabel(attr)}
                  <input
                    type="text"
                    value={
                      data.innerButton[attr]
                    }
                    onChange={(e) =>
                      handleChange(e, category, "innerButton", attr)
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render for microsite type
  const renderMicrositeButtons = () => {
    const micrositeAttributesToShow = [
      "background-color",
      "border-radius",
      "border-color",
      "color",
      "font-family",
    ];

    // Handle the microsite attributes
    return (
      <div id="all-buttons">
        <div id="button-encasing">
          <div className="input-group-container">
            {micrositeAttributesToShow.map((attr) => (
              <div key={attr} className="input-group">
                <label>
                  {formatLabel(attr)}
                  <input
                    type="text"
                    value={data[attr] || ""}
                    onChange={(e) => handleChange(e, category, attr)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main render logic: choose based on type
  return (
    <div id="all-buttons-container">
      {type === "email" ? renderEmailButtons() : renderMicrositeButtons()}
    </div>
  );
}

export default React.memo(AllButtons);
