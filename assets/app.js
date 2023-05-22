/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React, { useContext, useState } from 'react';
import  ReactDOM  from 'react-dom';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
// start the Stimulus application
import './bootstrap';
import Navbar from './js/components/Navbar/Navbar';
import HomePage from './js/pages/HomePage';
import { HashRouter,Switch,Route,withRouter,Redirect } from 'react-router-dom/cjs/react-router-dom';
import CustomersPage from './js/pages/CustomersPage';
import InvoicesPage from './js/pages/InvoicesPage';
import LoginPage from './js/pages/LoginPage';
import {setup , isUserAuthenticated} from './js/services/Setup';
import AuthContext from './js/context/AuthContext';
import PrivateRoute from './js/components/PrivateRoute/PrivateRoute';
import CustomerPage from './js/pages/CustomerPage';
import InvoicePages from './js/pages/InvoicePages';
import FileDownload from './js/pages/FileDownload';

setup();

const NavBarWithRouter = withRouter(Navbar);
const App = () =>{
    const [isAuthenticated,setIsAuthenticated] = useState(isUserAuthenticated());
    return  (
        <AuthContext.Provider value={{isAuthenticated,setIsAuthenticated}}>
        <HashRouter>
            <NavBarWithRouter/>
            <Switch>
                <Route path="/login" component = {LoginPage}  />
                <PrivateRoute path="/customer/:id" component={CustomerPage} />
                <PrivateRoute path="/customers" component={CustomersPage} />
                <PrivateRoute path="/invoice/:id" component={InvoicePages} />
                <PrivateRoute path="/invoices" component={InvoicesPage} />
                <Route path="/" component={HomePage}/>
            </Switch>
        </HashRouter>

        </AuthContext.Provider>
    )
}
const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>,rootElement);
