import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const successToast = (content) => toast.success(content);

const errorToast = (content) => toast.error(content);

const ToastProvider = ({ children }) => {
  return (
    <div>
      {children}
      <ToastContainer autoClose={2000} draggable={false} position="top-right" />
    </div>
  );
};

export { successToast, errorToast, ToastProvider };
