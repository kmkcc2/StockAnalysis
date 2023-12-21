import jwtDecode from "jwt-decode";
import { Logout } from "../../global/authentication/login/Logout";
import "../../global/SideBar.css";
import { Link } from "react-router-dom";
export default function AdminSideBar() {
  const decodedToken = jwtDecode(sessionStorage.getItem('token'))
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
    <div className="SideBar" >
      <Link to="/admin" onClick={hideSideBar}>
        <div className="SideBarOption firstOption">
          <div>
          {decodedToken.email} <br /> the Admin
          </div>
        </div>
      </Link>
      <hr></hr>
      <Link to="backup" onClick={hideSideBar}>
        <div className="SideBarOption">
          <div>Kopia zapasowa</div>
        </div>
      </Link>
      <Link to="/admin/users" onClick={hideSideBar}>
        <div className="SideBarOption">
          <div>Użytkownicy</div>
        </div>
      </Link>
      <Link to="/admin/payments" onClick={hideSideBar}>
        <div className="SideBarOption">
          <div>Płatności</div>
        </div>
      </Link>
      <Logout />
    </div>
  );
}
