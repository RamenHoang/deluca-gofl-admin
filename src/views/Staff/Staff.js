import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import staffAPI from '../../apis/staffAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Staff = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [staffs, setStaffs] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    staffAPI.getAllStaffs().then((res) => {
      setStaffs(res.data.data);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  let handleDeleteStaff = (id) => {
    showLoader();
    staffAPI.deleteStaffById(id).then((res) => {
      if (res.data.message === 'NOT_PERMISSION') {
        hideLoader();
        errorToast("Bạn không có quyền xóa nhân viên !");
      }
      if (res.data.message === 'ME') {
        hideLoader();
        errorToast("Bạn không thể xóa chính mình");
      }
      if (res.data.message === 'USER_NOT_FOUND') {
        hideLoader();
        errorToast("Không tồn tại nhân viên, thử lại !");
      }
      if (res.data.message === 'SUCCESS') {
        let newStaffs = staffs.filter(staff => staff._id !== id);
        setStaffs([...newStaffs]);
        hideLoader();
        successToast("Xóa nhân viên thành công");
      }
    }).catch((err) => {
      errorToast("Có lỗi xảy ra, vui lòng thử lại !");
    })
  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Quản lý nhân viên</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                        </Link>
                </li>
                <li className="breadcrumb-item active">Nhân viên</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">

                <div className="card-header d-flex justify-content-between">
                  <h3 className="card-title">
                    <Link to="/staffs/add">
                      <button className="btn btn-primary">
                        <i className="fas fa-plus-circle"></i> Thêm nhân viên
                      </button>
                    </Link>
                  </h3>
                  <div>
                    <form className="form-inline">
                      <input className="form-control mr-sm-2" type="search" placeholder="Nhập tên cần tìm kiếm...." aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <button className="btn btn-outline-primary my-2 my-sm-0 p-1" type="button">Tìm kiếm</button>
                    </form>
                  </div>
                </div>

                <div className="card-body">
                  <table id="example1" className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên nhân viên</th>
                        <th>Thông tin</th>

                        <th>Chức vụ</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        staffs.filter(val => query === '' || val.username.toLowerCase().indexOf(query.toLowerCase()) > -1
                        || val.email.toLowerCase().indexOf(query.toLowerCase()) > -1 ? val : '').map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{i}</td>
                                <td>{v.username}</td>
                                <td>
                                  <ul>
                                    <li>Email : {v.email}</li>
                                    <li>Giới tính: {v.gender === 'male' ? 'Nam' : 'Nữ'}</li>
                                    <li>Ngày sinh: {v.dateOfBirth} </li>
                                    <li>Địa chỉ: {v.address}</li>
                                  </ul>
                                </td>
                                <td>
                                  {
                                    v.role === 'admin' ? (<span className="badge badge-primary"> Quản trị viên </span>) :
                                      (<span className="badge badge-secondary"> Nhân viên </span>)
                                  }
                                </td>
                                <td>
                                  <button className="btn btn-danger" onClick={() => handleDeleteStaff(v._id)}>
                                    <i className="fas fa-trash-alt mr-1"></i> Xóa
                                  </button>
                                  <Link to={`/staffs/edit/${v._id}`} >
                                    <button className="btn btn-warning">
                                      <i className="fas fa-edit mr-1"></i> Sửa
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            )
                          })
                      }
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>STT</th>
                        <th>Tên nhân viên</th>
                        <th>Thông tin</th>
                        <th>Chức vụ</th>
                        <th>Hành động</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      { loader}
    </div>
  )
}

export default Staff;
