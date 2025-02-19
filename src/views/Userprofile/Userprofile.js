import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';

import userAPI from './../../apis/userAPI';
import getCookie from './../../utils/getCookie';
import TabUpdatePass from './TabUpdatePass';
import TabUpdateInfo from './TabUpdateInfo';
import TabUpdateAvatar from './TabUpdateAvatar';
import { Link } from 'react-router-dom';

const Userprofile = () => {

  // const history = useHistory();

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {

    userAPI.getUserById(getCookie('currentAdminId')).then((res) => {
      setUserInfo(res.data.data);
    }).catch((err) => {
      console.log(`Error: ${err}`);
    })
    
  }, []);

  return (
    <div className="content-wrapper">
      {/* <ToastContainer draggable={false} transition={Zoom} autoClose={5000} /> */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thông tin cá nhân</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Hồ sơ cá nhân</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">

              {/* Profile */}
              <TabUpdateAvatar 
                dataUser={userInfo}
              />

            </div>


            {/* /.col */}
            <div className="col-md-9">
              <div className="card">

                <div className="card-header p-2">
                  <ul className="nav nav-pills">
                    <li className="nav-item"><a className="nav-link active" href="#information" data-toggle="tab">Thông tin</a></li>
                    <li className="nav-item"><a className="nav-link" href="#updatePassword" data-toggle="tab">Thay đổi mật khẩu</a></li>
                  </ul>
                </div>{/* /.card-header */}

                <div className="card-body">
                  <div className="tab-content">

                    {/* /.tab-pane information */}
                    <TabUpdateInfo 
                      userInfo={userInfo}
                    />
                    {/* /.tab-pane */}

                    {/* /.tab-pane update password */}
                    <TabUpdatePass />
                    {/* /.tab-pane */}

                  </div>
                  {/* /.tab-content */}
                </div>{/* /.card-body */}
              </div>
              {/* /.card */}
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>{/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
  );
}

export default Userprofile;
