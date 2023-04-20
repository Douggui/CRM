import React from 'react';

export const Pagination = ({handleChange,currentPage,items,itemsPerPage}) => {
    const pagesNumber = Math.ceil(items/itemsPerPage)
    const pages = [];
    for (let i = 1; i <= pagesNumber; i++) {
         pages.push(i) ;

    }
    return (
        <div className='d-flex justify-content-end ms-3'>
            <ul className="pagination pagination-sm">
                
                <li className={"page-item"+ (currentPage === 1 && " disabled")}>
                    <button className="page-link" onClick={()=>handleChange(currentPage-1)} >&laquo;</button>
                </li>
                {pages.map((page) =>(
                <li className={"page-item" + (currentPage===page  && " active") } key={page}>
                    <button className="page-link" onClick={()=>handleChange(page)}>{page}</button>
                </li>
                ))}
                <li className={"page-item" + (currentPage === pagesNumber && " disabled")}>
                    <button className="page-link" onClick={()=>handleChange(currentPage+1)} >&raquo;</button>
                </li>
            </ul>
        </div> 
    );
};
export const data = (items,itemsPerPage,currentPage) =>{
    const start = itemsPerPage * currentPage - itemsPerPage
    return   items.slice(start , start + itemsPerPage);
}

// export default Pagination;