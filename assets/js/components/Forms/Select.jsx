import React from 'react';


const Select = ({label,name,error,value,onChange,children}) => {
    return ( 
        <div className='form-group my-3'>
            <label htmlFor={name} className='mb-2'>{label}</label>
            <select value={value} onChange={onChange} className={"form-select form-select-sm " + (error && " is-invalid")} name={name} id={name}>
                {children}
            </select>
            <div className='invalid-feedback'>{error}</div>
        </div>
         );
}
 
export default Select;