import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../config';
import { Pagination, data } from '../components/Pagination/Pagination';


const CustomersWithPagination = (props) => {
    const [customers,setCustomers]     = useState([]);
    const [isLoading,setIsLoading]     = useState(false);
    const [error,setError]             = useState(null);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalItems,setTotalItems]   = useState(0);
    const itemsPerPage = 10;
    useEffect(()=>{
        setIsLoading(true);
        Axios.get(`${config.URL}/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
        .then((response) => {
            if(response.status != 200) throw new Error();
            console.log(response.data);
             setCustomers(response.data['hydra:member']);
             setTotalItems(response.data['hydra:totalItems']);
             console.log(response.data['hydra:totalItems']);
        })
       // .then((data) => setCustomers(data))
        .catch((error) => setError(error))
        .finally(()=> setIsLoading(false));
    },[currentPage]);
   console.log(totalItems);
    const handlDelete=(id)=>{
        Axios.delete(`${config.URL}/customers/${id}`)
        .then((response) =>{
            console.log(response);
            if(response.status === 204){
                   const  newCustomers = customers.filter((customer) => {
                        return customer.id !== id
                      })
                      setCustomers(newCustomers);
            }else{
                throw new Error();
            }
        })
        .catch(error => alert("une erreur s'est produite veuillez réessayez"))
        
    }

    
    //const paginatedCustomers =data(customers,itemsPerPage,currentPage);

    const handleChangePage = (page) =>{
        setCurrentPage(page);
    }
    return isLoading ? (
          
           <>
           <div className='d-flex justify-content-center mt-5'>
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
           </div>
           </>
       ):(<>
            {error ? <p className='text-center mt-5'>Une erreur s'est produite</p> : 
            <div>
            <h1 className='mt-5 text-center'>Liste des clients</h1>
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
                    
                      {customers.map( ({id,firstname,lastname,email,company,totalAmount,invoices}) =>(
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
                <Pagination  handleChange={handleChangePage} currentPage={currentPage} items={totalItems} itemsPerPage={itemsPerPage}/>
            </div>
        }
        </>);
   
}

export default CustomersWithPagination;