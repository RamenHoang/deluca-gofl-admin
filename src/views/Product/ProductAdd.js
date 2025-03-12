/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import categoryAPI from "./../../apis/categoryAPI";
import colorAPI from "./../../apis/colorAPI";
import sizeAPI from "./../../apis/sizeAPI";
import productAPI from "./../../apis/productAPI";
import { errorToast, successToast } from "../../components/Toasts/Toasts";
import useFullPageLoader from "./../../hooks/useFullPageLoader";

const ProductAdd = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();
  const [cate, setCate] = useState([]);
  const [optionValueInputs, setOptionValueInputs] = useState([{ color: null, sizes: [], images: [] }]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    showLoader();
    categoryAPI
      .getAllCategories()
      .then((res) => {
        setCate(res.data.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
      });

    colorAPI
      .getAll()
      .then((res) => {
        setColors(res.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
      });

    sizeAPI
      .getAll()
      .then((res) => {
        setSizes(res.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addOptionValueInput = () => {
    setOptionValueInputs([...optionValueInputs, { color: null, sizes: [], images: [] }]);
  };

  const deleteOptionValueInput = (index) => {
    const values = [...optionValueInputs];
    values.splice(index, 1);
    setOptionValueInputs(values);
  };

  const handleColorChange = (index, event) => {
    const values = [...optionValueInputs];
    values[index].color = colors.find(color => color._id === event.target.value)._id;
    setOptionValueInputs(values);
    console.log(optionValueInputs);
  }

  const handleSizeChange = (index, sizeIndex, event) => {
    const values = [...optionValueInputs];
    values[index].sizes[sizeIndex] = { size: sizes[sizeIndex]._id, stock: event.target.value };
    setOptionValueInputs(values);
    console.log(optionValueInputs);
  }

  const handleImagesChange = (index, event) => {
    const values = [...optionValueInputs];
    const files = event.target.files;

    showLoader();
    let formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("variant_images", file);
    });

    productAPI
      .uploadImages(formData)
      .then((res) => {
        values[index].images = res.data.images;
        setOptionValueInputs(values);
        console.log(optionValueInputs);
        hideLoader();
      })
      .catch((err) => {
        hideLoader();
        console.log(err);
      });
  }

  let addProductFormik = useFormik({
    initialValues: {
      inputCateName: "",
      inputProductName: "",
      inputProductCode: "",
      inputProductHot: "false",
      inputProductPrice: "",
      inputProductPromotion: "",
      inputAuthorName: [],
      inputCompanyName: "",
      inputProductDescription: "",
      inputProductDatePublic: "",
      inputRating: 0,
      inputNumberOfRating: 0,
    },
    validationSchema: Yup.object({
      inputCateName: Yup.string().required("Bắt buộc chọn danh mục !"),
      inputProductName: Yup.string()
        .required("Bắt buộc nhập tên sản phẩm !")
        .max(255, "Tên sản phẩm quá dài, nhỏ hơn 255 kí tự !"),
      inputProductCode: Yup.string()
        .required("Bắt buộc nhập mã sản phẩm !")
        .max(100, "Mã sản phẩm quá dài, nhỏ hơn 100 kí tự"),
      inputProductHot: Yup.string(),
      inputProductPrice: Yup.number()
        .required("Bắt buộc  nhập giá sản phẩm !")
        .min(0, "Giá tiền lớn hơn 0"),
      inputProductDatePublic: Yup.string().required(
        "Bắt buộc chọn ngày phát hành !"
      ),
    }),
    onSubmit: (values) => {
      let formData = {
        "p_name": values.inputProductName,
        "p_code": values.inputProductCode,
        "p_hot": values.inputProductHot,
        "p_price": values.inputProductPrice,
        "p_promotion": values.inputProductPromotion,
        "p_description": values.inputProductDescription,
        "category": values.inputCateName,
        "p_datepublic": values.inputProductDatePublic,
        "rating": values.inputRating,
        "number_of_rating": values.inputNumberOfRating,
        "variants": optionValueInputs.map((value) => {
          return {
            color: value.color,
            sizes: value.sizes,
            images: value.images.map(image => image._id)
          }
        })
      };

      showLoader();
      productAPI
        .addNewProduct(formData)
        .then((res) => {
          if (res.data.message === "PRODUCT_EXISTS") {
            hideLoader();
            errorToast("Mã sản phẩm là duy nhất, đã tồn tại sản phẩm !");
          }
          if (res.data.message === "UPLOAD_FAILED") {
            hideLoader();
            errorToast(
              "Lỗi upload ảnh, vui lòng kiểm tra lại đường truyền mạng !"
            );
          }
          if (res.data.message === "SUCCESS") {
            hideLoader();
            successToast("Thêm sản phẩm thành công !");
            history.push({ pathname: "/products" });
          }
        })
        .catch((err) => {
          hideLoader();
          errorToast("Có lỗi xảy ra, vui lòng thử lại");
        });
    },
  });

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thêm sản phẩm</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/products">Sản phẩm</Link>
                </li>
                <li className="breadcrumb-item active">Thêm sản phẩm</li>
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
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Thêm</h3>
                </div>
                {/* /.card-header */}

                <form onSubmit={addProductFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="inputCateName">Danh mục (*)</label>
                          <select
                            className="form-control"
                            name="inputCateName"
                            value={addProductFormik.values.inputCateName}
                            onChange={addProductFormik.handleChange}
                          >
                            <option value="">Chọn danh mục...</option>
                            {cate.map((value, index) => {
                              return (
                                <option value={value._id}>
                                  {value.c_name}
                                </option>
                              );
                            })}
                          </select>

                          {addProductFormik.errors.inputCateName &&
                            addProductFormik.touched.inputCateName && (
                              <small>
                                {addProductFormik.errors.inputCateName}
                              </small>
                            )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="inputProductName">
                            Tên sản phẩm (*)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="inputProductName"
                            placeholder="Nhập tên sản phẩm...."
                            value={addProductFormik.values.inputProductName}
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductName &&
                            addProductFormik.touched.inputProductName && (
                              <small>
                                {addProductFormik.errors.inputProductName}
                              </small>
                            )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="inputProductCode">
                            Mã sản phẩm (*)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="inputProductCode"
                            placeholder="Nhập mã sản phẩm...."
                            value={addProductFormik.values.inputProductCode}
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductCode &&
                            addProductFormik.touched.inputProductCode && (
                              <small>
                                {addProductFormik.errors.inputProductCode}
                              </small>
                            )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="inputProductPrice">
                            Giá gốc (*)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="inputProductPrice"
                            placeholder="Nhập tên sản phẩm...."
                            value={addProductFormik.values.inputProductPrice}
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProduct &&
                            addProductFormik.touched.inputProductPrice && (
                              <small>
                                {addProductFormik.errors.inputProductPrice}
                              </small>
                            )}
                        </div>
                      </div>

                      <div className="col-6 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="inputProductPromotion">
                            Giá khuyến mại{" "}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="inputProductPromotion"
                            placeholder="Nhập giá khuyến mại (nếu có)...."
                            value={
                              addProductFormik.values.inputProductPromotion
                            }
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductPromotion &&
                            addProductFormik.touched.inputProductPromotion && (
                              <small>
                                {addProductFormik.errors.inputProductPromotion}
                              </small>
                            )}
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="inputProductDatePublic"
                            className="col-form-label"
                          >
                            Ngày phát hành (*)
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="inputProductDatePublic"
                            placeholder="Ngày phát hành..."
                            value={
                              addProductFormik.values.inputProductDatePublic ||
                              ""
                            }
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductDatePublic &&
                            addProductFormik.touched.inputProductDatePublic && (
                              <small>
                                {addProductFormik.errors.inputProductDatePublic}
                              </small>
                            )}
                        </div>

                        <div className="form-group row">
                          <label
                            htmlFor="inputProductHot"
                            className="col-12 col-form-label"
                          >
                            Nổi bật ?
                          </label>

                          <div className="col-12 mt-2">
                            <div className="icheck-primary d-inline mr-3">
                              <input
                                type="radio"
                                id="hot"
                                name="inputProductHot"
                                value="true"
                                checked={
                                  addProductFormik.values.inputProductHot ===
                                  "true"
                                }
                                onChange={addProductFormik.handleChange}
                              />
                              <label htmlFor="hot"> Nổi bật </label>
                            </div>
                            <div className="icheck-primary d-inline">
                              <input
                                type="radio"
                                id="noHot"
                                name="inputProductHot"
                                value="false"
                                checked={
                                  addProductFormik.values.inputProductHot ===
                                  "false"
                                }
                                onChange={addProductFormik.handleChange}
                              />
                              <label htmlFor="noHot"> Không nổi bật </label>
                            </div>
                          </div>

                          {addProductFormik.errors.inputProductHot &&
                            addProductFormik.touched.inputProductHot && (
                              <small>
                                {addProductFormik.errors.inputProductHot}
                              </small>
                            )}
                        </div>

                        <div className="form-group row">
                          <div className="col-6">
                            <label htmlFor="inputRating">Đánh giá</label>
                            <input type="number" className="form-control" name="inputRating" placeholder="Nhập đánh giá sản phẩm...." value={addProductFormik.values.inputRating} onChange={addProductFormik.handleChange} />
                          </div>
                          <div className="col-6">
                            <label htmlFor="inputNumberOfRating">Số lần</label>
                            <input type="number" className="form-control" name="inputNumberOfRating" placeholder="Nhập số lần đánh giá sản phẩm...." value={addProductFormik.values.inputNumberOfRating} onChange={addProductFormik.handleChange} />
                          </div>
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="inputFiles">Hình ảnh (*)</label>
                            <div className="input-group">
                            <div className="custom-file">
                              <input
                              type="file"
                              className="custom-file-input"
                              name="inputProductImages"
                              multiple
                              onChange={(e) => {
                                addProductFormik.setFieldValue(
                                "inputProductImages",
                                Array.from(e.target.files)
                                );
                                setFileNames(
                                Array.from(e.target.files).map(file => file.name)
                                );
                                previewFiles(
                                Array.from(e.target.files)
                                );
                              }}
                              />
                              <label
                              className="custom-file-label"
                              htmlFor="inputFile"
                              >
                              {fileNames.join(", ")}
                              </label>
                            </div>
                            <div className="input-group-append">
                              <span className="input-group-text">Upload</span>
                            </div>
                            </div>

                            {addProductFormik.errors.inputProductImages &&
                            addProductFormik.touched.inputProductImages && (
                              <small>
                              {addProductFormik.errors.inputProductImages}
                              </small>
                            )}
                          </div> */}

                        {/* <div>
                          {previewSources.map((source, index) => (
                            <img
                              key={index}
                              src={source}
                              style={{ height: "150px", marginRight: "10px" }}
                              alt={`previewImage-${index}`}
                            />
                          ))}
                        </div> */}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="inputProductDescription">
                            Mô tả sản phẩm
                          </label>
                          <CKEditor
                            name="inputProductDescription"
                            editor={ClassicEditor}
                            data={
                              addProductFormik.values.inputProductDescription
                            }
                            onChange={(e, editor) => {
                              addProductFormik.setFieldValue(
                                "inputProductDescription",
                                editor.getData()
                              );
                            }}
                          />
                          {addProductFormik.errors.inputProductDescription &&
                            addProductFormik.touched
                              .inputProductDescription && (
                              <small>
                                {
                                  addProductFormik.errors
                                    .inputProductDescription
                                }
                              </small>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="row form-group">
                      <label htmlFor="optionValues" className="col-12">Biến thể sản phẩm</label>
                      {optionValueInputs.map((input, index) => (
                        <div className="row form-group col-12 mb-2" style={{ border: "1px solid #ccc", padding: "5px 0px", marginLeft: "5px" }}>
                          <div className="mb-2 col-4">
                            <div className="form-group d-flex">
                              <label className="col-6">
                                Màu sắc
                              </label>
                              <div className="col-6">
                                <select
                                  className="form-control"
                                  value={input.color?._id}
                                  name={`color-${index}`}
                                  onChange={(event) => handleColorChange(index, event)}
                                >
                                  <option value="">Chọn giá trị...</option>
                                  {colors.map((color, idx) => (
                                    <option value={color._id}>
                                      {color.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="col-12">
                                Kích thước
                              </label>
                              <div className="col-12">
                                {sizes.map((size, idx) => (
                                  <div className="form-group row">
                                    <div className="col-6">{size.name}</div>
                                    <div className="col-6">
                                      <input
                                        type="number"
                                        className="form-control"
                                        name={`size-${index}-${idx}`}
                                        placeholder="Số lượng..."
                                        value={input.sizes[idx]?.stock}
                                        onChange={(event) => handleSizeChange(index, idx, event)}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="form-group d-flex">
                              <label className="col-6">Hình ảnh</label>
                              <div className="col-6">
                                <input
                                  type="file"
                                  className="form-control"
                                  name={`images-${index}`}
                                  multiple
                                  onChange={(event) => handleImagesChange(index, event)}
                                />
                              </div>
                            </div>
                            <div className="col-2">
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => deleteOptionValueInput(index)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className="mb-2 col-8">
                            {input.images.map((image, idx) => (
                              <img
                                src={image.url}
                                style={{ height: "150px", marginRight: "10px" }}
                                alt={`previewImage-${index}-${idx}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addOptionValueInput}
                      >
                        <i className="fas fa-plus"></i> Thêm biến thể
                      </button>
                    </div>

                    <div className="card-footer">
                      <button type="submit" className="btn btn-primary">
                        Thêm
                      </button>
                      <button type="reset" className="btn btn-warning">
                        Làm mới
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loader}
    </div>
  );
};

export default ProductAdd;
