import "../css/body.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div id="logo-body">
        <p id="logo">Swapify</p>
      </div>
      <ul>
        <li>
          <Link to="/microsite">Microsite</Link>
        </li>
        <li>
          <Link to="/email">Email</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;