import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { errorToast } from '../../components/Toasts/Toasts';
import authorAPI from './../../apis/authorAPI';

const AuthorEdit = (props) => {

  const [itemAuthor, setItemAuthor] = useState({});

  useEffect(() => {
    let id = props.match.params.id;
    authorAPI.getAuthorById(id).then((res) => {
      setItemAuthor(res.data.data);
    }).catch((err) => {
      errorToast("Có lỗi xảy ra, vui lòng thử lại");
    });

  }, [props.match.params.id]);

  let updateAuthorFormik = useFormik({
    initialValues: {
      inputAuthorName: itemAuthor.a_name,
      inputAuthorInfo: itemAuthor.a_info
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputAuthorName: Yup.string()
        .required("Bắt buộc nhập tên tác giả !")
        .max(100, "Tên quá dài, nhỏ hơn 100 kí tự")
    }),
    onSubmit: (values) => {
      console.log(values);
    }
  })

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Cập nhật tác giả</h1>
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
                <li className="breadcrumb-item active">Cập nhật tác giả</li>
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
                  <h3 className="card-title">Cập nhật</h3>
                </div>

                <form onSubmit={updateAuthorFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputAuthorName">Tên tác giả (*)</label>
                          <input type="text" className="form-control" name="inputAuthorName" placeholder="Nhập tên tác giả..."
                            value={updateAuthorFormik.values.inputAuthorName || ''}
                            onChange={updateAuthorFormik.handleChange}
                          />
                          {updateAuthorFormik.errors.inputAuthorName && updateAuthorFormik.touched.inputAuthorName && (
                            <small className="active-error" >{updateAuthorFormik.errors.inputAuthorName}</small>
                          )}
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputAuthorInfo">Thông tin thêm</label>
                          <CKEditor
                            name="inputAuthorInfo"
                            editor={ClassicEditor}
                            data={updateAuthorFormik.values.inputAuthorInfo}
                            onChange={(e, editor) => {
                              updateAuthorFormik.setFieldValue("inputAuthorInfo", editor.getData())
                            }}
                          />
                          {updateAuthorFormik.errors.inputAuthorInfo && updateAuthorFormik.touched.inputAuthorInfo && (
                            <small className="active-error" >{updateAuthorFormik.errors.inputAuthorInfo}</small>
                          )}
                        </div>
                      </div>
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

    </div>
  )
}

export default AuthorEdit;
