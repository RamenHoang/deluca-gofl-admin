/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import postAPI from "./../../apis/postAPI";
import categoryAPI from "../../apis/categoryAPI";
import { errorToast, successToast } from "./../../components/Toasts/Toasts";
import useFullPageLoader from "./../../hooks/useFullPageLoader";

const EditPost = () => {
  const { id } = useParams();
  const history = useHistory();
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [previewImage, setPreviewImage] = useState("");
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);
  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "",
    published: false,
    featuredImage: ""
  });

  useEffect(() => {
    showLoader();

    // Fetch categories
    categoryAPI.getAllCategories()
      .then(response => {
        setCategories(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });

    // Fetch post data
    postAPI
      .getPostById(id)
      .then((res) => {
        if (res.data.message === "SUCCESS" && res.data.post) {
          const postData = res.data.post;
          setPost({
            title: postData.title,
            content: postData.content,
            category: postData.category._id,
            published: postData.published,
            featuredImage: postData.featuredImage._id
          });
          setPreviewImage(postData.featuredImage.url);
          hideLoader();
        } else {
          errorToast("Không tìm thấy bài viết!");
          history.push("/posts");
          hideLoader();
        }
      })
      .catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại!");
        history.push("/posts");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setPost((prevPost) => ({
      ...prevPost,
      content: data
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('file', file);
      postAPI.upload(formData)
        .then(response => {
          successToast("Upload ảnh bìa thành công !");
          setPost((prevPost) => ({
            ...prevPost,
            featuredImage: response.data.image._id
          }));
        })
        .catch(error => {
          console.log(error);
          errorToast("Upload ảnh bìa thất bại !");
        });
    }
  };

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then((file) => {
            formData.append('file', file);

            postAPI.upload(formData)
              .then(response => {
                resolve({
                  default: response.data.image.url
                });
              })
              .catch(error => {
                reject(error);
              });
          });
        });
      }
    };
  };

  const editorConfiguration = {
    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'alignment', '|', 'imageUpload', 'blockQuote', 'insertTable', 'undo', 'redo'],
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'],
      styles: ['alignLeft', 'alignCenter', 'alignRight']
    },
    extraPlugins: [
      function (editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return uploadAdapter(loader);
        };
      }
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title.trim()) {
      errorToast("Vui lòng nhập tiêu đề bài viết!");
      return;
    }

    if (!post.content.trim()) {
      errorToast("Vui lòng nhập nội dung bài viết!");
      return;
    }

    if (!post.category) {
      errorToast("Vui lòng chọn danh mục bài viết!");
      return;
    }

    if (!post.featuredImage) {
      errorToast("Vui lòng chọn ảnh bìa cho bài viết!");
      return;
    }

    showLoader();
    try {
      // Prepare post data
      const postData = {
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        published: post.published,
        featuredImage: post.featuredImage,
      };

      const res = await postAPI.updatePostById(id, postData);
      if (res.data.message === "SUCCESS") {
        hideLoader();
        successToast("Cập nhật bài viết thành công!");
        history.push("/posts");
      } else {
        hideLoader();
        errorToast("Cập nhật bài viết thất bại!");
      }
    } catch (error) {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Chỉnh sửa bài viết</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/posts">Bài viết</Link>
                </li>
                <li className="breadcrumb-item active">Chỉnh sửa bài viết</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">Thông tin bài viết</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="title">Tiêu đề</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        placeholder="Nhập tiêu đề bài viết"
                        value={post.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="category">Danh mục</label>
                      <select
                        id="category"
                        name="category"
                        className="form-control"
                        value={post.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>{category.c_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="content">Nội dung bài viết</label>
                      <CKEditor
                        editor={ClassicEditor}
                        config={editorConfiguration}
                        data={post.content}
                        onChange={handleEditorChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Ảnh bìa</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="btn btn-outline-secondary btn-block"
                      >
                        Chọn ảnh bìa
                      </button>

                      {previewImage && (
                        <div className="mt-2">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      )}
                    </div>

                    {/* <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="published"
                        name="published"
                        checked={post.published}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="published">
                        Xuất bản ngay
                      </label>
                    </div> */}
                  </div>

                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">
                      Cập nhật
                    </button>
                    <Link to="/posts" className="btn btn-secondary ml-2">
                      Hủy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      {loader}
    </div>
  );
};

export default EditPost;
