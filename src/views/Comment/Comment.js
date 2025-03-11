import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import commentAPI from '../../apis/commentAPI';
import './Comment.css';

const Comment = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    commentAPI.getAllComments().then((res) => {
      setComments(res.data.data);
      console.log(res.data.data);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  let handleDeleteComment = (id) => {
    console.log(id);
  }

  let commentRating = (star) => {
    let arrStar = [];
    for (let i = 1; i <= star; i++) {
      arrStar = [...arrStar, <li key={i} className="active-star"><i className="fa fa-star" /></li>];
    }

    for (let j = star + 1; j <= 5; j++ ) {
      arrStar = [...arrStar, <li key={j}><i className="fa fa-star" /></li>]
    }
    return arrStar;
  }

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Bình luận của khách hàng</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                        </Link>
                </li>
                <li className="breadcrumb-item active">Bình luận</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary">

                <div className="card-header">
                  <h3 className="card-title">Bình luận</h3>
                </div>

                <div className="card-body">
                  <table id="example1" className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Nội dung</th>
                        <th>Số sao</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        comments.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td>{i}</td>
                              <td>{v.user ? v.user.username : ''}</td>
                              <td>{v.book ? v.book.p_name : ''}</td>
                              <td>{v.c_content}</td>
                              <td>
                                <ul className="d-flex" style={{ listStyle: 'none', padding: '0px' }}>
                                 {commentRating(v.c_rate)}
                                </ul>
                              </td>
                              <td>
                                <button className="btn btn-danger" onClick={() => handleDeleteComment(v._id)}>
                                  <i className="fas fa-trash-alt mr-1"></i> Xóa
                              </button>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>STT</th>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Nội dung</th>
                        <th>Số sao</th>
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
    </div>
  )
}

export default Comment;
