import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  //logOut function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  // =================Doctor Menu list==============
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointment",
      path: "/doctor-Appointment",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  // =====================Doctor Menu list====================

  //rendering menu List
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  return (
    <div className="main">
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h6>Doctor Appointment App</h6>
            <hr></hr>
          </div>
          <div className="menu">
            {SidebarMenu.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={index}
                  className={`menu-item ${isActive ? "active" : ""}`}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            <div className={`menu-item`} onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div className="header-content">
              <Badge
                count={user && user.notification.length}
                onClick={() => {
                  navigate("/notification");
                }}
              >
                <i className="fa-solid fa-bell bi bi-bell"></i>
              </Badge>
              <Link to="/profile"> {user?.name}</Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
