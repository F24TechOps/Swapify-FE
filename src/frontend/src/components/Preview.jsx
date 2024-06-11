import "../css/body.css";
import { useEffect, useState } from "react";
import { getTemplate } from "../services/api";
import "./Loading";
import Loading from "./Loading";

const Preview = ({ type }) => {
  const [preview, setPreview] = useState("...loading");

  useEffect(() => {
    getTemplate(type)
      .then((res) => {
        setPreview(res.data);
      })
      .catch((err) => {
        console.error("Error fetching template", err);
      });
  }, [type]);

  if (preview === "...loading") {
    return <Loading />;
  }

  return (
    <div id="preview">
      <div className="iframe-container">
        <iframe
          srcDoc={preview}
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      </div>
    </div>
  );
};

export default Preview;
