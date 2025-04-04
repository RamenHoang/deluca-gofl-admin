import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./../assets/img/AdminLTELogo.png";
import avatar from "./../assets/img/user2-160x160.jpg";
import userAPI from "./../apis/userAPI";
import getCookie from "../utils/getCookie";
import { errorToast } from "./Toasts/Toasts";
import dashboardAPI from "../apis/dashboardAPI";

const Sidebar = (props) => {
  const [currUser, setCurrUser] = useState({});
  const [countNewOrder, setCountNewOrder] = useState(0);

  useEffect(() => {
    userAPI
      .getUserById(getCookie("currentAdminId"))
      .then((res) => {
        setCurrUser(res.data.data);
      })
      .catch((err) => {
        errorToast("Có lỗi xảy ra, vui lòng thử lại");
      });

    dashboardAPI.countNewOrders().then((res) => {
      setCountNewOrder(res.data.data);
    });
  }, []);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo  */}
      <Link to="/dashboard" className="brand-link">
        <img
          src={logo}
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">DELUCA.VN</span>
      </Link>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src={avatar} className="img-circle elevation-2" alt="User" />
          </div>
          <div className="info">
            <Link to="/profile">{currUser.username}</Link>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-header">Danh mục chính</li>

            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p> Bảng điều khiển </p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/categories"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fas fa-database"></i>
                <p>Danh mục</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/colors"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fab fa-product-hunt"></i>
                <p>Màu sắc</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/sizes"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fab fa-product-hunt"></i>
                <p>Kích thước</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/products"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fab fa-product-hunt"></i>
                <p>Sản phẩm</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/payments"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fab fa-product-hunt"></i>
                <p>Thanh toán</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/posts"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fab fa-product-hunt"></i>
                <p>Tin tức</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/comments"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fas fa-star-half-alt"></i>
                <p>Đánh giá</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/banners"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fas fa-sliders-h"></i>
                <p>Banner</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/orders"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fas fa-shipping-fast"></i>
                <p>Đơn hàng</p>
                {countNewOrder !== 0 ? (
                  <span className="badge badge-danger right">
                    {countNewOrder}
                  </span>
                ) : (
                  ""
                )}
              </NavLink>
            </li>

            {currUser.role === "admin" ? (
              <>
                <li className="nav-header">Đối tác</li>
                <li className="nav-item">
                  <NavLink
                    to="/customers"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className="nav-icon fas fa-handshake"></i>
                    <p>Đối tác</p>
                  </NavLink>
                </li>
              </>
            ) : (
              ""
            )}

            <li className="nav-header">Hệ thống</li>

            {currUser.role === "admin" ? (
              <li className="nav-item">
                <NavLink
                  to="/staffs"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nav-icon fas fa-user-shield"></i>
                  <p>Quản lý nhân viên</p>
                </NavLink>
              </li>
            ) : (
              ""
            )}

            <li className="nav-item">
              <NavLink
                to="/profile"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fas fa-user"></i>
                <p> Hồ sơ cá nhân </p>
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
};

export default Sidebar;
