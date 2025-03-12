import React from "react";
import "./App.css";
import { Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import Admin from "./layouts/Admin";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import Login from "./layouts/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import Userprofile from "./views/Userprofile/Userprofile";
import Category from "./views/Category/Category";
import CategoryAdd from "./views/Category/CategoryAdd";
import CategoryEdit from "./views/Category/CategoryEdit";
import Product from "./views/Product/Product";
import ProductAdd from "./views/Product/ProductAdd";
import ProductEdit from "./views/Product/ProductEdit";
import Author from "./views/Author/Author";
import AuthorAdd from "./views/Author/AuthorAdd";
import AuthorEdit from "./views/Author/AuthorEdit";
import Company from "./views/Company/Company";
import CompanyAdd from "./views/Company/CompanyAdd";
import CompanyEdit from "./views/Company/CompanyEdit";
import Staff from "./views/Staff/Staff";
import StaffAdd from "./views/Staff/StaffAdd";
import StaffEdit from "./views/Staff/StaffEdit";
import Customer from "./views/Customer/Customer";
import Comment from "./views/Comment/Comment";
import Banner from "./views/Banner/Banner";
import BannerAdd from "./views/Banner/BannerAdd";
import BannerEdit from "./views/Banner/BannerEdit";
import Order from "./views/Order/Order";
import NotFound from "./views/NotFound/NotFound";
import Invoice from "./views/Invoice/Invoice";
import Color from "./views/Color/Color";
import Size from "./views/Size/Size";
import { ToastProvider } from "./components/Toasts/Toasts";

const hist = createBrowserHistory();

const App = () => {
  return (
    <Router history={hist}>
      <ToastProvider />
      <Switch>
        <PublicRoute exact path="/" component={Login} />
        <PrivateRoute
          exact
          path="/dashboard"
          component={Dashboard}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/profile"
          component={Userprofile}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/categories"
          component={Category}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/categories/add"
          component={CategoryAdd}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/categories/edit/:id"
          component={CategoryEdit}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/colors"
          component={Color}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/sizes"
          component={Size}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/products"
          component={Product}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/products/add"
          component={ProductAdd}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/products/edit/:id"
          component={ProductEdit}
          layout={Admin}
        />
        <PrivateRoute exact path="/authors" component={Author} layout={Admin} />
        <PrivateRoute
          exact
          path="/authors/add"
          component={AuthorAdd}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/authors/edit/:id"
          component={AuthorEdit}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/companies"
          component={Company}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/companies/add"
          component={CompanyAdd}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/companies/edit/:id"
          component={CompanyEdit}
          layout={Admin}
        />
        <PrivateRoute exact path="/staffs" component={Staff} layout={Admin} />
        <PrivateRoute
          exact
          path="/staffs/add"
          component={StaffAdd}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/staffs/edit/:id"
          component={StaffEdit}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/customers"
          component={Customer}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/comments"
          component={Comment}
          layout={Admin}
        />
        <PrivateRoute exact path="/banners" component={Banner} layout={Admin} />
        <PrivateRoute
          exact
          path="/banners/add"
          component={BannerAdd}
          layout={Admin}
        />
        <PrivateRoute
          exact
          path="/banners/edit/:id"
          component={BannerEdit}
          layout={Admin}
        />
        <PrivateRoute exact path="/orders" component={Order} layout={Admin} />
        <PrivateRoute
          exact
          path="/invoice"
          component={Invoice}
          layout={Admin}
        />
        <PrivateRoute component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
