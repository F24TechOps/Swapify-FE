import "../css/body.css";
import { NavLink } from "react-router-dom";
import full from "../assets/full.png";

const Header = () => {
  return (
    <header>
      <div id="logo-body">
        <img id="logo" src={full} width={200}/>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/microsite" activeclassname="active">
              Microsite
            </NavLink>
          </li>
          <li>
            <NavLink to="/email" activeclassname="active">
              Email
            </NavLink>
          </li>
          <li>
            <NavLink to="/templates" activeclassname="active">
              Templates
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
