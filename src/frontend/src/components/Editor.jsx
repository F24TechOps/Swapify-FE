import Preview from "./Preview.jsx";
import Input from "./Input.jsx";
import Output from "./Output.jsx";
import "../css/body.css";
import { useState, useEffect } from "react";

const Editor = ({ type, company }) => {
  const [currentType, setCurrentType] = useState(type);
  const [currentCompany, setCurrentCompany] = useState(company)

  useEffect(() => {
    setCurrentType(type);
    setCurrentCompany(company)
  }, [type, company]);

  return (
    <div id="container">
      <Preview type={currentType} company={currentCompany} />
      <Input type={currentType} company={currentCompany} />
      <Output type={currentType} company={currentCompany} />
    </div>
  );
};

export default Editor;
