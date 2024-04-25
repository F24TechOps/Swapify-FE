import Preview from "./Preview.jsx";
import Input from "./Input.jsx";
import Output from "./Output.jsx";
import "../css/body.css";
import { useState } from "react";

const Editor = ({type}) => {
    const [isInput, setIsInput] = useState(true);

    const toggleInput = () => {
        setIsInput(!isInput);
    };

    return (
    <>
        <Preview type={type} />
        {isInput ? <Input /> : <Output />}
        <button onClick={toggleInput}>{isInput ? 'Submit' : 'Download Zip'}</button>
    </>
    );
}

export default Editor;