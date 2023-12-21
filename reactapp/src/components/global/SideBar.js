import "./SideBar.css";
import React from "react";
import Card from "./Card";
import GuestSideBar from "../guest/sidebar/GuestSideBar";
import UserSideBar from "../user/sidebar/UserSideBar";
import AdminSideBar from "../admin/sidebar/AdminSideBar";

export default function SideBar(props) {
  let cont = "";
  if(props.sidebar === "guest"){
    cont = <GuestSideBar />
  }else if(props.sidebar === "admin"){
    cont = <AdminSideBar />
  }else if(props.sidebar === "user"){
    cont = <UserSideBar />
  }
  return (
    <Card>
      <div
        className="hamburger"
        id="hamburgerId"
        onClick={hamburger}
      ></div>
      {cont}
    </Card>
  );
}
export function hamburger() {
  let sidebarMargin =
    document.getElementsByClassName("SideBar")[0].style.marginLeft;
  if (sidebarMargin === "0%") {
    document.getElementsByClassName("SideBar")[0].style.marginLeft = "-50%";
  } else {
    document.getElementsByClassName("SideBar")[0].style.marginLeft = "0%";
  }
}
