import "./css/App.css";
import Header from "./components/Header.jsx";
import Body from "./Body.jsx";
import Editor from "./components/Editor.jsx";

function App() {

  return (
    <>
      <Header />
      <Editor type={'email'} company={'test'}/>
    </>
  );
}

export default App;