import React from 'react';

const Field = ({name,label,value,type="text",placeholder,error="",onChange}) =>{
    return (
        <div className="form-group my-3">
            <label 
                htmlFor={name}>
                {label}
            </label>
            <input 
                value={value}
                onChange={onChange}
                type={type} 
                className={"form-control mt-2 " + (error && " is-invalid")}
                placeholder={placeholder} 
                name={name} 
                id={name}
            />
            {error && 
                <div className="invalid-feedback mt-3">
                  
                        {error}
                    
                </div>
            }
        </div>
    )
}

export default Field
