import React from "react";
import { formatLabel } from "../utils/format";

// The Buttons component is responsible for rendering input fields for updating button styles.
// It displays a preview of the old button and provides inputs for the user to enter new style attributes.
// This component handles differences between "email" and "microsite" types.
// Props:
// - category: The category/type of data being handled (should be "buttons").
// - data: An object containing button data to be displayed and edited.
// - handleChange: A function to handle changes in the input fields.
// - type: The type of template being edited (e.g., "email" or "microsite").
function Buttons({ category, data, handleChange, type }) {
  if (!data) return null;

  // Iterate over each key in the data object.
  return Object.keys(data).map((key) => {
    // Get the button data for this key, or an empty object if none exists.
    const buttonData = data[key] || {};

    // Determine the old and new button styles based on the type.
    const oldButton =
      type === "microsite" ? buttonData.oldButton : buttonData.outerButton;
    const newButton =
      type === "microsite" ? buttonData.newButton : buttonData.newOuterButton;

    // For "email" type, also get inner button styles.
    const innerOldButton = type === "email" ? buttonData.innerButton : {};
    const innerNewButton = type === "email" ? buttonData.newInnerButton : {};

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
          {/* For "email" type, render inputs for inner button styles. */}
          {type === "email" && (
            <>
              {/* Title for the inner button inputs. */}
              <div className="input-title">Inner Button</div>
              {/* Container for the inner button input fields. */}
              <div className="input-group-container">
                {/* Iterate over each attribute in the innerNewButton object. */}
                {Object.keys(innerNewButton || {}).map((attr) => (
                  <div key={`${key}-inner-${attr}`} className="input-group">
                    <label>
                      {/* Format the attribute label (e.g., convert "backgroundColor" to "Background Color"). */}
                      {formatLabel(attr)}
                      {/* Input field for the new value of the attribute. */}
                      <input
                        type="text"
                        value={innerNewButton[attr] || ""} // Set the input's value.
                        onChange={(e) =>
                          handleChange(
                            e,
                            category,
                            key,
                            `newInnerButton.${attr}` // Specify the path to the attribute in the data object.
                          )
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
              {/* Title for the outer button inputs. */}
              <div className="input-title">Outer Button</div>
            </>
          )}

          {/* Container for the outer button (or microsite button) input fields. */}
          <div className="input-group-container">
            {/* Iterate over each attribute in the newButton object. */}
            {Object.keys(newButton || {}).map((attr) => (
              <div key={`${key}-${attr}`} className="input-group">
                <label>
                  {/* Format the attribute label. */}
                  {formatLabel(attr)}
                  {/* Input field for the new value of the attribute. */}
                  <input
                    type="text"
                    value={newButton[attr] || ""} // Set the input's value.
                    onChange={(e) =>
                      handleChange(
                        e,
                        category,
                        key,
                        type === "email"
                          ? `newOuterButton.${attr}` // For "email", specify newOuterButton path.
                          : `newButton.${attr}`       // For "microsite", specify newButton path.
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });
}

// Export the component using React.memo to optimize performance by preventing unnecessary re-renders.
// React.memo will skip rendering if the props haven't changed.
export default React.memo(Buttons);
