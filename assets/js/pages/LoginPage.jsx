import Axios from "axios";
import React, { useContext, useState } from "react";
import config from'../config';
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/AuthContext";
const LoginPage = ({history}) => {
    const {isAuthenticated , setIsAuthenticated} = useContext(AuthContext);
    const [credentials,setCredentials] = useState({
        "username":"",
        "password":""
    });
    const [badCredentials,setBadCredentials] =useState(false);
    const [FormSubmitted,setFormSubmitted] = useState(false);
    const handleChange = (e) =>{
       
       const  name =e.currentTarget.name;
       const  value = e.currentTarget.value;
        setCredentials({...credentials,[name] : value});
    };
    const [token,setToken] = useState('');

    const fetchUser = async() => {
        try{
           const response =await  Axios.post(`${config.URL}/login_check`,credentials)
           const token = await response.data.token;
           token && setToken(token);
           setBadCredentials(false);
           window.localStorage.setItem('token',token);
           console.log(window.localStorage.token);
           Axios.defaults.headers['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
            history.replace("/customers");
        }catch(error){
           console.log(error);
            error.response.status == 401 ? setBadCredentials(true):null ;
           
        }
        setFormSubmitted(false);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        fetchUser();

    }

    return (<>
        <h1 className="text-center my-5">Connexion</h1>
        <div className="container">

        <div className="row justify-content-center">
            <form className="col-12 col-md-6" onSubmit={handleSubmit}>
                
                <div className="form-group my-3">
                    <label 
                        htmlFor="username">
                        Adresse email
                    </label>
                    <input 
                        value={credentials.username}
                        onChange={handleChange}
                        type="email" 
                        className="form-control mt-2 "
                        placeholder="adresse email" 
                        name="username" 
                    />
                     <div className="invalid-feedback">
                        mot de passe ou email invalide
                    </div>
                </div>
                <div className="form-group">
                    <label 
                        htmlFor="password" >
                            Mot de passe
                    </label>
                    <input 
                        value={credentials.password}
                        onChange={handleChange}
                        type="password" 
                        className={"form-control mt-2 "+ (badCredentials && "is-invalid")} 
                        placeholder="mot de passe" 
                        name="password" 
                    />
                    <div className="invalid-feedback mt-3">
                        <span className="badge bg-danger col-12  p-3">
                        mot de passe ou email invalide
                        </span>
                    </div>
                </div>
                <button className="btn btn-success btn-sm col-12 mt-3" disabled={FormSubmitted}>
                    {FormSubmitted ? 
                       <Spinner/> 
                    : "je me connecte"
                }
                </button>
            </form>
        </div>
        </div>


    </>);
}

export default LoginPage;