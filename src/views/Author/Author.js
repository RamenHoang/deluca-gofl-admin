/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authorAPI from './../../apis/authorAPI';
import { errorToast, successToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Author = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [dataAuthor, setDataAuthor] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    showLoader();
    authorAPI.getAllAuthors().then((res) => {
      setDataAuthor(res.data.data);
      hideLoader();
    }).catch((err) => {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại !");
    })
  }, []);

  let handleDeleteAuthor = (id) => {
    showLoader();
    authorAPI.deleteAuthorById(id).then((res) => {
      if (res.data.message === 'AUTHOR_NOT_FOUND') {
        hideLoader();
        errorToast("Tác giả không tồn tại !");
      }
      if (res.data.message === 'SUCCESS') {
        successToast("Xóa tác giả thành công");
        let newDataAuthor = dataAuthor.filter(value => value._id !== id);
        setDataAuthor([...newDataAuthor]);
        hideLoader();
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
              <h1>Quản lý tác giả</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Tác giả</li>
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
                    <Link to="/authors/add">
                      <button className="btn btn-primary">
                        <i className="fas fa-plus-circle"></i> Thêm tác giả
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
                        <th>Tên tác giả</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>

                      {
                        dataAuthor.filter(val => query === '' || val.a_name.toLowerCase().indexOf(query.toLowerCase()) > -1 ? val : ''
                        ).map((value, index) => {
                          return (
                            <tr key={index}>
                              <td>{index}</td>
                              <td>{value.a_name}</td>
                              <td>
                                <button className="btn btn-danger" onClick={() => handleDeleteAuthor(value._id)}>
                                  <i className="fas fa-trash-alt mr-1"></i> Xóa
                                </button>
                                <Link to={`/authors/edit/${value._id}`}>
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
                        <th>Tên tác giả</th>
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

export default Author;
