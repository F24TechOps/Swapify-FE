import "./css/body.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Email from "./components/Email";
import Microsite from "./components/Microsite";

function Body() {
  
  return (
    <Router>
      <div id="main-body">
        <Routes>
          <Route path="/" Component={Email} />
          <Route path="/email" Component={Email} />
          <Route path="/microsite" Component={Microsite} />
          <Route path="/*" Component={Email} />
        </Routes>
      </div>
    </Router>
  );
}

export default Body;
