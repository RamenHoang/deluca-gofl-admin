/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import customerAPI from '../../apis/customerAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Customer = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    showLoader();
    customerAPI.getAllCustomers().then((res) => {
      setCustomers(res.data.data);
      hideLoader();
    }).catch((err) => {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại !");
    })
  }, []);

  let handleDeleteCustomer = (id) => {
    customerAPI.deleteCustomerById(id).then((res) => {
      if (res.data.message === 'NOT_PERMISSION') {
        errorToast("Bạn không có quyền xóa tài khoản khách hàng");
      }
      if (res.data.message === 'USER_NOT_FOUND') {
        errorToast("Người dùng không tồn tại");
      }
      if (res.data.message === 'SUCCESS') {
        successToast("Xóa tài khoản người dùng thành công");
        let newCustomers = customers.filter(customer => customer._id !== id);
        setCustomers([...newCustomers]);
      }
    }).catch((err) => {
      errorToast("Có lỗi xảy ra, vui lòng thử lại");
    })
  }

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Quản lý khách hàng</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                        </Link>
                </li>
                <li className="breadcrumb-item active">Khách hàng</li>
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
                    Tất cả khách hàng
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
                        <th>Họ tên</th>
                        <th>Thông tin</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        customers.filter(val => query === '' || val.username.toLowerCase().indexOf(query.toLowerCase()) > -1
                        || val.email.toLowerCase().indexOf(query.toLowerCase()) > -1 ? val : '').map((v, i) => {
                          return (
                            <tr key={i}>
                              <td>{i}</td>
                              <td>{v.username}</td>
                              <td>
                                <ul>
                                  <li>Email: {v.email}</li>
                                  <li>Ngày sinh: {v.dateOfBirth} </li>
                                  <li>Giới tính: {v.gender === 'male' ? 'Nam' : 'Nữ'}</li>
                                </ul>
                              </td>

                              <td>
                                <button className="btn btn-danger" onClick={() => handleDeleteCustomer(v._id)}>
                                  <i className="fas fa-trash-alt mr-1"></i> Xóa
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Thông tin</th>
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

export default Customer;
