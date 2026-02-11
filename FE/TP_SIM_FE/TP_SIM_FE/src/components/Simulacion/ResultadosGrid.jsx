import React from 'react';

const ResultadosGrid = ({ vectores }) => {
    // Debug: Para ver si llegan los datos al componente
    console.log("ResultadosGrid renderizado con:", vectores);

    // Validación de seguridad
    if (!vectores || !Array.isArray(vectores) || vectores.length === 0) {
        return (
            <div className="alert alert-warning text-center mt-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                No hay vectores de estado para mostrar.
            </div>
        );
    }

    // Helpers de formato
    const formatCurrency = (val) => val ? `$${Number(val).toFixed(2)}` : '$0.00';
    const formatNumber = (val) => val !== undefined && val !== null ? Number(val).toFixed(4) : '';

    return (
        <div className="table-responsive mt-3 shadow-sm" style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #dee2e6' }}>
            <table className="table table-bordered table-striped table-hover table-sm text-center align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                <thead className="table-dark sticky-top" style={{ zIndex: 1 }}>
                    <tr>
                        <th>Día</th>
                        <th>RND</th>
                        <th>Demanda</th>
                        <th>Compra</th>
                        <th>Ventas</th>
                        <th>Devol.</th>
                        <th>Dem. Insat.</th>
                        <th>Ing. Venta</th>
                        <th>Ing. Devol.</th>
                        <th>Cost. Compra</th>
                        <th>Cost. Oport.</th>
                        <th>Gan. Día</th>
                        <th>Gan. Acum.</th>
                    </tr>
                </thead>
                <tbody>
                    {vectores.map((fila, index) => (
                        <tr key={index}> {/* Usamos index si no hay ID único seguro */}
                            <td className="fw-bold">{fila.dia}</td>
                            <td>{formatNumber(fila.rnd)}</td>
                            <td>{fila.demanda}</td>
                            <td className="table-primary fw-bold">{fila.cantidad_comprada}</td>
                            <td>{fila.ventas}</td>
                            <td>{fila.devoluciones}</td>
                            <td className={fila.demanda_insatisfecha > 0 ? "text-danger fw-bold" : ""}>
                                {fila.demanda_insatisfecha}
                            </td>
                            <td>{formatCurrency(fila.ingreso_ventas)}</td>
                            <td>{formatCurrency(fila.ingreso_devoluciones)}</td>
                            <td>{formatCurrency(fila.costo_compra)}</td>
                            <td>{formatCurrency(fila.costo_oportunidad)}</td>
                            <td className={fila.ganancia_dia >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {formatCurrency(fila.ganancia_dia)}
                            </td>
                            <td className="bg-light fw-bold text-end pe-3">
                                {formatCurrency(fila.ganancia_acumulada)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultadosGrid;