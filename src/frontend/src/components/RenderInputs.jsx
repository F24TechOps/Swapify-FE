import React from "react";
import { isLightColor } from "../utils/fontColor";

// The InputFields component is responsible for rendering input fields based on the provided category and data.
// It displays the old attribute value (like color, font, image, etc.) and provides an input for the new attribute value.
// Props:
// - category: The category/type of data being handled (e.g., "backgroundColors", "fontFamily", "images").
// - data: An object containing key-value pairs of old and new attribute values.
// - handleChange: A function to handle changes in the input fields.
// - type: The type of template, e.g., "microsite" or "email".
function InputFields({ category, data, handleChange, type }) {
  // If the category is fontSize, return null and do not render anything for this category
  if (category === "fontSize") return null;

  if (!data) return null;

  // If the category is images, limit the number of images rendered based on the type
  let dataKeys = Object.keys(data);

  if (category === "images") {
    // Show only the first 3 images for microsite, and the first 5 for email
    dataKeys = type === "microsite" ? dataKeys.slice(0, 3) : dataKeys.slice(0, 5);
  }

  // Iterate over each key in the data object.
  return dataKeys.map((key) => {
    if (!data[key]) return null;

    // Extract the keys from the nested data object for this key.
    const keys = Object.keys(data[key] || {});

    // If there are less than two keys (old and new values), skip rendering for this key.
    if (keys.length < 2) return null;

    // Assume that the first key is the old value and the second key is the new value.
    const valueKey = keys[1];      // Key for the new attribute value (e.g., "newValue").
    const oldValuesKey = keys[0];  // Key for the old attribute value (e.g., "oldValue").

    // Get the old font color if it exists.
    const oldFontColor = data[key][oldValuesKey];

    // Determine if the old font color is light or dark using the isLightColor utility function.
    const isLight = oldFontColor ? isLightColor(oldFontColor) : false;

    // Set the background color based on the lightness of the font color to ensure text is readable.
    const backgroundColor = isLight ? "#000000" : "#ffffff";

    // Render the input group for this key.
    return (
      <div key={key} className="input-group">
        <label>
          {/* Display the old attribute value in a way that's appropriate for its category. */}
          <div className="old-attribute" style={{ margin: 0 }}>
            {/* Check the category to determine how to display the old attribute. */}
            {category === "backgroundColors" ? (
              // For background colors, display a colored rectangle.
              <div
                style={{
                  width: "200px",
                  height: "40px",
                  backgroundColor: data[key][oldValuesKey], // Set background to old color.
                  borderRadius: "10px 10px 0 0",
                  border: "1px solid #000",
                }}
              ></div>
            ) : category === "fontFamily" ? (
              // For font families, display text styled with the old font.
              <div style={{ fontFamily: data[key][oldValuesKey] }}>
                {data[key][oldValuesKey]} {/* Display the name of the old font family. */}
              </div>
            ) : category === "fontColor" ? (
              // For font colors, display a text sample in the old color with contrasting background.
              <div
                style={{
                  color: data[key][oldValuesKey],       // Set text color to old font color.
                  backgroundColor: backgroundColor,     // Set background for contrast.
                  padding: "5px",
                  border: "1px solid #000",
                  width: "310px",
                  borderRadius: "10px 10px 0 0",
                }}
              >
                {`The colour of this text is ${data[key][oldValuesKey]}`} {/* Informative text. */}
              </div>
            ) : category === "images" || category === "backgroundImg" ? (
              // For images, display the old image.
              <img
                src={data[key][oldValuesKey]} // Source URL of the old image.
                alt="Old attribute"
                style={{ width: "100px", height: "auto" }}
              />
            ) : (
              // For any other category, just display the old attribute value as plain text.
              data[key][oldValuesKey]
            )}
          </div>
          {/* Render the input field for the new attribute value. */}
          <input
            type="text"
            value={data[key][valueKey] || ""} // Set the input's value to the new attribute value or empty string if undefined.
            placeholder="New Attribute"        // Placeholder text when the input is empty.
            onChange={(e) => handleChange(e, category, key, valueKey)} // Call handleChange when the input value changes.
            style={{ margin: 0 }}
          />
        </label>
      </div>
    );
  });
}

// Export the component using React.memo to optimize performance by preventing unnecessary re-renders.
// React.memo will skip rendering if the props haven't changed.
export default React.memo(InputFields);
