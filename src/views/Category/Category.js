/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import categoryAPI from './../../apis/categoryAPI';
import { successToast, errorToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Category = () => {

  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [dataCate, setDataCate] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    showLoader();
    categoryAPI.getAllCategories().then((res) => {
      setDataCate(res.data.data);
      hideLoader();
    }).catch((err) => {
      hideLoader();
      console.log(err);
    })
  }, []);

  let handleDeleteCate = (id) => {
    showLoader();
    categoryAPI.deleteById(id).then((res) => {
      if (res.data.message === 'CATEGORY_NOT_FOUND') {
        hideLoader();
        errorToast('Danh mục không tồn tại !');
      }
      if (res.data.message === 'SUCCESS') {
        let newDataCate = dataCate.filter(value => value._id !== id);
        setDataCate([...newDataCate]);
        hideLoader();
        successToast('Xóa danh mục thành công !');
      }
      if (res.data.message === 'PARENT_EXISTS') {
        hideLoader();
        errorToast("Xóa danh mục con trước !");
      }
    }).catch((err) => {
      hideLoader();
      errorToast('Có lỗi xảy ra, vui lòng thử lại');
    })
  }

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Danh mục sản phẩm</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Danh mục</li>
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
                    <Link to="/categories/add">
                      <button className="btn btn-primary">
                      <i className="fas fa-plus-circle"></i> Thêm danh mục
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
                        <th>Tên danh mục</th>
                        <th>Danh mục cha</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>

                      {
                        dataCate.filter(val => query === '' || val.c_name.toLowerCase().indexOf(query.toLowerCase()) > -1 ? val : '')
                        .map((v, i) => {
                          return (
                            <tr key={i}>
                              <td>{i}</td>
                              <td>{v.c_name}</td>
                              <td>
                                {
                                  v.c_parent ? v.c_parent.c_name : ''
                                }
                              </td>
                              <td>
                                <button className="btn btn-danger" onClick={() => handleDeleteCate(v._id)}>
                                  <i className="fas fa-trash-alt mr-1"></i> Xóa
                                </button>
                                <Link to={`categories/edit/${v._id}`}>
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
                        <th>Tên danh mục</th>
                        <th>Danh mục cha</th>
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
      { loader }
    </div>
  )
}

export default Category;
