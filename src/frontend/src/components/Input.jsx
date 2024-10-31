import { cloneDeep } from "lodash";
import React, { useState, useEffect } from "react";
import "../css/body.css";
import {
  getMappingData,
  updateMappingData,
  createMappingData,
  makeSwap,
  createZipOrCopy,
  processCircleImage,
  processStarColor,
} from "../services/api"; // Importing functions for API calls
import Loading from "./Loading"; // Component to show a loading spinner
import Buttons from "./RenderButtons"; // Component for rendering button-related inputs
import AllButtons from "./RenderAllButtons"; // Component for rendering inputs for all buttons
import InputFields from "./RenderInputs"; // Component for rendering general input fields

// Object defining the titles of different sections (used to display readable section titles)
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
};

// Main Input component which renders the form to modify template settings
function Input({ type, company, onDataUpdate }) {
  const [mappingDataCache, setMappingDataCache] = useState({}); // Cache for mapping data to prevent re-fetching
  const [mappingData, setMappingData] = useState(null); // State to store the fetched mapping data
  const [imageUrls, setImageUrls] = useState({}); // State to store the image URLs used in the form
  const [replaceColor, setReplaceColor] = useState("#70C7D5"); // State for replacing star color in emails
  const [loading, setLoading] = useState(true); // State to track whether data is loading
  const [collapsedSections, setCollapsedSections] = useState({}); // State to track collapsed/expanded sections in the form
  
  // useEffect to fetch the mapping data when the component loads or when 'type' or 'company' changes
  useEffect(() => {
    let isMounted = true; // Used to track if the component is still mounted
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts

      try {
        let newData;
        if (mappingDataCache[type]) {
          // If we already have cached data, use that
          newData = mappingDataCache[type];
        } else {
          // Fetch the mapping data from the server
          const response = await getMappingData(type, company);
          newData = response.data;

          if (!newData || Object.keys(newData).length === 0) {
            // If no data is found, create new mapping data
            throw new Error("No mapping data found, creating new data.");
          }
        }

        if (isMounted) {
          // Cache the new data
          setMappingDataCache((prevCache) => ({
            ...prevCache,
            [type]: newData,
          }));
          setMappingData(newData); // Update the mappingData state with the fetched data
          
          // Initialize collapsedSections with all sections set to collapsed
          setCollapsedSections(
            Object.keys(newData).reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {})
          );
        }
      } catch (error) {
        // Handle the case where data doesn't exist and needs to be created
        if (error.response && error.response.status === 404) {
          try {
            await createMappingData(type, company); // Create new mapping data
            const response = await getMappingData(type, company); // Fetch it after creation
            const newData = response.data;

            if (isMounted) {
              setMappingDataCache((prevCache) => ({
                ...prevCache,
                [type]: newData,
              }));
              setMappingData(newData); // Store the newly created data
            }
          } catch (createError) {
            console.error("Error creating new mapping data:", createError);
          }
        } else {
          console.error(`Error fetching mapping data for ${type} and ${company}:`, error);
        }
      } finally {
        // Stop loading when data fetch or creation is done
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData(); // Call the fetch function when the component mounts

    return () => {
      isMounted = false; // Clean up if the component unmounts to avoid state updates on unmounted components
    };
  }, [type, company]); // Runs when 'type' or 'company' changes

  // useEffect to extract image URLs from the mapping data whenever mappingData changes
  useEffect(() => {
    console.log(mappingData);
    
    if (mappingData) {
      const newImageUrls = Object.keys(mappingData.images || {}).reduce(
        (acc, key) => {
          const newLink = mappingData.images[key]?.newImageLink;
          const oldLink = mappingData.images[key]?.oldImageLink;
          acc[key] = newLink || oldLink; // Choose the new image link if available, otherwise fallback to the old one
          return acc;
        },
        {}
      );
      setImageUrls(newImageUrls); // Set the image URLs state
    }
  }, [mappingData]);

  // Handle input change in the form fields
  const handleChange = (e, category, key, attr = null, updateBoth = false) => {
    const { value } = e.target;

    console.log(category, '<== category', key, '<== Key', attr, '<== Attribute', updateBoth, '<== Update Both Var');
  
    setMappingData((prevMappingData) => {
      const newMappingData = cloneDeep(prevMappingData);
  
      if (updateBoth) {
        // Update both innerButton and outerButton attributes if `updateBoth` is true
        if (newMappingData[category]?.innerButton?.hasOwnProperty(attr)) {
          newMappingData[category].innerButton[attr] = value;
        }
        if (newMappingData[category]?.outerButton?.hasOwnProperty(attr)) {
          newMappingData[category].outerButton[attr] = value;
        }
      } else if (attr) {
        // Handle nested keys if an attribute is provided
        const keys = attr.split(".");
        if (keys.length === 2) {
          if (!newMappingData[category][key][keys[0]]) {
            newMappingData[category][key][keys[0]] = {};
          }
          newMappingData[category][key][keys[0]][keys[1]] = value;
        } else {
          newMappingData[category][key][attr] = value;
        }
      } else {
        // Directly update the key's value if no attribute is provided
        newMappingData[category][key] = value;
      }
  
      return newMappingData;
    });
  };  

  // Handle the submission and processing of form data
  const handleUpdate = async () => {
    try {
      await updateMappingData(type, company, mappingData); // Update the mapping data on the server
  
      if (type === "email" && replaceColor.length > 2) {
        // If it's an email type, process star color if a valid replaceColor is set
        await processStarColor(company, replaceColor, imageUrls);
      } else {
        setReplaceColor("#70C7D5");
        await processStarColor(company, replaceColor, imageUrls);
      }
  
      // If "ImageLink4" is present, process the circular image in the email
      if (type === "email" && imageUrls["ImageLink4"]) {
        await processCircleImage(
          company,
          "ImageLink4",
          imageUrls["ImageLink4"]
        );
      }
  
      await makeSwap(type, company, imageUrls); // Process and apply any other changes
  
      // Fetch updated data from the server after making changes
      const response = await getMappingData(type, company);
      const updatedData = response.data;
      setMappingData(updatedData); // Update state with the new data
  
      // Update image URLs with the newly fetched data
      const newImageUrls = Object.keys(updatedData.images || {}).reduce(
        (acc, key) => {
          const newLink = updatedData.images[key]?.newImageLink;
          const oldLink = updatedData.images[key]?.oldImageLink;
          acc[key] = newLink || oldLink;
          return acc;
        },
        {}
      );
      setImageUrls(newImageUrls); // Update the image URLs
  
      if (onDataUpdate) {
        onDataUpdate(); // Notify the parent component that data has been updated
      }
  
    } catch (err) {
      console.error(err);
    }
  };

  // Handle the downloading of a ZIP file or copying microsite code
  const handleDownload = async () => {
    try {
      const res = await createZipOrCopy(type, company, imageUrls, replaceColor); // Call API to create a zip or copy the code
      if (type === "microsite") {
        const text = await res.data.text();
        await navigator.clipboard.writeText(text); // Copy microsite template code to clipboard
        alert("Microsite Template copied to clipboard");
      } else if (type === "email") {
        const blob = new Blob([res.data]); // Create a downloadable file
        const url = window.URL.createObjectURL(blob); // Generate URL for the blob
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${company}.zip`); // Set file name for download
        document.body.appendChild(link); // Append the link to the document body
        link.click(); // Programmatically click the link to trigger the download
        link.parentNode.removeChild(link); // Remove the link element after download
        window.URL.revokeObjectURL(url); // Release the blob URL
      }
    } catch (err) {
      console.error("Error creating zip file:", err);
    }
  };

  // Toggle collapsing/expanding of form sections
  const toggleCollapse = (category) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [category]: !prevState[category], // Toggle the collapsed state for the given category
    }));
  };

  // If loading, show a loading spinner
  if (loading) {
    return <Loading />;
  }

  // Render the form with inputs for each section
  return (
    <div id="input-body">
      <form onSubmit={handleUpdate}>
        {mappingData &&
          Object.keys(mappingData).map((category) => (
            category !== 'fontSize' && ( // Skip rendering for the "fontSize" category
              <div key={category} id="category">
                <h2
                  onClick={() => toggleCollapse(category)}
                  style={{ cursor: "pointer" }} // Make the section title clickable for toggling collapse
                >
                  {categoryTitles[category] || category}
                  {collapsedSections[category] ? " +" : " -"}
                </h2>
                {!collapsedSections[category] && (
                  <div id="input-section">
                    {/* Render buttons, all buttons, or general input fields based on the category */}
                    {category === "buttons"
                      ? (<Buttons
                        category={category}
                        data={mappingData[category] || {}}
                        handleChange={handleChange}
                        type={type}
                      />)
                      : category === "allButtons"
                        ? (
                          <AllButtons
                            category={category}
                            data={mappingData[category] || {}}
                            handleChange={handleChange}
                            type={type}
                          />
                        )
                        : (
                          <InputFields
                            category={category}
                            data={mappingData[category] || {}}
                            handleChange={handleChange}
                            type={type}
                          />
                        )}
                  </div>
                )}
              </div>
            )
          ))}
        {/* Special field for Star Color in emails */}
        {type === "email" && (
          <div className="star-colour">
            <h2>Star Colour</h2>
            <input
              type="text"
              placeholder="Star Color (hex)"
              value={replaceColor}
              onChange={(e) => setReplaceColor(e.target.value)} // Update replaceColor when input changes
            />
          </div>
        )}
        <button type="button" onClick={handleUpdate}>
          Submit
        </button>
      </form>
      <button type="button" onClick={handleDownload}>
        {type === "email" ? "Download Zip" : "Copy Code"}
      </button>
    </div>
  );  
}

export default Input;
