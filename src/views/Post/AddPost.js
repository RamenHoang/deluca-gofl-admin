import React, { useState, useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Link, useHistory } from 'react-router-dom';
import postAPI from '../../apis/postAPI';
import categoryAPI from '../../apis/categoryAPI';
import { errorToast, successToast } from "../../components/Toasts/Toasts";
import useFullPageLoader from "../../hooks/useFullPageLoader";

const AddPost = () => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: '',
    published: true
  });

  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [categories, setCategories] = useState([]);
  const history = useHistory();
  const fileInputRef = useRef(null);

  useEffect(() => {
    showLoader();
    categoryAPI.getAllCategories()
      .then(response => {
        setCategories(response.data.data);
        hideLoader();
      })
      .catch(error => {
        console.log(error);
        hideLoader();
        errorToast("Lấy danh mục thất bại !");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setPost({
      ...post,
      [name]: name === 'published' ? checked : value
    });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setPost({
      ...post,
      content: data
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('file', file);
      showLoader();
      postAPI.upload(formData)
        .then(response => {
          successToast("Upload ảnh bìa thành công !");
          setFeaturedImage(response.data.image._id);
          hideLoader();
        })
        .catch(error => {
          console.log(error);
          errorToast("Upload ảnh bìa thất bại !");
          hideLoader();
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
            showLoader();
            postAPI.upload(formData)
              .then(response => {
                hideLoader();
                resolve({
                  default: response.data.image.url
                });
              })
              .catch(error => {
                console.log(error);
                hideLoader();
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

    try {
      const formData = {};
      formData['title'] = post.title;
      formData['content'] = post.content;
      formData['category'] = post.category;
      formData['tags'] = post.tags;
      formData['published'] = post.published;

      if (featuredImage) {
        formData['featuredImage'] = featuredImage;
      }

      showLoader();
      await postAPI.createPost(formData);
      successToast("Thêm tin tức thành công !");
      history.push({ pathname: "/posts" });
    } catch (error) {
      errorToast("Thêm tin tức thất bại !");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thêm tin tức</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Thêm tin tức</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>
      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>Tiêu đề</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={post.title}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nội dung bài viết</label>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfiguration}
                  data={post.content}
                  onChange={handleEditorChange}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem' }}>Danh mục</label>
                <select
                  id="category"
                  name="category"
                  value={post.category}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.c_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Ảnh bìa</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid #1976d2', borderRadius: '4px', color: '#1976d2', cursor: 'pointer', marginBottom: '1rem' }}
                >
                  Chọn ảnh bìa
                </button>

                {imagePreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>

              {/* <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={post.published}
                    onChange={handleChange}
                    name="published"
                    style={{ marginRight: '0.5rem' }}
                  />
                  Xuất bản
                </label>
              </div> */}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Lưu bài viết
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      {loader}
    </div>
  );
};

export default AddPost;
