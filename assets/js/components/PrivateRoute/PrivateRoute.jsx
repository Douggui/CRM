import React, { useContext } from 'react';
import {Redirect , Route} from 'react-router-dom/cjs/react-router-dom';
import AuthContext from '../../context/AuthContext';


 const  PrivateRoute = ({path,component}) =>{
    const {isAuthenticated} = useContext(AuthContext);
    return isAuthenticated ? 
    <Route path={path} component={component} /> : 
    <Redirect to='/login' />
}
export default PrivateRoute