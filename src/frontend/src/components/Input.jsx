import "../css/body.css";
import React, { useState, useEffect } from "react";
import {
  getMappingData,
  updateMappingData,
  makeSwap,
  createZipOrCopy,
  processCircleImage,
  processStarColor,
} from "../services/api";
import { formatLabel } from "../utils/format";
import { isLightColor } from "../utils/fontColor";

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
  const [imageUrls, setImageUrls] = useState({});
  const [replaceColor, setReplaceColor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMappingData(type, company).then((response) => {
      setMappingData(response.data);
      setLoading(false);
    });
  }, [type, company]);

  useEffect(() => {
    if (mappingData) {
      const newImageUrls = {};
      if (mappingData.images) {
        Object.keys(mappingData.images).forEach((key) => {
          const newLink = mappingData.images[key].newImageLink;
          const oldLink = mappingData.images[key].oldImageLink;
          newImageUrls[key] = newLink ? newLink : oldLink;
        });
      }
      setImageUrls(newImageUrls);
    }
  }, [mappingData]);

  const handleChange = (e, category, key, subKey = null) => {
    const { value } = e.target;
    setMappingData((prevMappingData) => {
      const newMappingData = { ...prevMappingData };

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

      return newMappingData;
    });
  };

  const handleUpdate = async () => {
    try {
      await updateMappingData(type, company, mappingData);

      if (type === "email" && replaceColor) {
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

      location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await createZipOrCopy(type, company, imageUrls, replaceColor);
      if (type === "microsite") {
        const text = await res.data.text();
        await navigator.clipboard.writeText(text);
        alert("Microsite Template copied to clipboard");
      } else if (type === "email") {
        const url = window.URL.createObjectURL(new Blob([res.data]));
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

  if (loading) {
    return <div>..loading</div>;
  }

  return (
    <div id="input-body">
      <button type="button" onClick={handleUpdate}>
        Submit
      </button>
      <form>
        {Object.keys(mappingData).map((category) => {
          const title = categoryTitles[category] || category;

          return (
            <div key={category} id="category">
              <h2>{title}</h2>
              <div id="input-section">
                {category === "allButtons" && type === "email"
                  ? Object.keys(mappingData[category]).map((buttonType) => (
                      <div key={buttonType}>
                        <h3>{formatLabel(buttonType)}</h3>
                        {mappingData[category][buttonType] &&
                          Object.keys(mappingData[category][buttonType]).map(
                            (attr) => (
                              <div
                                key={`${buttonType}-${attr}`}
                                className="input-group"
                              >
                                <label>
                                  {formatLabel(attr)}
                                  <input
                                    type="text"
                                    value={
                                      mappingData[category][buttonType][attr] ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        category,
                                        buttonType,
                                        attr
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            )
                          )}
                      </div>
                    ))
                  : category === "allButtons" && type === "microsite"
                    ? Object.keys(mappingData[category]).map((attr) => (
                        <div key={attr} className="input-group">
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
                      ? Object.keys(mappingData[category]).map((key) => {
                          const innerButton =
                            mappingData[category][key].innerButton || {};
                          const outerButton =
                            mappingData[category][key].outerButton || {};
                          const micrositeButton =
                            mappingData[category][key].oldButton || {};

                          return (
                            <div key={key} id="individual-button">
                              {/* <h3>{formatLabel(key)}</h3> */}
                              <div className="button-preview">
                                {type === "email" ? (
                                  <div
                                    style={{
                                      backgroundColor:
                                        outerButton.background ||
                                        outerButton["background-color"],
                                      borderRadius:
                                        outerButton["border-radius"],
                                      border: outerButton.border,
                                      padding: outerButton.padding,
                                      display: "inline-block",
                                      ...outerButton,
                                    }}
                                  >
                                    <div
                                      style={{
                                        backgroundColor:
                                          innerButton.background ||
                                          innerButton["background-color"],
                                        borderRadius:
                                          innerButton["border-radius"],
                                        border: innerButton.border,
                                        color: innerButton.color,
                                        fontFamily: innerButton["font-family"],
                                        fontSize: innerButton["font-size"],
                                        fontStyle: innerButton["font-style"],
                                        fontWeight: innerButton["font-weight"],
                                        lineHeight: innerButton["line-height"],
                                        textAlign: innerButton["text-align"],
                                        textDecoration:
                                          innerButton["text-decoration"],
                                        display: innerButton.display,
                                        padding: "10px 20px",
                                        ...innerButton,
                                      }}
                                    >
                                      Sample Button
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      backgroundColor:
                                        micrositeButton.background ||
                                        micrositeButton["background-color"],
                                      borderRadius:
                                        micrositeButton["border-radius"],
                                      borderColor:
                                        micrositeButton["border-color"],
                                      borderStyle:
                                        micrositeButton["border-style"],
                                      borderWidth:
                                        micrositeButton["border-width"],
                                      color: micrositeButton.color,
                                      fontFamily:
                                        micrositeButton["font-family"],
                                      fontSize: micrositeButton["font-size"],
                                      fontWeight:
                                        micrositeButton["font-weight"],
                                      padding: "10px 20px",
                                      textAlign: "center",
                                      width:
                                        micrositeButton.width === "auto"
                                          ? "200px"
                                          : '30vw',
                                      whiteSpace:
                                        micrositeButton["white-space"],
                                    }}
                                  >
                                    Sample Button
                                  </div>
                                )}
                              </div>
                              <div id="button-encasing">
                              {Object.keys(mappingData[category][key]).map(
                                (attr) =>
                                  typeof mappingData[category][key][attr] ===
                                    "object" && attr.includes("new") ? (
                                    Object.keys(
                                      mappingData[category][key][attr]
                                    ).map((subAttr) => (
                                      <div
                                        key={`${key}-${attr}-${subAttr}`}
                                        className="input-group"
                                      >
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
                                    ))
                                  ) : attr.includes("new") ? (
                                    <div
                                      key={`${key}-${attr}`}
                                      className="input-group"
                                    >
                                      <label>
                                        {formatLabel(attr)}
                                        <input
                                          type="text"
                                          value={
                                            mappingData[category][key][attr] ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            handleChange(e, category, key, attr)
                                          }
                                        />
                                      </label>
                                    </div>
                                  ) : null
                              )}
                              </div>
                            </div>
                          );
                        })
                      : Object.keys(mappingData[category]).map((key) => {
                          const newValuesKey = Object.keys(
                            mappingData[category][key]
                          )[1];
                          const oldValuesKey = Object.keys(
                            mappingData[category][key]
                          )[0];
                          const oldFontColor =
                            mappingData[category][key][oldValuesKey];
                          const isLight = oldFontColor
                            ? isLightColor(oldFontColor)
                            : false;
                          const backgroundColor = isLight
                            ? "#000000"
                            : "#ffffff";
                          return (
                            <div key={key} className="input-group">
                              <label>
                                {/* {formatLabel(key)} */}
                                <div className="old-attribute">
                                  {category === "backgroundColors" ? (
                                    <div
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor:
                                          mappingData[category][key][
                                            oldValuesKey
                                          ],
                                        borderRadius: "20px",
                                        border: "1px solid #000",
                                      }}
                                    ></div>
                                  ) : category === "fontFamily" ? (
                                    <div
                                      style={{
                                        fontFamily:
                                          mappingData[category][key][
                                            oldValuesKey
                                          ],
                                      }}
                                    >
                                      {`${mappingData[category][key][oldValuesKey]}`}
                                    </div>
                                  ) : category === "fontColor" ? (
                                    <div className="font-colour"
                                      style={{
                                        color:
                                          mappingData[category][key][
                                            oldValuesKey
                                          ],
                                        backgroundColor: backgroundColor,
                                        padding: "5px",
                                        border: "1px solid #000",
                                        width: "310px",
                                      }}
                                    >
                                      {`The colour of this text is ${mappingData[category][key][oldValuesKey]}`}
                                    </div>
                                  ) : category === "fontSize" ? (
                                    <div
                                      style={{
                                        fontSize:
                                          mappingData[category][key][
                                            oldValuesKey
                                          ],
                                      }}
                                    >
                                      {mappingData[category][key][oldValuesKey]}
                                    </div>
                                  ) : category === "images" ||
                                    category === "backgroundImg" ? (
                                    <img
                                      src={
                                        mappingData[category][key][oldValuesKey]
                                      }
                                      alt="Old attribute"
                                      style={{ width: "100px", height: "auto" }}
                                    />
                                  ) : (
                                    `${mappingData[category][key][oldValuesKey]}`
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={
                                    mappingData[category][key][newValuesKey] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleChange(e, category, key, newValuesKey)
                                  }
                                />
                              </label>
                            </div>
                          );
                        })}
              </div>
            </div>
          );
        })}
      </form>
      {type === "email" ? (
        <div>
          <h3>Process Image</h3>
          <input
            type="text"
            placeholder="Star Color (hex)"
            value={replaceColor}
            onChange={(e) => setReplaceColor(e.target.value)}
          />
        </div>
      ) : null}
      <button type="button" onClick={handleUpdate}>
        Submit
      </button>
      <button type="button" onClick={handleDownload}>
        {type === "email" ? "Download Zip" : "Copy Code"}
      </button>
    </div>
  );
}

export default Input;
