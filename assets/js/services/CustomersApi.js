import Axios from "axios";
import config from "../config";

export const fetchCustomer = async(id,setCustomer,Editing) =>{
        
    try{
        if(!Editing){

            const response = await Axios.get(`${config.URL}/customers/${id}`);
            console.log(response);
            const {email,firstname,lastname,company} = response.data;
            setCustomer({firstname,lastname,email,company});
        }
    }catch(error){
        console.log(error);
    }
}
export const createCustomer = async(id,setErrors,setIsFormSubmitted,customer,history,Editing) =>{
    try{
        if(Editing){
            const response = await Axios.put(`${config.URL}/customers/${id}`,customer)
             // TODO : flash success notification
        }else{
           
            const response = await Axios.post(`${config.URL}/customers/${id}`,customer);
           // TODO : flash success notification 
            history.replace('/customers');
            
        }
        
        setErrors({});

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

