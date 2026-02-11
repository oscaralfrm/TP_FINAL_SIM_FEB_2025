import React, { useState } from 'react';
import SimulacionForm from '../components/Simulacion/SimulacionForm'; // Ajusta la ruta según tu estructura
import ResultadosGrid from '../components/Simulacion/ResultadosGrid'; // Ajusta la ruta según tu estructura
import simulacionService from '../services/simulacion.service'; // Ajusta la ruta

const SimulacionPage = () => {
    // 1. Estados
    const [resultados, setResultados] = useState(null);
    const [metaData, setMetaData] = useState(null); // Para guardar mejor_politica y tiempo
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('politica_a');

    // Diccionario para nombres amigables
    const NOMBRES_POLITICAS = {
        'politica_a': 'Política A (Demanda Anterior)',
        'politica_b': 'Política B (Cantidad Fija 1)',
        'politica_c': 'Política C (Cantidad Fija 2)'
    };

    // 2. Conexión con Backend
    const handleSimular = async (payload) => {
        setLoading(true);
        setResultados(null);
        setMetaData(null);

        try {
            console.log("📤 Enviando payload:", payload);
            
            // Llamada al servicio
            const response = await simulacionService.postSimulacion(payload);
            console.log("📥 Respuesta recibida completa:", response);

            // LÓGICA DE EXTRACCIÓN BASADA EN TU JSON
            // Estructura esperada: { data: { mejor_politica: "...", resultados: {...}, tiempo_ejecucion: ... }, success: true }
            
            let dataLimpia = null;
            let metaInfo = {};

            // Verificamos si la respuesta viene envuelta en 'data' (común en axios o tu estructura JSON)
            if (response.data && response.data.resultados) {
                dataLimpia = response.data.resultados;
                metaInfo = {
                    mejor_politica: response.data.mejor_politica,
                    tiempo_ejecucion: response.data.tiempo_ejecucion
                };
            } 
            // Fallback: Si el backend devuelve directo los resultados
            else if (response.resultados) {
                dataLimpia = response.resultados;
                metaInfo = {
                    mejor_politica: response.mejor_politica,
                    tiempo_ejecucion: response.tiempo_ejecucion
                };
            }

            if (dataLimpia) {
                setResultados(dataLimpia);
                setMetaData(metaInfo);
                
                // Opcional: Cambiar la tab activa automáticamente a la ganadora
                if (metaInfo.mejor_politica && dataLimpia[metaInfo.mejor_politica]) {
                    setActiveTab(metaInfo.mejor_politica);
                }
            } else {
                console.error("⚠️ Estructura no reconocida:", response);
                alert("No se pudieron leer los resultados. Revisa la consola.");
            }
            
        } catch (error) {
            console.error("❌ Error:", error);
            alert("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <h2 className="text-center mb-4 border-bottom pb-2">TP Montecarlo - Vendedor de Diarios</h2>
            
            {/* 3. Formulario */}
            <div className="row justify-content-center">
                <div className="col-12">
                    <SimulacionForm onSimular={handleSimular} />
                </div>
            </div>

            <hr className="my-5" />

            {/* Spinner */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted fs-5">Simulando escenarios...</p>
                </div>
            )}

            {/* 4. RESULTADOS */}
            {resultados && !loading && (
                <div className="animate__animated animate__fadeInUp">
                    
                    {/* --- BANNER DE LA MEJOR POLÍTICA --- */}
                    {metaData?.mejor_politica && (
                        <div className="card text-white bg-success mb-4 shadow-lg">
                            <div className="card-body text-center">
                                <h3 className="card-title display-6">
                                    <i className="bi bi-trophy-fill me-2"></i>
                                    Estrategia Ganadora
                                </h3>
                                <p className="card-text fs-4">
                                    {NOMBRES_POLITICAS[metaData.mejor_politica] || metaData.mejor_politica}
                                </p>
                                <small>
                                    Tiempo de ejecución: {metaData.tiempo_ejecucion} seg
                                </small>
                            </div>
                        </div>
                    )}

                    {/* --- PESTAÑAS Y GRILLA --- */}
                    <div className="card shadow">
                        <div className="card-header bg-light">
                            <ul className="nav nav-tabs card-header-tabs">
                                {Object.keys(resultados).map((key) => (
                                    <li className="nav-item" key={key}>
                                        <button
                                            className={`nav-link ${activeTab === key ? 'active fw-bold' : 'text-secondary'} ${metaData?.mejor_politica === key ? 'text-success' : ''}`}
                                            onClick={() => setActiveTab(key)}
                                        >
                                            {NOMBRES_POLITICAS[key] || key}
                                            {metaData?.mejor_politica === key && <i className="bi bi-star-fill ms-2 text-warning"></i>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="card-body">
                            {resultados[activeTab] ? (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="alert alert-secondary d-flex justify-content-between align-items-center">
                                        <span>
                                            <strong>Estadísticas:</strong> 
                                            Promedio: ${resultados[activeTab].ganancia_promedio} | 
                                            Max: ${resultados[activeTab].ganancia_maxima} | 
                                            Min: ${resultados[activeTab].ganancia_minima}
                                        </span>
                                        <span className="fs-5 badge bg-dark">
                                            Total: ${resultados[activeTab].ganancia_total.toFixed(2)}
                                        </span>
                                    </div>
                                    <ResultadosGrid vectores={resultados[activeTab].vectores_estado} />
                                </div>
                            ) : (
                                <p className="text-center p-3">Seleccione una política para ver los detalles.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulacionPage;