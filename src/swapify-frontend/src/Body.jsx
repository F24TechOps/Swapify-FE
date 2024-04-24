import "./css/body.css";
import Preview from "./Preview.jsx";
import Input from "./Input.jsx";
import Output from "./Output.jsx";
import { useState } from "react";

function Body() {
  const [isInput, setIsInput] = useState(true);

  const toggleInput = () => {
    setIsInput(!isInput);
  };

  return (
    <div id="main-body">
      <Preview />
      {isInput ? <Input /> : <Output />}
      <button onClick={toggleInput}>{isInput ? 'Submit' : 'Download Zip'}</button>
    </div>
  );
}

export default Body;
