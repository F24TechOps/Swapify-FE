import "../css/body.css";
import { NavLink } from "react-router-dom";

const Header = ({ company }) => {
  return (
    <header>
      <div id="logo-body">
        <p id="logo">{company}</p>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/microsite">
              Microsite
            </NavLink>
          </li>
          <li>
            <NavLink to="/email">
              Email
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
