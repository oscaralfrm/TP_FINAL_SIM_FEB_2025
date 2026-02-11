import React, { useState } from 'react';
import SimulacionForm from '../components/Simulacion/SimulacionForm';
import ResultadosGrid from '../components/Simulacion/ResultadosGrid';
import simulacionService from '../services/simulacion.service';

const SimulacionPage = () => {
    // 1. Estados para manejar los datos y la interfaz
    const [resultados, setResultados] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('politica_a'); // Para cambiar entre pestañas

    // 2. Función que conecta el Formulario con el Backend
    const handleSimular = async (payload) => {
        setLoading(true);
        setResultados(null); // Limpiar tabla anterior para dar feedback visual de "recarga"

        try {
            console.log("📤 Enviando payload:", payload);
            
            // Llamada al servicio
            const response = await simulacionService.postSimulacion(payload);
            console.log("📥 Respuesta recibida:", response);

            // LÓGICA ROBUSTA DE EXTRACCIÓN DE DATOS
            // Intentamos encontrar el objeto de resultados en las ubicaciones típicas
            let dataFinal = null;

            if (response.resultados) {
                // Caso Ideal: El backend devuelve { resultados: { ... } }
                dataFinal = response.resultados;
            } else if (response.data && response.data.resultados) {
                // Caso Axios: A veces Axios envuelve en un objeto 'data' extra
                dataFinal = response.data.resultados;
            } else if (response.politica_a) {
                // Caso Directo: El backend devolvió directo el objeto de políticas
                dataFinal = response;
            }

            // Verificamos si encontramos algo válido
            if (dataFinal && (dataFinal.politica_a || dataFinal.politica_b)) {
                setResultados(dataFinal);
            } else {
                console.error("⚠️ Estructura de respuesta desconocida:", response);
                alert("El servidor respondió, pero no se encontraron los datos de simulación esperados. Revisa la consola.");
            }
            
        } catch (error) {
            console.error("❌ Error en la petición:", error);
            alert("Error al conectar con el servidor. Asegúrate de que el Backend (Python) esté corriendo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <h2 className="text-center mb-4 border-bottom pb-2">TP Montecarlo - Vendedor de Diarios</h2>
            
            {/* 3. Renderizamos el FORMULARIO */}
            <div className="row justify-content-center">
                <div className="col-12">
                    <SimulacionForm onSimular={handleSimular} />
                </div>
            </div>

            <hr className="my-5" />

            {/* Spinner de carga */}
            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted fs-5">Procesando simulación...</p>
                </div>
            )}

            {/* 4. Renderizamos la GRILLA DE RESULTADOS (Solo si hay datos y no carga) */}
            {resultados && !loading && (
                <div className="card shadow animate__animated animate__fadeIn">
                    <div className="card-header bg-light">
                        <ul className="nav nav-tabs card-header-tabs">
                            {/* Pestaña A */}
                            {resultados.politica_a && (
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'politica_a' ? 'active fw-bold' : 'text-secondary'}`}
                                        onClick={() => setActiveTab('politica_a')}
                                    >
                                        Política A
                                    </button>
                                </li>
                            )}
                            {/* Pestaña B */}
                            {resultados.politica_b && (
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'politica_b' ? 'active fw-bold' : 'text-secondary'}`}
                                        onClick={() => setActiveTab('politica_b')}
                                    >
                                        Política B
                                    </button>
                                </li>
                            )}
                            {/* Pestaña C */}
                            {resultados.politica_c && (
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'politica_c' ? 'active fw-bold' : 'text-secondary'}`}
                                        onClick={() => setActiveTab('politica_c')}
                                    >
                                        Política C
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                    
                    <div className="card-body">
                        {/* Contenido de la Pestaña A */}
                        {activeTab === 'politica_a' && resultados.politica_a && (
                            <div className="animate__animated animate__fadeIn">
                                <div className="alert alert-success d-flex justify-content-between align-items-center">
                                    <span><strong>Estrategia:</strong> Comprar la demanda del día anterior.</span>
                                    <span className="fs-5">Ganancia Total: <strong>${resultados.politica_a.ganancia_total}</strong></span>
                                </div>
                                <ResultadosGrid vectores={resultados.politica_a.vectores_estado} />
                            </div>
                        )}

                        {/* Contenido de la Pestaña B */}
                        {activeTab === 'politica_b' && resultados.politica_b && (
                            <div className="animate__animated animate__fadeIn">
                                <div className="alert alert-primary d-flex justify-content-between align-items-center">
                                    <span><strong>Estrategia:</strong> Cantidad Fija 1.</span>
                                    <span className="fs-5">Ganancia Total: <strong>${resultados.politica_b.ganancia_total}</strong></span>
                                </div>
                                <ResultadosGrid vectores={resultados.politica_b.vectores_estado} />
                            </div>
                        )}

                        {/* Contenido de la Pestaña C */}
                        {activeTab === 'politica_c' && resultados.politica_c && (
                            <div className="animate__animated animate__fadeIn">
                                <div className="alert alert-info d-flex justify-content-between align-items-center">
                                    <span><strong>Estrategia:</strong> Cantidad Fija 2.</span>
                                    <span className="fs-5">Ganancia Total: <strong>${resultados.politica_c.ganancia_total}</strong></span>
                                </div>
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