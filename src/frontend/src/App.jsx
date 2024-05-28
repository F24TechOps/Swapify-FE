import "./css/App.css";
import Header from "./components/Header.jsx";
import Editor from "./components/Editor.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/microsite" element={<Editor type="microsite" company="test" />} />
        <Route path="/email" element={<Editor type="email" company="test" />} />
        <Route path="/" element={<Editor type="email" company="test" />} />
      </Routes>
    </Router>
  );
}

export default App;