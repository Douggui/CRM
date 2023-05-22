
import React, { useEffect, useState } from 'react';
import Field from '../components/Forms/Field';
import Select from '../components/Forms/Select';
import {Link} from "react-router-dom/cjs/react-router-dom.min"
import Axios from 'axios';
import config from '../config';
import Spinner from '../components/Spinner/Spinner';

const InvoicePages = (props) => {
    let {id} = props.match.params
    //id = id !== 'new' && parseInt(id);
    console.log(id);
    const [invoice,setInvoice] = useState
    ({
        amount:'',
        customer:'',
        status:'SENT'
    });
    const [errors,setErrors] = useState({
        amount:'',
        customer:'',
        status:''
    })
    const [customers,setCustomers] = useState([]);
    const [isFormSubmitted,setIsFormSubmitted] = useState(false);
    const [Editing,setEditing] = useState(false);
    const handleChange = ({currentTarget}) =>{

        let {name,value}=currentTarget;
        

        setInvoice({...invoice,[name]:value});
    }
    console.log(invoice);
    const fetchCustomers = async(Editing) =>{
        
        try{
           
                const response = await Axios.get(`${config.URL}/customers`);
                console.log(response.data['hydra:member'][0]["@id"]);
                setCustomers(response.data['hydra:member']);
                setInvoice({...invoice,customer:response.data['hydra:member'][0].id})
        }catch(error){
 
            console.log(error.response);
        }
    }
    const fetchInvoice = async(id) =>{
        
        try{
            const response = await Axios.get(`${config.URL}/invoices/${parseInt(id)}`);
            console.log(response.data);
            let {amount,status,customer} = response.data;
            status = status.toUpperCase();
            console.log(amount,status,customer);
            setInvoice({amount,status,customer:customer.id});
           
        }catch(error){
            console.log(error.response);
        }
    }

    /**
     * retrieve customers
     */
    useEffect(()=>{
        fetchCustomers(); 
    },[]);
    useEffect(()=>{
       id === 'new' ? setEditing(false) : setEditing(true) ;
        id != 'new' && fetchInvoice(id); 
    },[id]);

    const createInvoice = async() =>{
        try{
            if(Editing){
                const response = await Axios.put(`${config.URL}/invoices/${id}`,{...invoice,customer:`/api/customers/${invoice.customer}`})
                console.log(response);
            }  else{

                const response = await Axios.post(`${config.URL}/invoices`,{...invoice,customer:`/api/customers/${invoice.customer}`})
                console.log(response);
                // TODO : flash success notification 
                props.history.push('/invoices');
            }
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
        e.preventDefault();
        setIsFormSubmitted(true);
        createInvoice();
    }

    return (
        <div className='container'>
            <Link to='/invoices'>Retour</Link>
            <h1 className='mt-5 text-center my-5'>{Editing ? "Modification d'une facture" :" Création d'une facture" }</h1>
            <form onSubmit={handleSubmit}>
                <Field name ="amount" type="number" placeholder="montant de la facture" label="Montant" onChange={handleChange} value={invoice.amount} error={errors.amount}/>   
                <Select name="customer" value={invoice.customer} onChange={handleChange} label="Client" error={errors.customer} >
                   
                    {customers.map((customer)=>(
                        <option key={customer.id} value={customer.id}>{customer.firstname} {customer.lastname}</option>
                    ))}
                </Select>
                <Select name="status" value={invoice.status} onChange={handleChange} label="Status" error={errors.status} >

                    <option value="SENT">envoyée</option>
                    <option value="PAID">payé</option>
                    <option value="CANCELED">annulée</option>
                </Select>
                <div className='form-group'>
                    <button className='btn btn-primary btn-sm col-12'>{isFormSubmitted ? <Spinner/> : "Valider"}</button>
                         
                </div>
            </form>
        </div>
    );
};

export default InvoicePages;