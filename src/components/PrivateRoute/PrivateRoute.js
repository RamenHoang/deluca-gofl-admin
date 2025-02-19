import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import getCookie from './../../utils/getCookie';

const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {
  const token = getCookie('authAdminToken');

  return (
    <Route
      {...rest}
      render={(props) => (

        token ? (
          <Layout {...props} >
            <Component {...props} />
          </Layout>
        ) : (<Redirect to='/' />)

      )}
    />
  )
}

export default PrivateRoute;
