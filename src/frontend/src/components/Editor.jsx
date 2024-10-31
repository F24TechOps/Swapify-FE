import Preview from "./Preview.jsx";
import Input from "./Input.jsx";
import Output from "./Output.jsx";
import "../css/body.css";
import { useState, useEffect } from "react";

const Editor = ({ type, company }) => {
  const [currentType, setCurrentType] = useState(type);
  const [currentCompany, setCurrentCompany] = useState(company);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    setCurrentType(type);
    setCurrentCompany(company)
  }, [type, company]);

  const handleDataUpdated = () => {
    setDataVersion((prevVersion) => prevVersion + 1);
  };

  return (
    <div id="container">
      <Preview type={currentType} />
      <Input type={currentType} company={currentCompany} onDataUpdate={handleDataUpdated}/>
      <Output type={currentType} company={currentCompany} dataVersion={dataVersion}/>
    </div>
  );
};

export default Editor;
