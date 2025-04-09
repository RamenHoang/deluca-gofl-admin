/* eslint-disable */
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import productAPI from './../../apis/productAPI';
import colorAPI from "./../../apis/colorAPI";
import sizeAPI from "./../../apis/sizeAPI";
import categoryAPI from './../../apis/categoryAPI';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const ProductEdit = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();
  const [productItem, setProductItem] = useState({});
  const [cate, setCate] = useState([]);
  const [optionValueInputs, setOptionValueInputs] = useState([{ color: null, sizes: [], images: [] }]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sizeChart, setSizeChart] = useState(null);

  useEffect(() => {
    let id = props.match.params.id;
    showLoader();
    productAPI.getProductById(id).then((res) => {
      setProductItem(res.data.data);
      setOptionValueInputs(res.data.data.variants);
      setSizeChart(res.data.data.sizeChart);
      hideLoader();
    }).catch((err) => {
      errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      hideLoader();
    });
    categoryAPI
      .getAllCategories()
      .then((res) => {
        setCate(res.data.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
        hideLoader();
      });

    colorAPI
      .getAll()
      .then((res) => {
        setColors(res.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
        hideLoader();
      });

    sizeAPI
      .getAll()
      .then((res) => {
        setSizes(res.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
        hideLoader();
      });
  }, [props.match.params.id]);

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

  const moveImageUp = (variantIndex, imageIndex) => {
    if (imageIndex === 0) return; // Already at the top

    const values = [...optionValueInputs];
    const images = [...values[variantIndex].images];

    // Swap with previous image
    const temp = images[imageIndex];
    images[imageIndex] = images[imageIndex - 1];
    images[imageIndex - 1] = temp;

    values[variantIndex].images = images;
    setOptionValueInputs(values);
  };

  const moveImageDown = (variantIndex, imageIndex) => {
    const values = [...optionValueInputs];
    const images = values[variantIndex].images;

    if (imageIndex === images.length - 1) return; // Already at the bottom

    // Swap with next image
    const temp = images[imageIndex];
    images[imageIndex] = images[imageIndex + 1];
    images[imageIndex + 1] = temp;

    values[variantIndex].images = images;
    setOptionValueInputs(values);
  };

  const handleUploadSizeChart = (event) => {
    showLoader();
    let formData = new FormData();
    Array.from(event.target.files).forEach((file) => {
      formData.append("variant_images", file);
    });

    productAPI
      .uploadImages(formData)
      .then((res) => {
        setSizeChart(res.data.images[0]);
        hideLoader();
      })
      .catch((err) => {
        hideLoader();
        console.log(err);
      });
  };

  const handleCategoryChange = (categoryId) => {
    const currentCategories = [...updateProductFormik.values.inputCateName];
    const categoryIndex = currentCategories.indexOf(categoryId);

    if (categoryIndex === -1) {
      // Add category if not selected
      currentCategories.push(categoryId);
    } else {
      // Remove category if already selected
      currentCategories.splice(categoryIndex, 1);
    }

    updateProductFormik.setFieldValue('inputCateName', currentCategories);
  };

  let updateProductFormik = useFormik({
    initialValues: {
      inputCateName: productItem.category ? productItem.category.map(cat => cat._id) : [],
      inputProductName: productItem.p_name,
      inputProductCode: productItem.p_code,
      inputProductHot: productItem.p_hot,
      inputProductPrice: productItem.p_price,
      inputProductPromotion: productItem.p_promotion,
      inputProductDatePublic: productItem.p_datepublic,
      inputProductDescription: productItem.p_description,
      inputRating: productItem.rating || 0,
      inputNumberOfRating: productItem.number_of_rating || 0
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputCateName: Yup.array()
        .min(1, "Bắt buộc chọn ít nhất một danh mục !")
        .required("Bắt buộc chọn danh mục !"),
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
      inputProductDatePublic: Yup.string()
        .required("Bắt buộc chọn ngày phát hành !")
    }),
    onSubmit: (values) => {
      let formData = {
        "p_name": values.inputProductName,
        "p_code": values.inputProductCode,
        "p_price": values.inputProductPrice,
        "p_promotion": values.inputProductPromotion,
        "p_quantity": productItem.p_quantity,
        "p_datepublic": values.inputProductDatePublic,
        "p_description": values.inputProductDescription,
        "category": values.inputCateName,
        "p_hot": values.inputProductHot,
        "rating": values.inputRating,
        "number_of_rating": values.inputNumberOfRating,
        "variants": optionValueInputs.map((value) => {
          return {
            color: value.color,
            sizes: value.sizes,
            images: value.images.map(image => image._id)
          }
        }),
        "sizeChart": sizeChart,
      };

      showLoader();
      productAPI.updateProductById(props.match.params.id, formData).then((res) => {
        if (res.data.message === 'PRODUCT_NOT_FOUND') {
          hideLoader();
          errorToast("Sản phẩm không tồn tại");
        }
        if (res.data.message === 'DESTROY_IMAGE_FAILED') {
          hideLoader();
          errorToast("Xóa ảnh thất bại, kiểm tra đường truyền mạng");
        }

        if (res.data.message === 'UPLOAD_FAILED') {
          hideLoader();
          errorToast("Cập nhật ảnh thất bại, kiểm tra đường truyền mạng");
        }

        if (res.data.message === 'EXISTS_CODE') {
          hideLoader();
          errorToast("Mã sản phẩm đã tồn tại");
        }

        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Cập nhật sản phẩm thành công !");
          history.push({ pathname: '/products' });
        }
      }).catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại");
      })
    }
  });

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Cập nhật sản phẩm</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/products">
                    Sản phẩm
                  </Link>
                </li>
                <li className="breadcrumb-item active">Cập nhật sản phẩm</li>
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
                  <h3 className="card-title">Cập nhật</h3>
                </div>

                <form onSubmit={updateProductFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6 col-sm-6">

                        <div className="form-group">
                          <label htmlFor="inputCateName">Danh mục (*)</label>
                          <div className="category-checkboxes">
                            {cate.map((value, index) => (
                              <div className="form-check" key={index}>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`category-${value._id}`}
                                  checked={updateProductFormik.values.inputCateName.includes(value._id)}
                                  onChange={() => handleCategoryChange(value._id)}
                                />
                                <label className="form-check-label" htmlFor={`category-${value._id}`}>
                                  {value.c_name}
                                </label>
                              </div>
                            ))}
                          </div>

                          {updateProductFormik.errors.inputCateName &&
                            updateProductFormik.touched.inputCateName && (
                              <small className="active-error">
                                {updateProductFormik.errors.inputCateName}
                              </small>
                            )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductName">Tên sản phẩm (*)</label>
                          <input type="text" className="form-control" name="inputProductName" placeholder="Nhập tên sản phẩm...."
                            value={updateProductFormik.values.inputProductName || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                          {updateProductFormik.errors.inputProductName && updateProductFormik.touched.inputProductName && (
                            <small className="active-error">{updateProductFormik.errors.inputProductName}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductCode">Mã sản phẩm (*)</label>
                          <input type="text" className="form-control" name="inputProductCode" placeholder="Nhập mã sản phẩm...."
                            value={updateProductFormik.values.inputProductCode || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                          {updateProductFormik.errors.inputProductCode && updateProductFormik.touched.inputProductCode && (
                            <small className="active-error">{updateProductFormik.errors.inputProductCode}</small>
                          )}

                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductPrice">Giá bìa sản phẩm (*)</label>
                          <input type="number" className="form-control" name="inputProductPrice" placeholder="Nhập giá bìa sản phẩm...."
                            value={updateProductFormik.values.inputProductPrice || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                          {updateProductFormik.errors.inputProductPrice && updateProductFormik.touched.inputProductPrice && (
                            <small className="active-error">{updateProductFormik.errors.inputProductPrice}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="">Sizechart</label>
                          <div className="">
                            <input
                              type="file"
                              className="form-control"
                              name={`sizechart`}
                              multiple
                              onChange={(event) => handleUploadSizeChart(event)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputProductPromotion">Giá khuyến mại (nếu có)</label>
                          <input type="number" className="form-control" name="inputProductPromotion" placeholder="Nhập giá khuyến mại...."
                            value={updateProductFormik.values.inputProductPromotion || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                          {updateProductFormik.errors.inputProductPromotion && updateProductFormik.touched.inputProductPromotion && (
                            <small className="active-error">{updateProductFormik.errors.inputProductPromotion}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductDatePublic" className="col-form-label">Ngày phát hành (*)</label>
                          <input type="date" className="form-control" name="inputProductDatePublic" placeholder="Ngày phát hành..."
                            value={updateProductFormik.values.inputProductDatePublic || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                        </div>
                        <div className="form-group row">
                          <label htmlFor="inputProductHot" className="col-12 col-form-label">Nổi bật ?</label>

                          <div className="col-12 mt-2">
                            <div className="icheck-primary d-inline mr-3">
                              <input type="radio" id="hot" name="inputProductHot" value="true"
                                checked={updateProductFormik.values.inputProductHot === "true" || ''}
                                onChange={updateProductFormik.handleChange}
                              />
                              <label htmlFor="hot"> Nổi bật </label>
                            </div>
                            <div className="icheck-primary d-inline">
                              <input type="radio" id="noHot" name="inputProductHot" value="false"
                                checked={updateProductFormik.values.inputProductHot === "false" || ''}
                                onChange={updateProductFormik.handleChange}
                              />
                              <label htmlFor="noHot"> Không nổi bật </label>
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-6">
                            <label htmlFor="inputRating">Đánh giá</label>
                            <input type="number" className="form-control" name="inputRating" placeholder="Nhập đánh giá sản phẩm...." value={updateProductFormik.values.inputRating} onChange={updateProductFormik.handleChange} />
                          </div>
                          <div className="col-6">
                            <label htmlFor="inputNumberOfRating">Số lần</label>
                            <input type="number" className="form-control" name="inputNumberOfRating" placeholder="Nhập số lần đánh giá sản phẩm...." value={updateProductFormik.values.inputNumberOfRating} onChange={updateProductFormik.handleChange} />
                          </div>
                        </div>

                        <div className="mb-2 col-8">
                          <img
                            src={sizeChart ? sizeChart.url : ""}
                            style={{ height: "150px", marginRight: "10px" }}
                            alt={"size-chart"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-12">
                        <label htmlFor="inputProductDescription">Mô tả sản phẩm</label>
                        <CKEditor
                          name="inputProductDescription"
                          editor={ClassicEditor}
                          data={updateProductFormik.values.inputProductDescription}
                          onChange={(e, editor) => {
                            updateProductFormik.setFieldValue("inputProductDescription", editor.getData())
                          }}
                        />
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
                              <div key={`image-${index}-${idx}`} style={{ display: "inline-block", position: "relative", marginRight: "10px" }}>
                                <img
                                  src={image.url}
                                  style={{ height: "150px" }}
                                  alt={`previewImage-${index}-${idx}`}
                                />
                                <div style={{ position: "absolute", top: 0, right: 0 }}>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => moveImageUp(index, idx)}
                                    disabled={idx === 0}
                                  >
                                    <i className="fas fa-arrow-up"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => moveImageDown(index, idx)}
                                    disabled={idx === input.images.length - 1}
                                  >
                                    <i className="fas fa-arrow-down"></i>
                                  </button>
                                </div>
                              </div>
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
                  </div>

                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                    <button type="reset" className="btn btn-warning">Làm mới</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loader}
    </div>
  )
}

export default ProductEdit;
