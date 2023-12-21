import "../../global/SideBar.css";
import { Link } from 'react-router-dom';
export default function GuestSideBar() {
  function hideSideBar() {
    let sidebarMargin =
    document.getElementsByClassName("SideBar")[0].style.marginLeft;
    if (sidebarMargin === "0%") {
      document.getElementsByClassName("SideBar")[0].style.marginLeft = "-50%";
    } else {
      document.getElementsByClassName("SideBar")[0].style.marginLeft = "0%";
    }
  }
  return (
    <div className="SideBar">
      <Link to="/login" onClick={hideSideBar}>
        <div className="SideBarOption firstOption">
          <div>Zaloguj</div>
        </div>
      </Link>
      <hr></hr>
      <Link to="/trendings" onClick={hideSideBar}>
      <div className="SideBarOption">
        <div>Popularne spółki</div>
      </div>
      </Link>
      <div className="SideBarOption unavailable tooltip">
        Porównaj spółki
        <span className="tooltiptext">Dla zalogowanych</span>
      </div>
      <div className="SideBarOption unavailable tooltip">
        Wyszukaj spółkę
        <span className="tooltiptext">Dla zalogowanych</span>
      </div>
      <Link to="/contact" onClick={hideSideBar}>
      <div className="SideBarOption">
        <div>Kontakt</div>
      </div>
      </Link>
    </div>
  );
}
