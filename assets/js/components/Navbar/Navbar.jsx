import React, { useContext } from 'react';
import Axios from 'axios';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { logout } from '../../services/Logout';
import AuthContext from '../../context/AuthContext';




const  Navbar = ({ history}) => {
    const {isAuthenticated,setIsAuthenticated} = useContext(AuthContext);
    const handleLogout = () =>{

        // window.localStorage.removeItem('token');
        // delete Axios.defaults.headers['Authorisation'];
        logout();
        setIsAuthenticated(false);
        history.push('/login');
    }
    console.log(history);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">SymReact</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                    <NavLink className="nav-link active" to="/">Accueil
                        <span className="visually-hidden">(current)</span>
                    </NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className="nav-link" to="customers">Clients</NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className="nav-link" to="/invoices">Factures</NavLink>
                    </li>

                </ul>
                <ul className="navbar-nav ms-auto ">
                    {isAuthenticated ? 
                    
                        <li className="nav-item me-2 mb-2 mb-md-0"><button className=" btn btn-danger btn-sm" onClick={() => handleLogout()}>Deconnexion</button></li>
                    
                    :
                    <>
                        <li className="nav-item"><NavLink className='btn btn-success btn-sm' to="/register">Inscription</NavLink></li>
                        <li className="nav-item me-2 mb-2 mb-md-0"><NavLink className=' btn btn-primary btn-sm' to="/login"> Connexion</NavLink></li>
                    </>
                    }
                </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;