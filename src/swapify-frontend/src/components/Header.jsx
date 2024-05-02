import "../css/body.css";

const Header = () => {
  return (
    <header>
      <div id="logo-body">
        <p id="logo">Swapify</p>
      </div>
        <ul>
          <li>
            <a href="/microsite">Microsite</a>
          </li>
          <li>
            <a href="/email">Email</a>
          </li>
          <li>
            <a href="/text">Text Template</a>
          </li>
        </ul>
    </header>
  );
};

export default Header;
