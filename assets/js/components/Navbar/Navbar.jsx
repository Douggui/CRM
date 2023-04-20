import React from 'react';

const  Navbar = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">SymReact</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                    <a className="nav-link active" href="#">Accueil
                        <span className="visually-hidden">(current)</span>
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Clients</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Factures</a>
                    </li>

                </ul>
                <ul className="navbar-nav ms-auto">
                   <li className="nav-item"><a href="#" className="nav-link"><button className=' btn btn-primary btn-sm'> Connexion</button></a></li>
                   <li className="nav-item"><a href="#" className="nav-link"><button className=' btn btn-danger btn-sm'>Deconnexion</button> </a></li>
                   <li className="nav-item"><a href="#" className="nav-link"><button className='btn btn-success btn-sm'>Inscription</button></a></li>
                </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;