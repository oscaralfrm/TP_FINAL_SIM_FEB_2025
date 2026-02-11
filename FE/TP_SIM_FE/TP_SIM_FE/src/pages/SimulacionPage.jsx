import React, { useState } from 'react';
import SimulacionForm from '../components/Simulacion/SimulacionForm';
import ResultadosGrid from '../components/Simulacion/ResultadosGrid';
import simulacionService from '../services/simulacion.service';

const SimulacionPage = () => {
    const [resultados, setResultados] = useState(null);
    const [loading, setLoading] = useState(false);
    // Estado para controlar qué pestaña se está viendo (A, B o C)
    const [activeTab, setActiveTab] = useState('politica_a');

    const handleSimular = async (payload) => {
        setLoading(true);
        setResultados(null); // Limpiar resultados anteriores
        try {
            const data = await simulacionService.postSimulacion(payload);
            setResultados(data.resultados);
            // Detectar cuál fue la mejor política para ponerla activa por defecto? 
            // O simplemente dejar la A por defecto. Dejamos la A.
        } catch (error) {
            console.error("Error en simulación:", error);
            alert("Error al conectar con el servidor. Verifica que el backend esté corriendo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container pb-5">
            <h2 className="mb-4 text-center border-bottom pb-2">TP Final - Vendedor de Diarios</h2>
            
            {/* Formulario de Configuración */}
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <SimulacionForm onSimular={handleSimular} />
                </div>
            </div>

            {/* Spinner de Carga */}
            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Simulando...</span>
                    </div>
                    <p className="mt-2">Procesando simulación...</p>
                </div>
            )}

            {/* Visualización de Resultados */}
            {resultados && !loading && (
                <div className="mt-5 animate__animated animate__fadeIn">
                    
                    <h3 className="text-center mb-4">Resultados de la Simulación</h3>

                    {/* 1. Resumen Comparativo (Opcional pero recomendado) */}
                    <div className="card mb-4 border-success">
                        <div className="card-header bg-success text-white">
                            Resumen Ejecutivo
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                {resultados.politica_a && (
                                    <div className="col-md-4">
                                        <h5>Política A</h5>
                                        <h3 className="text-primary">${resultados.politica_a.ganancia_total}</h3>
                                        <small>Promedio: ${resultados.politica_a.ganancia_promedio}</small>
                                    </div>
                                )}
                                {resultados.politica_b && (
                                    <div className="col-md-4 border-start border-end">
                                        <h5>Política B</h5>
                                        <h3 className="text-primary">${resultados.politica_b.ganancia_total}</h3>
                                        <small>Promedio: ${resultados.politica_b.ganancia_promedio}</small>
                                    </div>
                                )}
                                {resultados.politica_c && (
                                    <div className="col-md-4">
                                        <h5>Política C</h5>
                                        <h3 className="text-primary">${resultados.politica_c.ganancia_total}</h3>
                                        <small>Promedio: ${resultados.politica_c.ganancia_promedio}</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Navegación de Pestañas */}
                    <ul className="nav nav-tabs mb-3" id="resultadosTabs">
                        {resultados.politica_a && (
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'politica_a' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('politica_a')}
                                >
                                    Política A (Demanda Anterior)
                                </button>
                            </li>
                        )}
                        {resultados.politica_b && (
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'politica_b' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('politica_b')}
                                >
                                    Política B (Fija)
                                </button>
                            </li>
                        )}
                        {resultados.politica_c && (
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'politica_c' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('politica_c')}
                                >
                                    Política C (Fija Alt)
                                </button>
                            </li>
                        )}
                    </ul>

                    {/* 3. Contenido de las Pestañas (La Grilla) */}
                    <div className="tab-content bg-white p-3 border border-top-0 rounded-bottom">
                        {activeTab === 'politica_a' && resultados.politica_a && (
                            <div>
                                <h5 className="text-muted">Detalle Vector de Estado - Política A</h5>
                                <ResultadosGrid vectores={resultados.politica_a.vectores_estado} />
                            </div>
                        )}
                        {activeTab === 'politica_b' && resultados.politica_b && (
                            <div>
                                <h5 className="text-muted">Detalle Vector de Estado - Política B</h5>
                                <ResultadosGrid vectores={resultados.politica_b.vectores_estado} />
                            </div>
                        )}
                        {activeTab === 'politica_c' && resultados.politica_c && (
                            <div>
                                <h5 className="text-muted">Detalle Vector de Estado - Política C</h5>
                                <ResultadosGrid vectores={resultados.politica_c.vectores_estado} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulacionPage;