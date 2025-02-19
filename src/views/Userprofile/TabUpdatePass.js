/* eslint-disable */
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import getCookie from './../../utils/getCookie';
import { successToast, errorToast } from './../../components/Toasts/Toasts';
import userAPI from './../../apis/userAPI';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const TabUpdatePass = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();

  const updatePassFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      reNewPassword: ''
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 kí tự")
        .max(20, "Mật khẩu dài nhất là 20 kí tự")
        .required("Bắt buộc nhập mật khẩu"),
      newPassword: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 kí tự")
        .max(20, "Mật khẩu dài nhất là 20 kí tự")
        .required("Bắt buộc nhập mật khẩu"),
      reNewPassword: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 kí tự")
        .max(20, "Mật khẩu dài nhất là 20 kí tự")
        .required("Bắt buộc nhập mật khẩu")
        .oneOf([Yup.ref("newPassword")], "Mật khẩu phải trùng nhau")
    }),
    onSubmit: (values, { resetForm }) => {
      values = {
        ...values,
        id: getCookie('currentAdminId')
      };

      showLoader();
      userAPI.updatePassword(values).then((res) => {
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Thay đổi mật khẩu thành công");
          resetForm({ values: '' });
        }
        if (res.data.message === 'PASSWORD_IS_WRONG') {
          hideLoader();
          errorToast("Sai mật khẩu cũ");
        }
        if (res.data.message === 'USER_NOT_FOUND') {
          hideLoader();
          errorToast("Tài khoản không tồn tại");
        }
      }).catch(err => {
        errorToast("Có lỗi xảy ra, vui lòng thử lại sau");
        hideLoader();
      })
    }
  })

  return (
    <div className="tab-pane" id="updatePassword">
      <form className="form-horizontal" onSubmit={updatePassFormik.handleSubmit}>

        <div className="form-group row">
          <label htmlFor="inputOldPassword" className="col-sm-2 col-form-label">Mật khẩu cũ</label>
          <div className="col-sm-10">
            <input type="password" className="form-control" name="oldPassword" placeholder="Nhập mật khẩu cũ..."
              value={updatePassFormik.values.oldPassword}
              onChange={updatePassFormik.handleChange} />

            {updatePassFormik.errors.oldPassword && updatePassFormik.touched.oldPassword && (
              <small>{updatePassFormik.errors.oldPassword}</small>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputNewPassword" className="col-sm-2 col-form-label">Mật khẩu mới</label>
          <div className="col-sm-10">
            <input type="password" className="form-control" name="newPassword" placeholder="Nhập mật khẩu mới...."
              value={updatePassFormik.values.newPassword}
              onChange={updatePassFormik.handleChange} />

            {updatePassFormik.errors.newPassword && updatePassFormik.touched.newPassword && (
              <small>{updatePassFormik.errors.newPassword}</small>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputReNewPassword" className="col-sm-2 col-form-label">Mật khẩu mới</label>
          <div className="col-sm-10">
            <input type="password" className="form-control" name="reNewPassword" placeholder="Nhập lại mật khẩu mới..."
              value={updatePassFormik.values.reNewPassword}
              onChange={updatePassFormik.handleChange} />

            {updatePassFormik.errors.reNewPassword && updatePassFormik.touched.reNewPassword && (
              <small>{updatePassFormik.errors.reNewPassword}</small>
            )}
          </div>
        </div>

        <div className="form-group row">
          <div className="offset-sm-2 col-sm-10">
            <button type="submit" className="btn btn-danger">Xác nhận</button>
          </div>
        </div>
      </form>
      { loader}
    </div>
  );
}

export default TabUpdatePass;
