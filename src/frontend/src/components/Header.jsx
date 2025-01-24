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
            <NavLink to="/microsite" activeClassName="active">
              Microsite
            </NavLink>
          </li>
          <li>
            <NavLink to="/email" activeClassName="active">
              Email
            </NavLink>
          </li>
          <li>
            <NavLink to="/templates" activeClassName="active">
              Templates
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
