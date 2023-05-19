import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../config';
import { Pagination, data } from '../components/Pagination/Pagination';
import Spinner from '../components/Spinner/Spinner';
// import Pagination from '../components/Pagination/Pagination';

const CustomersPage = (props) => {
    const [customers,setCustomers]     = useState([]);
    const [isLoading,setIsLoading]     = useState(true);
    const [error,setError]             =useState(null);
    const [currentPage,setCurrentPage] = useState(1);
    const [search,setSearch]           =useState('');

    const fetchCustomers = async() => {
        
        try{
            const response = await  Axios.get(`${config.URL}/customers`);

            setCustomers(response.data['hydra:member']);
        }catch(err){
            
            setError(err);
        }
        setIsLoading(false);
    }
    useEffect(()=>{
        fetchCustomers();

    },[]);

    const deleteCustomer= async(id) => {
        try{
            const response = await Axios.delete(`${config.URL}/customers/${id}`)
            response.status === 204 && setCustomers(customers.filter((customer) => customer.id !== id));
        
        }catch(err){
            alert("une erreur s'est produite veuillez réessayez")
        }
    }
    const handlDelete=(id)=>{
        deleteCustomer(id);
    }

    const itemsPerPage = 10;
    
    const filtredCustomers = customers.filter(({firstname,lastname,email,company}) => 
    firstname.toLowerCase().includes(search.toLowerCase()) ||
    lastname.toLowerCase().includes(search.toLowerCase()) ||
    email.toLowerCase().includes(search.toLowerCase()) ||
    company?.toLowerCase().includes(search.toLowerCase())
      );

    const paginatedCustomers = data(filtredCustomers,itemsPerPage,currentPage);

    const handleChangePage = (page) =>{
        setCurrentPage(page);
    }
    const handleChange =(e) => {
        setSearch(e.currentTarget.value);
        setCurrentPage(1);
    }
    return (<>
            {error ? <p className='text-center mt-5'>erreur</p> : 
            <div>
            <h1 className='mt-5 text-center'>Liste des clients</h1>
            
                <div className="form-group mx-4">
                    <input type="text" onChange={(e)=>handleChange(e)} value={search} placeholder = "Rechercher" className="form-control d-block" />
                </div>
            
               <table className="table table-hover mt-5">
                   <thead>
                       <tr>
                       <th>Id</th>
                       <th> Client</th>
                       <th>Email</th>
                       <th>Entreprise</th>
                       <th className=" text-center">Factures</th>
                       <th className=" text-center">Montant total</th>
                       <th ></th>
                       </tr>
                   </thead>
   
                   <tbody>
                    
                      { isLoading ? <tr><td><Spinner/></td></tr> :
                           paginatedCustomers.map( ({id,firstname,lastname,email,company,totalAmount,invoices}) =>(
                           <tr key={id}>
                           <th >{id}</th>
                           <td><a href="#">{`${firstname} ${lastname}`}</a></td>
                           <td>{email}</td>
                           <td>{company}</td>
                           <td className='text-center'><span className='badge bg-danger'>{invoices.length}</span> </td>
                           <td className='text-center'>{totalAmount.toLocaleString()}€</td>
                           
                            <td>
                                <button
                                 className='btn btn-primary  btn-sm' 
                                 disabled = {invoices.length > 0}
                                 onClick={()=>handlDelete(id)}
                                 >
                                    Supprimer
                                </button></td>

                           </tr>
                       ))}
   
               
                   </tbody>
               </table>
                <Pagination  handleChange={handleChangePage} currentPage={currentPage} items={filtredCustomers.length} itemsPerPage={itemsPerPage}/>
            </div>
        }
        </>);
   
}

export default CustomersPage;