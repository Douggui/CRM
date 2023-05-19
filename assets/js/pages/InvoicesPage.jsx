import Axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Pagination, data } from "../components/Pagination/Pagination";
import config from "../config";
import Spinner from "../components/Spinner/Spinner";


const InvoicesPage = () => {
    
    const [invoices,setInvoices]       = useState([]);
    const [isLoading,setIsLoading]     = useState(true);
    const [error,setError]             = useState(null);
    const [currentPage,setCurrentPage] = useState(1);
    const [search,setSearch]           =useState('');

    const STATUS_CLASSES = {
        PAYED:"success",
        SENT:"info",
        CANCELED : "primary",
    }
    const STATUS_LABELS = {
        PAYED:"Payée",
        SENT:"Envoyée",
        CANCELED : "Annulée",
    }
    const filtredInvoices = invoices.filter((invoice) => {
     return invoice.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
             invoice.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
             STATUS_LABELS[invoice.status.toUpperCase()].toLowerCase().includes(search.toLowerCase()) ||
             invoice.amount.toString().startsWith(search)
    });
    const itemsPerPage  = 40; 
    const paginatedInvoices = data(filtredInvoices,itemsPerPage,currentPage);

    const fetchInvoices = async() => {
        try{
           const response = await Axios.get(`${config.URL}/invoices`);
           setInvoices(response.data['hydra:member']);
        }catch(err){
            setError(err);
        }
        setIsLoading(false);
    }
    
    useEffect(()=>{
        fetchInvoices();
  
    },[]);

    const handleChangePage = (page) =>{
        setCurrentPage(page);
    }
    const formatDate = (str) => {
        return moment(str).format('DD/MM/YYYY');
    }
   
   const handleChange = (e) => {
    setSearch(e.currentTarget.value);
    setCurrentPage(1);
   }
   const handleDelete = async(id) => {
        try{
            const response = await Axios.delete(`${config.URL}/invoices/${id}`)
            response.status === 204 && setInvoices(invoices.filter((invoice) => invoice.id !== id ))

        }catch(err){
            alert("une erreur s'est produite, veuillez réessayer")
        }
   }
    return ( <>
        <h1 className="text-center my-5">Liste des factures</h1>
        <div className="form-group mx-1">
            <input type="text" onChange={(e) => handleChange(e)} value={search} placeholder="Rechercher" className="form-control" />
        </div>
        <table className="table table-hover">
            <thead>
                <tr>
                <th className="">Numéro</th>
                <th className="">Clients</th>
                <th className="text-center">Montant</th>
                <th className="text-center">Date d'envoie</th>
                <th className="text-center">Status</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
    
                { isLoading ? <tr className="d-flex justify-content-center"><td><Spinner/></td></tr> :
                    paginatedInvoices.map(({id,chrono,amount,sentAt,status,customer}) => (

                        <tr className="" key={id}>
                        <th scope="row">{chrono}</th>
                        <td><a href="">{`${customer.firstname} ${customer.lastname}`}</a> </td>
                        <td className="text-center">{amount.toLocaleString()}€</td>
                        <td className="text-center">{formatDate(sentAt)}</td>
                        <td className="text-center"><span className={"badge bg-" + (STATUS_CLASSES[status.toUpperCase()])}>{STATUS_LABELS[status.toUpperCase()]}</span> </td>
                        <td>
                            <button className="btn btn-info btn-sm me-2">Editer</button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleDelete(id)}>Supprimer</button>
                        </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
       
        
        <Pagination handleChange={handleChangePage} currentPage={currentPage} items={filtredInvoices.length} itemsPerPage={itemsPerPage}/>

    </> );
}
 
export default InvoicesPage;