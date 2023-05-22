import React, { useEffect, useState } from 'react';
import Field from '../components/Forms/Field';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Axios from 'axios';
import config from '../config';
import Spinner from '../components/Spinner/Spinner';
import { fetchCustomer,createCustomer } from '../services/CustomersApi';

const CustomerPage = (props) => {
    let {id} = props.match.params;
    // id = parseInt(id);
    console.log(props);
    const [customer,setCustomer] = useState({
        firstname:'',
        lastname:'',
        email:'',
        company:''
    });
    const [errors,setErrors] = useState({
        firstname:'',
        lastname:'',
        email:'',
        company:''
    })
    const [isFormSubmitted,setIsFormSubmitted] = useState(false);
    const [Editing,setEditing] = useState(false);

    const fetchCustomer = async() =>{
        
        try{
            if(!Editing){
                const response = await Axios.get(`${config.URL}/customers/${id}`);
                const {email,firstname,lastname,company} = response.data;
                setCustomer({firstname,lastname,email,company});
            }
        }catch(error){
            console.log(error);
        }
    }

    /**
     * retrieve customer on componentDidMount or on id updating
     */
    useEffect(()=>{
        id === 'new' ? setEditing(false) : setEditing(true);
        if(id != 'new'){
            fetchCustomer(id,setCustomer,Editing);
        }
    },[id]);
    console.log(Editing);
    const handleChange = ({currentTarget}) =>{
        
        setCustomer({...customer,[currentTarget.name]:  currentTarget.value });
    }
    const createCustomer = async() =>{
        try{
            if(Editing){
                const response = await Axios.put(`${config.URL}/customers/${id}`,customer)
                 // TODO : flash success notification
            }else{
               
                const response = await Axios.post(`${config.URL}/customers`,customer);
               // TODO : flash success notification 
            }
            
            setErrors({});
            props.history.replace('/customers');

        }catch(error){
            const apiErrors={};
            console.log(error.response);
            error.response.data.violations.map(({propertyPath,message}) =>{
               
                apiErrors[propertyPath]=message;
               
            })

            setErrors(apiErrors);
            // TODO : flash error notification 
        }finally{
            setIsFormSubmitted(false);
        }
        
    }
    const handleSubmit = (e) =>{
        setIsFormSubmitted(true);
        e.preventDefault();
        createCustomer();
        
    }
    return ( <div className='container'>
        <p><Link to="/customers">Retour</Link></p>

        <h1 className='my-5 text-center'>{ Editing ? "Modification d'un client" : "Création d'un client"}</h1>
        
            <form onSubmit={handleSubmit}>
                <Field  name="firstname" label="prénom du client" placeholder="prénom du client" onChange={handleChange} value={customer.firstname} error={errors.firstname} />
                <Field  name="lastname" label="nom du client" placeholder="nom du client" onChange={handleChange} value={customer.lastname} error={errors.lastname}/>
                <Field  name="email" label="email du client" placeholder="email du client" type = "email" onChange={handleChange} value={customer.email} error={errors.email}/>
                <Field  name="company" label="entreprise du client" placeholder="entreprise du client" onChange={handleChange} value={customer.company}  error={errors.company}/>
            
                    
                    <button className={'btn btn-primary btn-sm col-12 ' +(isFormSubmitted && ' disabled')}>
                    {
                    isFormSubmitted ? 
                    <Spinner/> :
                    "Valider"
                    }
                    </button>
                
            </form>
        
    </div> );
}
 
export default CustomerPage;