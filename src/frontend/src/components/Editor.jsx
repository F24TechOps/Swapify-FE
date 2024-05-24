import Preview from "./Preview.jsx";
import Input from "./Input.jsx";
import Output from "./Output.jsx";
import "../css/body.css";

const Editor = ({type, company}) => {

    return (
    <div id='container'>
        <Preview type={type} company={company}/>
        <Input type={type} company={company}/>
        <Output type={type} company={company}/>
    </div>
    );
}

export default Editor;