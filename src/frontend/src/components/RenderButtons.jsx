import React, { useEffect, useState } from "react";
import { formatLabel } from "../utils/format";

// The Buttons component is responsible for rendering input fields for updating button styles.
// It displays a preview of the old button and provides inputs for the user to enter new style attributes.
// This component handles differences between "email" and "microsite" types.
function Buttons({ category, data, handleChange, type }) {
  const [outerButtonBorders, setOuterButtonBorders] = useState({}); // To manage the separate border fields for "email".

  // Ensure we reset the border states when switching between "microsite" and "email"
  useEffect(() => {
    setOuterButtonBorders({});
  }, [type]);

  if (!data) return null;

  // Sync the background-color value to background automatically (for both microsite and email)
  useEffect(() => {
    Object.keys(data).forEach((key) => {
      const buttonData = data[key] || {};

      // For microsite, ensure background and background-color are synced
      if (type === "microsite" && buttonData?.newButton?.['background-color']) {
        buttonData.newButton.background = buttonData.newButton['background-color'];
      }

      // For email, sync background-color for both inner and outer buttons
      if (type === "email") {
        const backgroundColor =
          buttonData?.newInnerButton?.['background-color'] || buttonData?.newOuterButton?.['background-color'];
        if (backgroundColor) {
          buttonData.newInnerButton['background-color'] = backgroundColor;
          buttonData.newOuterButton['background-color'] = backgroundColor;
        }
      }
    });
  }, [data, type]);

  // Function to handle outer button border input changes (split into 3 parts for "email" only)
  const handleOuterButtonBorderChange = (key, attr, value) => {
    setOuterButtonBorders((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        [attr]: value,
      },
    }));

    // Combine the separate border fields into a full border value and update the newOuterButton.border for "email"
    const { 'border-width': borderWidth, 'border-style': borderStyle, 'border-color': borderColor } = {
      ...outerButtonBorders[key],
      [attr]: value,
    };

    const fullBorder = `${borderWidth || ""} ${borderStyle || ""} ${borderColor || ""}`.trim();
    handleChange({ target: { value: fullBorder } }, category, key, "newOuterButton.border");
  };

  // Function to render the background-color input for microsite
  const renderMicrositeBackgroundColorInput = (key, buttonData) => {
    const backgroundColor = buttonData?.newButton?.['background-color'] || "";

    return (
      <div className="input-group">
        <label>
          {formatLabel("background-color")}
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => {
              const value = e.target.value;
              handleChange({ target: { value } }, category, key, "newButton.background-color"); // Update microsite button
            }}
          />
        </label>
      </div>
    );
  };

  // Function to render the background-color input for email (inner and outer buttons)
  const renderEmailBackgroundColorInput = (key, buttonData) => {
    const backgroundColor =
      buttonData?.newInnerButton?.['background-color'] || buttonData?.newOuterButton?.['background-color'] || "";

    return (
      <div className="input-group">
        <label>
          {formatLabel("background-color")}
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => {
              const value = e.target.value;
              handleChange({ target: { value } }, category, key, "newInnerButton.background-color"); // Update inner button
              handleChange({ target: { value } }, category, key, "newOuterButton.background-color"); // Update outer button
            }}
          />
        </label>
      </div>
    );
  };

  // Iterate over each key in the data object.
  return Object.keys(data).map((key) => {
    // Get the button data for this key.
    const buttonData = data[key] || {};

    // Microsite buttons: old and newButton styles.
    const oldButton = type === "microsite" ? buttonData.oldButton : buttonData.outerButton;
    const newButton = type === "microsite" ? buttonData.newButton : buttonData.newOuterButton;

    // Email-specific inner buttons.
    const innerOldButton = type === "email" ? buttonData.innerButton : {};
    const innerNewButton = type === "email" ? buttonData.newInnerButton : {};

    // Filter out only the relevant inputs to show for both "microsite" and "email"
    const inputsToShow = ["border-radius", "border-color", "color", "font-family"];

    // Render the button editing interface for this key.
    return (
      <div key={key} id="individual-button">
        {/* Display a preview of the old button. */}
        <div className="button-preview">
          {type === "email" ? (
            // For "email" type, render both outer and inner button styles.
            <div style={{ ...oldButton, padding: "10px 20px" }}>
              <div style={{ ...innerOldButton }}>Sample Button</div>
            </div>
          ) : (
            // For "microsite" type, render the old button style.
            <div style={{ ...oldButton, padding: "10px 20px" }}>
              Sample Button
            </div>
          )}
        </div>

        {/* Container for the input fields to edit button styles. */}
        <div id="button-encasing">
          <div className="input-group-container">
            {/* Render background-color input for microsite */}
            {type === "microsite" && renderMicrositeBackgroundColorInput(key, buttonData)}

            {/* Render merged background-color input for both inner and outer buttons (for email only) */}
            {type === "email" && renderEmailBackgroundColorInput(key, buttonData)}

            {/* Show relevant inputs for outer/microsite buttons (without titles for inner/outer button) */}
            {Object.keys(newButton || {})
              .filter((attr) => inputsToShow.includes(attr) && attr !== "border")
              .map((attr) => (
                <div key={`${key}-${attr}`} className="input-group">
                  <label>
                    {formatLabel(attr)}
                    <input
                      type="text"
                      value={newButton[attr] || ""} // Set the input's value.
                      onChange={(e) =>
                        handleChange(
                          e,
                          category,
                          key,
                          type === "email" ? `newOuterButton.${attr}` : `newButton.${attr}` // Handle microsite and email types.
                        )
                      }
                    />
                  </label>
                </div>
              ))}

            {/* Special handling for outer button border (only for email type) */}
            {type === "email" && (
              <div className="input-group-container">
                {/* Border Width */}
                <div className="input-group">
                  <label>
                    {formatLabel("border-width")}
                    <input
                      type="text"
                      value={outerButtonBorders[key]?.["border-width"] || ""} // Set the input's value.
                      onChange={(e) => handleOuterButtonBorderChange(key, "border-width", e.target.value)} // Update border width
                    />
                  </label>
                </div>
                {/* Border Style */}
                <div className="input-group">
                  <label>
                    {formatLabel("border-style")}
                    <input
                      type="text"
                      value={outerButtonBorders[key]?.["border-style"] || ""} // Set the input's value.
                      onChange={(e) => handleOuterButtonBorderChange(key, "border-style", e.target.value)} // Update border style
                    />
                  </label>
                </div>
                {/* Border Color */}
                <div className="input-group">
                  <label>
                    {formatLabel("border-color")}
                    <input
                      type="text"
                      value={outerButtonBorders[key]?.["border-color"] || ""} // Set the input's value.
                      onChange={(e) => handleOuterButtonBorderChange(key, "border-color", e.target.value)} // Update border color
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });
}

export default React.memo(Buttons);
