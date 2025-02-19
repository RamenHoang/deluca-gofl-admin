import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import authorAPI from './../../apis/authorAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const AuthorAdd = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();

  let authorFormik = useFormik({
    initialValues: {
      inputAuthorName: '',
      inputAuthorInfo: ''
    },
    validationSchema: Yup.object({
      inputAuthorName: Yup.string()
        .required("Bắt buộc nhập tên tác giả !")
        .max(100, "Tên quá dài, nhỏ hơn 100 kí tự"),
    }),
    onSubmit: (values) => {

      let data = {
        a_name: values.inputAuthorName,
        a_info: values.inputAuthorInfo
      }

      showLoader();
      authorAPI.addNewAuthor(data).then((res) => {
        if (res.data.message === 'AUTHOR_EXISTS') {
          hideLoader();
          errorToast("Tác giả đã tồn tại");
        }
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Thêm tác giả thành công");
          history.push({ pathname: '/authors' });
        }
      }).catch(err => {
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
              <h1>Thêm tác giả</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                            </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/authors" >
                    Tác giả
                            </Link>
                </li>
                <li className="breadcrumb-item active">Thêm tác giả</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content" >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary">

                <div className="card-header">
                  <h3 className="card-title">Thêm</h3>
                </div>

                <form onSubmit={authorFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-5 col-sm-5">

                        <div className="form-group">
                          <label htmlFor="inputAuthorName">Tên tác giả (*)</label>
                          <input type="text" className="form-control" name="inputAuthorName" placeholder="Nhập tên tác giả..."
                            value={authorFormik.values.inputAuthorName}
                            onChange={authorFormik.handleChange}
                          />
                          {authorFormik.errors.inputAuthorName && authorFormik.touched.inputAuthorName && (
                            <small className="active-error" >{authorFormik.errors.inputAuthorName}</small>
                          )}
                        </div>

                      </div>

                      <div className="col-7 col-sm-7">
                        <div className="form-group">
                          <label htmlFor="inputAuthorInfo">Thông tin thêm</label>
                          <CKEditor
                            name="inputAuthorInfo"
                            editor={ClassicEditor}
                            data={authorFormik.values.inputAuthorInfo}
                            onChange={(e, editor) => {

                              authorFormik.setFieldValue("inputAuthorInfo", editor.getData())
                            }}
                          />
                          {authorFormik.errors.inputAuthorInfo && authorFormik.touched.inputAuthorInfo && (
                            <small  className="active-error" >{authorFormik.errors.inputAuthorInfo}</small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">Thêm</button>
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

export default AuthorAdd;
