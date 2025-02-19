/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import companyAPI from '../../apis/companyAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';
const Company = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [dataCompany, setDataCompany] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    showLoader();
    companyAPI.getAllCompanies().then((res) => {
      setDataCompany(res.data.data);
      hideLoader();
    }).catch((err) => {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại !");
    })
  }, []);

  let handleDelete = (id) => {
    showLoader();
    companyAPI.deleteCompanyById(id).then((res) => {
      if (res.data.message === 'COMPANY_NOT_FOUND') {
        hideLoader();
        errorToast("Công ty không tồn tại");
      }
      if (res.data.message === 'SUCCESS') {
        let newDataCom = dataCompany.filter(value => value._id !== id);
        setDataCompany([...newDataCom]);
        hideLoader();
        successToast("Xóa nhà  xuất bản thành công");
      }
    }).catch((err) => {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại sau !");
    })
  }

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Nhà xuất bản</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Nhà xuất bản</li>
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
                    <Link to="/companies/add">
                      <button className="btn btn-primary">
                        <i className="fas fa-plus-circle"></i> Thêm nhà xuất bản
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
                        <th>Số thứ tự</th>
                        <th>Tên nhà xuất bản</th>
                        <th>Mã nhà xuất bản</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        dataCompany.filter(val => query === '' || val.c_name.toLowerCase().indexOf(query.toLowerCase()) > -1
                        || val.c_code.toLowerCase().indexOf(query.toLowerCase()) > -1 ? val : '' )
                          .map((value, index) => {
                            return (
                              <tr key={index}>
                                <td>{index}</td>
                                <td>{value.c_name}</td>
                                <td>{value.c_code}</td>
                                <td>
                                  <button className="btn btn-danger" onClick={() => handleDelete(value._id)}>
                                    <i className="fas fa-trash-alt mr-1"></i> Xóa
                                  </button>
                                  <Link to={`/companies/edit/${value._id}`}>
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
                        <th>Số thứ tự</th>
                        <th>Tên nhà xuất bản</th>
                        <th>Mã nhà xuất bản</th>
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

export default Company;
