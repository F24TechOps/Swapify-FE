import React from "react";
import { formatLabel } from "../utils/format";

// The AllButtons component is responsible for rendering input fields for updating button styles in both "email" and "microsite" types.
// It handles input data differently depending on whether the type is "email" or "microsite".
// Props:
// - category: The category/type of data being handled (should be "allButtons").
// - data: An object containing button style data.
// - handleChange: A function to handle changes in the input fields.
// - type: The type of template being edited (either "email" or "microsite").
function AllButtons({ category, data, handleChange, type }) {
  // If no data is provided, don't render anything.
  if (!data) return null;

  // For the "email" type:
  // Render multiple buttons with their corresponding input fields.
  if (type === "email") {
    return Object.keys(data).map((key) => (
      <div key={key} id="all-buttons">
        {/* Container that wraps the input fields for each button */}
        <div id="button-encasing">
          {/* Display the title of each button (formatted key) */}
          <div className="input-title">{formatLabel(key)}</div>
          
          {/* Container for the input fields of each attribute of the button */}
          <div className="input-group-container">
            {/* Ensure that there is data for this button and iterate over the button's attributes */}
            {data[key] &&
              Object.keys(data[key] || {}).map((attr) => (
                <div key={`${key}-${attr}`} className="input-group">
                  <label>
                    {/* Format the attribute label (e.g., convert "backgroundColor" to "Background Color") */}
                    {formatLabel(attr)}
                    {/* Input field for the new value of the attribute */}
                    <input
                      type="text"
                      value={data[key][attr] || ""} // Set the input's value to the current value of the attribute or an empty string if undefined.
                      onChange={(e) => handleChange(e, category, key, attr)} // Call handleChange when the input value changes, passing relevant data.
                    />
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
    ));
  } 
  // For the "microsite" type:
  // Render one set of inputs that apply to all buttons together.
  else if (type === "microsite") {
    return (
      <div key={category} id="all-buttons">
        {/* Container for all input fields */}
        <div id="button-encasing">
          <div className="input-group-container">
            {/* Iterate over the attributes of the buttons */}
            {Object.keys(data).map((attr) => (
              <div key={attr} className="input-group">
                <label>
                  {/* Format the attribute label */}
                  {formatLabel(attr)}
                  {/* Input field for the new value of the attribute */}
                  <input
                    type="text"
                    value={data[attr] || ""} // Set the input's value to the current value of the attribute or an empty string if undefined.
                    onChange={(e) => handleChange(e, category, attr)} // Call handleChange when the input value changes, passing the relevant data.
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// Use React.memo to optimize performance by preventing unnecessary re-renders.
// React.memo will skip rendering if the props haven't changed.
export default React.memo(AllButtons);
