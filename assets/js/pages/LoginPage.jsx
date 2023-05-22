import Axios from "axios";
import React, { useContext, useState } from "react";
import config from'../config';
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/AuthContext";
import Field from "../components/Forms/Field";

const LoginPage = ({history}) => {
    const {isAuthenticated , setIsAuthenticated} = useContext(AuthContext);
    const [credentials,setCredentials] = useState({
        "username":"",
        "password":""
    });
    const [badCredentials,setBadCredentials] =useState('');
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
           Axios.defaults.headers['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
            history.replace("/customers");
        }catch(error){
           console.log(error);
            error.response.status == 401 ? setBadCredentials('email ou mdp incorrecte'):null ;
           
        }finally{
            setFormSubmitted(false);
        }
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
            
                <Field name="username" label="Adresse email" value={credentials.username} type="email" placeholder="adresse email" onChange={handleChange} error={badCredentials} />
                
                <Field name="password" label="Mot de passe" value={credentials.password} type="password" placeholder="mot de passe" onChange={handleChange} error={badCredentials} />

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