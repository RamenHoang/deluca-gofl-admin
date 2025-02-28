/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import FilterName from '../../components/Filter/FilterName';
import productAPI from "./../../apis/productAPI";
import { errorToast, successToast } from "./../../components/Toasts/Toasts";
import useFullPageLoader from "./../../hooks/useFullPageLoader";

const Product = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [allProducts, setAllProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    showLoader();
    productAPI
      .getAllProduct()
      .then((res) => {
        if (res.data.message === "SUCCESS") {
          setAllProducts(res.data.data);

          hideLoader();
        }
      })
      .catch((err) => {
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      });
  }, []);

  let handleDeleteProduct = (id) => {
    showLoader();
    productAPI.deleteProductById(id).then((res) => {
      if (res.data.message === "PRODUCT_NOT_FOUND") {
        hideLoader();
        errorToast("Sản phẩm không tồn tại");
      }
      if (res.data.message === "DESTROY_IMAGE_FAILED") {
        hideLoader();
        errorToast("Xóa hình ảnh không thành công, vui lòng thử lại");
      }
      if (res.data.message === "SUCCESS") {
        hideLoader();
        successToast("Xóa sản phẩm thành công");
        let newAllProducts = allProducts.filter(
          (product) => product._id !== id
        );
        setAllProducts([...newAllProducts]);
      }
    });
  };

  let handleChangeProductHot = (id, data) => {
    let json = {
      status: data,
    };
    showLoader();
    productAPI
      .changeProductHotById(id, json)
      .then((res) => {
        if (res.data.message === "PRODUCT_NOT_FOUND") {
          hideLoader();
          errorToast("Sản phẩm không tồn tại, vui lòng thử lại sau !");
        }
        if (res.data.message === "SUCCESS") {
          let newAllProducts = [...allProducts];
          let index = newAllProducts.findIndex((e) => e._id === id);
          let productIndex = { ...newAllProducts[index] };

          if (productIndex.p_hot === "true") {
            delete productIndex.p_hot;
            productIndex = {
              ...productIndex,
              p_hot: "false",
            };
          }
          if (newAllProducts[index].p_hot === "false") {
            delete productIndex.p_hot;
            productIndex = {
              ...productIndex,
              p_hot: "true",
            };
          }
          delete newAllProducts[index];
          newAllProducts.splice(index, 1, productIndex);
          setAllProducts([...newAllProducts]);
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
              <h1>Sản phẩm</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item active">Sản phẩm</li>
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
                    <Link to="/products/add">
                      <button className="btn btn-primary">
                        <i className="fas fa-plus-circle"></i> Thêm sản phẩm
                      </button>
                    </Link>
                  </h3>

                  <div>
                    <form className="form-inline">
                      <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Nhập tên cần tìm kiếm...."
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
                        <th>Tên sản phẩm</th>
                        <th>Hình ảnh</th>
                        <th>Mã sản phẩm</th>
                        <th>Giá</th>
                        <th>Nổi bật</th>
                        <th>Danh mục</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>
                      {allProducts
                        .filter((val) =>
                          query === "" ||
                          val.p_name
                            .toLowerCase()
                            .indexOf(query.toLowerCase()) > -1 ||
                          val.category.c_name
                            .toLowerCase()
                            .indexOf(query.toLowerCase()) > -1
                            ? val
                            : ""
                        )
                        .map((v, i) => {
                          return (
                            <tr key={i}>
                              <td>{i}</td>
                              <td>{v.p_name}</td>
                              <td>
                                <img
                                  src={v.p_images[0].url}
                                  alt="Product"
                                  className="img-thumbnail"
                                  style={{ height: "100px" }}
                                />
                              </td>
                              <td>{v.p_code}</td>
                              <td>{v.p_price} VND</td>
                              <td>
                                {v.p_hot === "true" ? (
                                  <button
                                    className="badge rounded-pill bg-primary"
                                    onClick={() =>
                                      handleChangeProductHot(v._id, "false")
                                    }
                                  >
                                    Hot
                                  </button>
                                ) : (
                                  ""
                                )}
                                {v.p_hot === "false" ? (
                                  <button
                                    className="badge rounded-pill bg-secondary"
                                    onClick={() =>
                                      handleChangeProductHot(v._id, "true")
                                    }
                                  >
                                    No Hot
                                  </button>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>
                                <span className="badge badge-info">
                                  {v.category.c_name}
                                </span>
                              </td>
                              <td className="d-flex border-left-0 border-right-0 border-bottom-0">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDeleteProduct(v._id)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                                <Link to={`/products/edit/${v._id}`}>
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
                        <th>Tên sản phẩm</th>
                        <th>Hình ảnh</th>
                        <th>Mã sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Danh mục</th>
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

export default Product;
