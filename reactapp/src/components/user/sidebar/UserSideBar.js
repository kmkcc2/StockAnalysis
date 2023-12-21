import { Logout } from "../../global/authentication/login/Logout";
import "../../global/SideBar.css";
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
export default function UserSideBar() {
  const token = sessionStorage.getItem('token')
  const decodedToken = jwt_decode(token)

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
      <Link to={"/user/"+decodedToken.id} onClick={hideSideBar}>
        <div className="SideBarOption firstOption">
          <div className="SideBarUserEmail">{decodedToken.email}</div>
        </div>

        <hr></hr>
      </Link>
      <Link to="/user/search" onClick={hideSideBar}>
        <div className="SideBarOption">
          <div>Wyszukaj spółkę</div>
        </div>
      </Link>
      <Link to="/user/trendings" onClick={hideSideBar}>
        <div className="SideBarOption">
          <div>Popularne spółki</div>
        </div>
      </Link>
      <Link to="/user/compare" onClick={hideSideBar}>
        <div className="SideBarOption">
          <div>Porównaj spółki</div>
        </div>
      </Link>
      <Link to="/user/contact" onClick={hideSideBar}>
        <div className="SideBarOption">
          <div>Kontakt</div>
        </div>
      </Link>

      <Logout />
    </div>
  );
}
