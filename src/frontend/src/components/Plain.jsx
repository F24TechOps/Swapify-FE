import { useState, useEffect } from "react";
import { createZipOrCopy, getTemplate } from "../services/api";
import "../css/body.css";

const Plain = ({ type, company }) => {
  const [preview, setPreview] = useState("...loading");

  useEffect(() => {
    getTemplate(type)
      .then((res) => {
        setPreview(res.data);
      })
      .catch((err) => {
        console.error("Error fetching template", err);
        setPreview("Error Loading file");
      });
  }, [type]);

  const handleDownloadZip = async () => {
    try {
      const res = await createZipOrCopy(type, company);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${company}ptt.zip`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Eroor creating plain text template zip file: ", err);
    }
  };

  return (
    <div id="plain">
      <button onClick={handleDownloadZip}>Download Zip</button>
      <div className="plain-container">
        <iframe
          srcDoc={preview}
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      </div>
    </div>
  );
};

export default Plain;
