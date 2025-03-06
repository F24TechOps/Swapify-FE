import "../css/body.css";
import React, { useState, useEffect, useCallback } from "react";
import {
  getMappingData,
  updateMappingData,
  createMappingData,
  makeSwap,
  createZipOrCopy,
  processCircleImage,
  processStarColor,
} from "../services/api";
import { formatLabel } from "../utils/format";
import { isLightColor } from "../utils/fontColor";
import Loading from "./Loading";

const categoryTitles = {
  links: "Links",
  backgroundColors: "Background Colours",
  fontFamily: "Font Family",
  fontColor: "Font Colour",
  fontSize: "Font Size",
  images: "Images",
  buttons: "Buttons",
  allButtons: "All Buttons",
  backgroundImg: "Main Image",
  color: "Colours",
};

function Input({ type, company }) {
  const [mappingData, setMappingData] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [replaceColor, setReplaceColor] = useState("#70C7D5");
  const [loading, setLoading] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [isError, setIsError] = useState('no-error');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await getMappingData(type, company);
        const newData = response.data;

        if (!newData || Object.keys(newData).length === 0) {
          throw new Error("No mapping data found, creating new data.");
        }

        updateMappingState(newData);
      } catch (error) {
        if (error?.response?.status === 404) {
          try {
            await createMappingData(type, company);
            const response = await getMappingData(type, company);
            updateMappingState(response.data);
          } catch (createError) {
            console.error("Error creating new mapping data:", createError);
          }
        } else {
          console.error("Error fetching mapping data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    const updateMappingState = (data) => {
      setMappingData(data);
      setCollapsedSections(
        Object.keys(data).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    };

    fetchData();
  }, [type, company]);


  useEffect(() => {
    if (mappingData) {
      const newImageUrls = Object.keys(mappingData.images || {}).reduce(
        (acc, key) => {
          const newLink = mappingData.images[key]?.newImageLink;
          const oldLink = mappingData.images[key]?.oldImageLink;
          acc[key] = newLink || oldLink;
          return acc;
        },
        {}
      );
      setImageUrls(newImageUrls);
    }
  }, [mappingData]);

  useEffect(() => {
    if (isError === 'error') {
      const input = document.querySelector(".url-input");
      if (input && !document.querySelector('.error-message')) {
        const message = document.createElement('p');
        message.textContent = errorMessage;
        input.insertAdjacentElement('afterend', message);
        input.classList.add("error");
        message.classList.add('error-message');
        setTimeout(() => {
          input.classList.remove("error");
          message.remove();
        }, 5000);
      }
    }
    setIsError('no-error');
  }, [isError]);

  const handleChange = useCallback((e, category, key, subKey = null) => {
    const { value } = e.target;

    setMappingData((prevMappingData) => {
      const newMappingData = { ...prevMappingData };
      if (subKey) {
        const keys = subKey.split(".");
        if (keys.length === 2) {
          if (!newMappingData[category][key][keys[0]]) {
            newMappingData[category][key][keys[0]] = {};
          }
          newMappingData[category][key][keys[0]][keys[1]] = value;
        } else {
          if (!newMappingData[category][key]) {
            newMappingData[category][key] = {};
          }
          newMappingData[category][key][subKey] = value;
        }
      } else {
        if (!newMappingData[category][key]) {
          newMappingData[category][key] = {};
        }
        newMappingData[category][key] = value;
      }
      return newMappingData;
    });
  }, []);

  const handleUpdate = async () => {
    if (type === "templates") {
      if (!/\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(mappingData.images.ImageLink0.newImageLink)) {
        handleError("Please enter a valid image URL");
        throw isError;
      }
    }

    try {
      await updateMappingData(type, company, mappingData);
      if (type === "email" && replaceColor.length > 2) {
        await processStarColor(company, replaceColor, imageUrls);
      } else {
        setReplaceColor("#70C7D5");
        await processStarColor(company, replaceColor, imageUrls);
      }
      if (type === "email" && imageUrls["ImageLink4"]) {
        await processCircleImage(
          company,
          "ImageLink4",
          imageUrls["ImageLink4"]
        );
      }
      await makeSwap(type, company, imageUrls);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setIsError('error');
    }
  };

  const handleDownload = async () => {
    try {
      const res = await createZipOrCopy(type, company, imageUrls, replaceColor);
      if (type === "microsite") {
        const text = await res.data.text();
        await navigator.clipboard.writeText(text);
        alert("Microsite Template copied to clipboard");
      } else if (type === "email" || type === "templates") {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${company}-${type}.zip`);
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      handleError("Please enter a valid URL");
    }
  };

  const handleError = (msg) => {
    setIsError('error');

    setCollapsedSections((prevState) => {
      const updatedSections = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return updatedSections;
    });

    setErrorMessage(msg);
  };

  const toggleCollapse = (category) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const renderInputs = useCallback(
    (category, data = {}) => {
      if (!data) return null;

      return Object.keys(data).map((key) => {
        if (!data[key]) return null;
        const keys = Object.keys(data[key] || {});
        if (keys.length < 2) return null;

        const valueKey = keys[1];
        const oldValuesKey = keys[0];
        const oldFontColor = data[key][oldValuesKey];
        const isLight = oldFontColor ? isLightColor(oldFontColor) : false;
        const backgroundColor = isLight ? "#000000" : "#ffffff";

        return (
          <div key={key} className="input-group">
            <label>
              <div className="old-attribute" style={{ margin: 0 }}>
                {category === "backgroundColors" || category === "color" ? (
                  <div
                    style={{
                      width: "200px",
                      height: "40px",
                      backgroundColor: data[key][oldValuesKey],
                      borderRadius: "10px 10px 0 0",
                      border: "1px solid #000",
                    }}
                  ></div>
                ) : category === "fontFamily" ? (
                  <div style={{ fontFamily: data[key][oldValuesKey] }}>
                    {data[key][oldValuesKey]}
                  </div>
                ) : category === "fontColor" ? (
                  <div
                    style={{
                      color: data[key][oldValuesKey],
                      backgroundColor: backgroundColor,
                      padding: "5px",
                      border: "1px solid #000",
                      width: "310px",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    {`The colour of this text is ${data[key][oldValuesKey]}`}
                  </div>
                ) : category === "fontSize" ? (
                  <div style={{ fontSize: data[key][oldValuesKey] }}>
                    {data[key][oldValuesKey]}
                  </div>
                ) : category === "images" || category === "backgroundImg" ? (
                  <img
                    src={data[key][oldValuesKey]}
                    alt="Old attribute"
                    style={{ width: "100px", height: "auto" }}
                  />
                ) : (
                  data[key][oldValuesKey]
                )}
              </div>
              {category === "backgroundColors" || category === "color" ? (
                <>
                  <input
                    className="color"
                    type="color"
                    value={data[key][valueKey] || ""}
                    placeholder=""
                    onChange={(e) => handleChange(e, category, key, valueKey)}
                    style={{ margin: 0 }}
                  />
                  <input
                    className="reset-button"
                    type="button"
                    value="Reset"
                    onClick={() => {
                      handleChange(
                        { target: { value: "" } },
                        category,
                        key,
                        valueKey
                      );
                    }}
                  />
                </>
              ) : category === "links" ? (
                <input
                  type="url"
                  value={data[key][valueKey] || ""}
                  placeholder="https://www..."
                  onChange={(e) => handleChange(e, category, key, valueKey)}
                  style={{ margin: 0 }}
                />
              ) : category === 'images' ? (
              <input
                type="text"
                value={data[key][valueKey] || ""}
                placeholder="Image URL"
                onChange={(e) => handleChange(e, category, key, valueKey)}
                style={{ margin: 0 }}
                className={`url-input`}
              />
            ) : (
                <input
                  type="text"
                  value={data[key][valueKey] || ""}
                  placeholder="New Attribute"
                  onChange={(e) => handleChange(e, category, key, valueKey)}
                  style={{ margin: 0 }}
                />
              )}
            </label>
          </div>
        );
      });
    },
    [handleChange]
  );

  const renderButtons = useCallback(
    (category, data = {}) => {
      if (!data) return null;
      return Object.keys(data).map((key) => {
        const buttonData = data[key] || {};
        const oldButton =
          type === "microsite" ? buttonData.oldButton : buttonData.outerButton;
        const newButton =
          type === "microsite"
            ? buttonData.newButton
            : buttonData.newOuterButton;
        const innerOldButton = type === "email" ? buttonData.innerButton : {};
        const innerNewButton =
          type === "email" ? buttonData.newInnerButton : {};
        return (
          <div key={key} id="individual-button">
            <div className="button-preview">
              {type === "email" ? (
                <div style={{ ...oldButton, padding: "10px 20px" }}>
                  <div style={{ ...innerOldButton }}>Sample Button</div>
                </div>
              ) : (
                <div style={{ ...oldButton, padding: "10px 20px" }}>
                  Sample Button
                </div>
              )}
            </div>
            <div id="button-encasing">
              {type === "email" && (
                <>
                  <div className="input-title">Inner Button</div>
                  <div className="input-group-container">
                    {Object.keys(innerNewButton || {}).map((attr) => (
                      <div key={`${key}-inner-${attr}`} className="input-group">
                        <label>
                          {formatLabel(attr)}
                          <input
                            type="text"
                            value={innerNewButton[attr] || ""}
                            onChange={(e) =>
                              handleChange(
                                e,
                                category,
                                key,
                                `newInnerButton.${attr}`
                              )
                            }
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="input-title">Outer Button</div>
                </>
              )}
              <div className="input-group-container">
                {Object.keys(newButton || {}).map((attr) => (
                  <div key={`${key}-${attr}`} className="input-group">
                    <label>
                      {formatLabel(attr)}
                      <input
                        type="text"
                        value={newButton[attr] || ""}
                        onChange={(e) =>
                          handleChange(
                            e,
                            category,
                            key,
                            type === "email"
                              ? `newOuterButton.${attr}`
                              : `newButton.${attr}`
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
    },
    [handleChange, type]
  );

  const renderAllButtons = useCallback(
    (category, data = {}) => {
      if (!data) return null;

      if (type === "email") {
        return Object.keys(data).map((key) => (
          <div key={key} id="all-buttons">
            <div id="button-encasing">
              <div className="input-title">{formatLabel(key)}</div>
              <div className="input-group-container">
                {data[key] &&
                  Object.keys(data[key] || {}).map((attr) => (
                    <div key={`${key}-${attr}`} className="input-group">
                      <label>
                        {formatLabel(attr)}
                        <input
                          type="text"
                          value={data[key][attr] || ""}
                          onChange={(e) => handleChange(e, category, key, attr)}
                        />
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ));
      } else if (type === "microsite") {
        return (
          <div key={category} id="all-buttons">
            <div id="button-encasing">
              <div className="input-group-container">
                {Object.keys(data).map((attr) => (
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
      }
    },
    [handleChange, type]
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div id="input-body">
      <form onSubmit={handleUpdate}>
        {mappingData &&
          Object.keys(mappingData).map((category) => (
            <div key={category} id="category">
              <h2
                onClick={() => toggleCollapse(category)}
                style={{ cursor: "pointer" }}
              >
                {categoryTitles[category] || category}
                {collapsedSections[category] ? " +" : " -"}
              </h2>
              {!collapsedSections[category] && (
                <div id="input-section">
                  {category === "buttons"
                    ? renderButtons(category, mappingData[category] || {})
                    : category === "allButtons"
                      ? renderAllButtons(category, mappingData[category] || {})
                      : renderInputs(category, mappingData[category] || {})}
                </div>
              )}
            </div>
          ))}
        {type === "email" && (
          <div className="star-colour">
            <h2>Star Colour</h2>
            <input
              type="text"
              placeholder="Star Color (hex)"
              value={replaceColor}
              onChange={(e) => setReplaceColor(e.target.value)}
            />
          </div>
        )}
        <button type="button" onClick={handleUpdate}>
          Submit
        </button>
      </form>
      <button type="button" onClick={handleDownload}>
        {type === "email" || type === "templates"
          ? "Download Zip"
          : "Copy Code"}
      </button>
    </div>
  );
}

export default Input;
