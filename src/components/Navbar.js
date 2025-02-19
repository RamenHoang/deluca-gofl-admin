import React from 'react';
import { useHistory } from 'react-router';
import { successToast } from './Toasts/Toasts';

const Navbar = () => {

  const history = useHistory();

  let handleLogout = (e) => {
    e.preventDefault();
    document.cookie = 'authAdminToken=;expires = Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'currentAdminId=;expires = Thu, 01 Jan 1970 00:00:00 GMT';
    successToast("Đăng xuất thành công !");
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
    history.push('/');
  }

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">

      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="/" role="button"><i className="fas fa-bars"></i></a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="http://localhost:3001" className="nav-link">Trang chủ</a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="https://www.facebook.com/107432951513144/inbox" className="nav-link">Liên hệ</a>
        </li>
      </ul>

      {/* search form */}
      <form className="form-inline ml-3">
        <div className="input-group input-group-sm">
          <input className="form-control form-control-navbar" type="search" placeholder="Tìm kiếm..." aria-label="Search" />
          <div className="input-group-append">
            <button className="btn btn-navbar" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </form>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="# " onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
