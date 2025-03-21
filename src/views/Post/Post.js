/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import postAPI from "./../../apis/postAPI";
import { errorToast, successToast } from "./../../components/Toasts/Toasts";
import useFullPageLoader from "./../../hooks/useFullPageLoader";

const Post = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [allPosts, setAllPosts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    showLoader();
    postAPI
      .getAllPosts()
      .then((res) => {
        if (res.data.message === "SUCCESS" && res.data.posts) {
          setAllPosts(res.data.posts);
        }
        hideLoader();
      })
      .catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      });
  }, []);

  let handleDeletePost = (id) => {
    showLoader();
    postAPI.deletePostById(id).then((res) => {
      if (res.data.message === "POST_NOT_FOUND") {
        hideLoader();
        errorToast("Bài viết không tồn tại");
      }
      if (res.data.message === "DESTROY_IMAGE_FAILED") {
        hideLoader();
        errorToast("Xóa hình ảnh không thành công, vui lòng thử lại");
      }
      if (res.data.message === "SUCCESS") {
        hideLoader();
        successToast("Xóa bài viết thành công");
        let newAllPosts = allPosts.filter(
          (post) => post._id !== id
        );
        setAllPosts([...newAllPosts]);
      }
    });
  };

  let handleChangePostFeatured = (id, data) => {
    showLoader();
    postAPI
      .updatePostById(id, { published: data })
      .then((res) => {
        if (res.data.message === "POST_NOT_FOUND") {
          hideLoader();
          errorToast("Bài viết không tồn tại, vui lòng thử lại sau !");
        }
        if (res.data.message === "SUCCESS") {
          let newAllPosts = [...allPosts];
          let index = newAllPosts.findIndex((e) => e._id === id);
          let postIndex = { ...newAllPosts[index] };

          if (postIndex.published === true) {
            delete postIndex.published;
            postIndex = {
              ...postIndex,
              published: false,
            };
          }
          if (newAllPosts[index].published === false) {
            delete postIndex.published;
            postIndex = {
              ...postIndex,
              published: true,
            };
          }
          delete newAllPosts[index];
          newAllPosts.splice(index, 1, postIndex);
          setAllPosts([...newAllPosts]);
          hideLoader();
          successToast("Thay đổi thành công !");
        }
      })
      .catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      });
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Bài viết</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item active">Bài viết</li>
              </ol>
            </div>
          </div>
        </div>
        {/* /.container-fluid */}
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <h3 className="card-title">
                    <Link to="/posts/add">
                      <button className="btn btn-primary">
                        <i className="fas fa-plus-circle"></i> Thêm bài viết
                      </button>
                    </Link>
                  </h3>

                  <div>
                    <form className="form-inline">
                      <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Nhập tiêu đề cần tìm kiếm...."
                        aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-primary my-2 my-sm-0 p-1"
                        type="button"
                      >
                        Tìm kiếm
                      </button>
                    </form>
                  </div>
                </div>

                <div className="card-body">
                  <table
                    id="example1"
                    className="table table-bordered table-hover"
                  >
                    <thead>
                      <tr>
                        <th>Số thứ tự</th>
                        <th>Tiêu đề</th>
                        <th>Hình ảnh</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>
                      {allPosts
                        .filter((val) =>
                          query === "" ||
                            val.title
                              .toLowerCase()
                              .indexOf(query.toLowerCase()) > -1
                            ? val
                            : ""
                        )
                        .map((v, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{v.title}</td>
                              <td>
                                <img
                                  src={v.featuredImage.url}
                                  alt="Post"
                                  className="img-thumbnail"
                                  style={{ height: "100px" }}
                                />
                              </td>
                              <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                              {/* <td>
                                {v.published === true ? (
                                  <button
                                    className="badge rounded-pill bg-primary"
                                    onClick={() =>
                                      handleChangePostFeatured(v._id, false)
                                    }
                                  >
                                    Đã xuất bản
                                  </button>
                                ) : (
                                  ""
                                )}
                                {v.published === false ? (
                                  <button
                                    className="badge rounded-pill bg-secondary"
                                    onClick={() =>
                                      handleChangePostFeatured(v._id, true)
                                    }
                                  >
                                    Chưa xuất bản
                                  </button>
                                ) : (
                                  ""
                                )}
                              </td> */}
                              <td className="d-flex border-left-0 border-right-0 border-bottom-0">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDeletePost(v._id)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                                <Link to={`/posts/edit/${v._id}`}>
                                  <button className="btn btn-warning">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>Số thứ tự</th>
                        <th>Tiêu đề</th>
                        <th>Hình ảnh</th>
                        <th>Ngày tạo</th>
                        {/* <th>Trạng thái</th> */}
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
      {loader}
    </div>
  );
};

export default Post;
