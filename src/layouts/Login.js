import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { successToast, errorToast } from "./../components/Toasts/Toasts";
import authAPI from "./../apis/authAPI";
import setCookie from "./../utils/setCookie";
import useFullPageLoader from "../hooks/useFullPageLoader";
import { useHistory } from "react-router";

const Start = () => {
  const history = useHistory();
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Chú ý định dạng email")
        .required("Bắt buộc nhập email"),
      password: Yup.string()
        .min(6, "Mật khẩu ít nhất là 6 kí tự")
        .required("Bắt buộc nhập mật khẩu"),
    }),
    onSubmit: (values) => {
      showLoader();
      try {
        authAPI
          .login(values)
          .then((res) => {
            console.log(res);
            if (res.data.message === "SUCCESS") {
              successToast("Đăng nhập thành công !");
              document.cookie =
                "authAdminToken=;expires = Thu, 01 Jan 1970 00:00:00 GMT";
              document.cookie =
                "currentAdminId=;expires = Thu, 01 Jan 1970 00:00:00 GMT";

              setCookie("authAdminToken", res.data.token, 2, "/");
              setCookie("currentAdminId", res.data.userId, 2, "/");
              // window.location.href = "/dashboard"
              showLoader();
              history.push("/dashboard");
              hideLoader();
            } else if (res.data.message === "PASSWORD_IS_WRONG") {
              hideLoader();
              errorToast("Sai mật khẩu");
              return;
            } else if (res.data.message === "NOT_PERMISSION") {
              hideLoader();
              errorToast("Bạn không có quyền vào trang này");
            } else {
              hideLoader();
              errorToast("Bạn không có tài khoản");
            }
          })
          .catch((err) => {
            hideLoader();
            errorToast("Bạn không có quyền đăng nhập vào trang này");
          });
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <div className="login-page">
        <div className="login-box">
          {/* /.login-logo */}
          <div className="card card-outline card-primary">
            <div className="card-header text-center">
              <a href="/" className="h1">
                DELUCA.VN
              </a>
            </div>
            <div className="card-body">
              <p className="login-box-msg">
                Đăng nhập để bắt đầu phiên làm việc
              </p>
              <form onSubmit={formik.handleSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope" />
                    </div>
                  </div>
                </div>
                <div>
                  {formik.errors.email && formik.touched.email && (
                    <small>{formik.errors.email}</small>
                  )}
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                </div>
                <div className="">
                  {formik.errors.password && formik.touched.password && (
                    <small>{formik.errors.password}</small>
                  )}
                </div>

                <div className="row">
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-block">
                      Đăng nhập
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {loader}
    </>
  );
};

export default Start;
