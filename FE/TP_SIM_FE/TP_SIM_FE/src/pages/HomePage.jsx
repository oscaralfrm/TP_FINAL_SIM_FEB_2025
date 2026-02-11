import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="container text-center mt-5">
            <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Cátedra: Simulación</h1>
                    <p className="col-md-8 fs-4 mx-auto">
                        Trabajo Práctico Final SIM: El Vendedor de Diarios
                    </p>
                    <p className="text-muted mb-4">
                        Simulación de diferentes políticas de inventario para optimizar ganancias 
                        basado en demandas probabilísticas.
                    </p>
                    <Link to="/simulacion" className="btn btn-primary btn-lg px-4 gap-3">
                        Comenzar Simulación
                    </Link>
                </div>
            </div>
            
            <div className="row mt-5">
                <div className="col-md-5 mx-auto">
                    <div className="card">
                        <div className="card-header bg-dark text-white">
                            TP Elaborado por:
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><span>Legajo: 96454 </span>Romero Moreno, Oscar Alfonso</li>
                            {/* Agrega tus integrantes aquí */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;