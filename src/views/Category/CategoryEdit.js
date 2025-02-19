/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import categoryAPI from './../../apis/categoryAPI';
import { successToast, errorToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const CategoryEdit = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();

  const [itemCate, setItemCate] = useState({});
  const [allCate, setAllCate] = useState([]);

  useEffect(() => {
    let id = props.match.params.id;
    showLoader();
    categoryAPI.getCateById(id).then((res) => {
      setItemCate(res.data.data);
      hideLoader();
    }).catch((err) => {
      hideLoader();
      console.log(err);
    });

    categoryAPI.getAllCategories().then((res) => {
      hideLoader();
      setAllCate((res.data.data).filter (v => v._id !== id));
    }).catch((err) => {
      hideLoader();
      console.log(err);
    })
  }, [props.match.params.id]);

  let updateCateFormik = useFormik({
    initialValues: {
      inputCateName: itemCate.c_name,
      inputCateDescription: itemCate.c_description,
      inputParentCate: itemCate.c_parent ? itemCate.c_parent._id : ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputCateName: Yup.string()
        .required("Bắt buộc nhập tên danh mục !")
        .max(100, "Tên danh mục nhỏ hơn 100 kí tự")
    }),
    onSubmit: (values) => {
      let data = {
        c_name: values.inputCateName,
        c_description: values.inputCateDescription,
        c_parent: values.inputParentCate
      };
      showLoader();
      categoryAPI.updateCateById(props.match.params.id, data).then((res) => {
        if (res.data.message === 'CATEGORY_NOT_FOUND') {
          hideLoader();
          errorToast("Danh mục không tồn tại !");
        }
        if (res.data.message === 'CATEGORY_EXISTS') {
          hideLoader();
          errorToast("Danh mục đã tồn tại !");
        }
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Cập nhật danh mục thành công !");
          history.push({ pathname: '/categories' });
        }
      }).catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
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
              <h1>Cập nhật danh mục</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                              </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/categories" >
                    Danh mục
                              </Link>
                </li>
                <li className="breadcrumb-item active">Cập nhật danh mục</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content" >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* general form elements */}
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Cập nhật</h3>
                </div>
                {/* /.card-header */}
                {/* form start */}
                <form onSubmit={updateCateFormik.handleSubmit}>
                  <div className="card-body">

                    <div className="form-group">
                      <label htmlFor="inputParentCate">Danh mục cha (*)</label>
                      <select className="form-control" name="inputParentCate"
                        value={updateCateFormik.values.inputParentCate || ''}
                        onChange={updateCateFormik.handleChange}
                      >
                      
                        {
                          itemCate.c_parent === undefined ? (<option value="">Chọn danh mục cha....</option>) : (
                            allCate.map((v, i) => {
                              return (
                                <option key={i} value={ v._id }
                                selected={ itemCate.c_parent._id === v._id ? true : false } > { v.c_name } </option>
                              )
                            })
                          )
                        }

                        {
                          itemCate.c_parent === undefined ? (
                            allCate.map((v, i) => {
                              return (
                                <option key={i} value={ v._id } > { v.c_name } </option>
                              )
                            })
                          ) : ''
                        }
                      </select>

                      {updateCateFormik.errors.inputParentCate && updateCateFormik.touched.inputParentCate && (
                        <small className="active-error" >{updateCateFormik.errors.inputParentCate}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="inputCateName">Tên danh mục (*)</label>
                      <input type="text" className="form-control" name="inputCateName" placeholder="Nhập tên danh mục...."
                        value={updateCateFormik.values.inputCateName || ''}
                        onChange={updateCateFormik.handleChange}
                      />
                      {updateCateFormik.errors.inputCateName && updateCateFormik.touched.inputCateName && (
                        <small className="active-error" >{updateCateFormik.errors.inputCateName}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="inputCateDescription">Mô tả </label>
                      <CKEditor
                        name="inputCateDescription"
                        editor={ClassicEditor}
                        data={updateCateFormik.values.inputCateDescription || ''}
                        onChange={(e, editor) => {
                          updateCateFormik.setFieldValue("inputCateDescription", editor.getData())
                        }}
                      />

                      {updateCateFormik.errors.inputCateDescription && updateCateFormik.touched.inputCateDescription && (
                        <small className="active-error" >{updateCateFormik.errors.inputCateDescription}</small>
                      )}
                    </div>
                  </div>
                  {/* /.card-body */}
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
      { loader }
    </div>
  )
}


export default CategoryEdit;
