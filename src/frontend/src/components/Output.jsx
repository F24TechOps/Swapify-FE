import { useEffect, useState } from "react";
import "../css/body.css";
import { getFinal } from "../services/api";

const Output = ({ type, company }) => {
  const [output, setOutput] = useState("...loading");

  useEffect(() => {
    getFinal(type, company).then((res) => {
      setOutput(res.data);
    });
  }, [type, company]);

  if (!output) {
    return <div>...loading</div>;
  }

  return (
    <div className="iframe-container">
      <iframe
        srcDoc={output}
        style={{ width: "100%", height: "100vh" }}
      ></iframe>
    </div>
  );
};

export default Output;
