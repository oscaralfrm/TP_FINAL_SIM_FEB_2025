import React from 'react';

const ParametrosTabla = ({ register, fields, remove, append, sumaProbabilidades }) => {
    return (
        <div className="table-responsive mb-3">
            <table className="table table-sm table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>Demanda (Unidades)</th>
                        <th>Probabilidad (0.00 - 1.00)</th>
                        <th style={{width: '50px'}}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field, index) => (
                        <tr key={field.id}>
                            <td>
                                <input 
                                    type="number" 
                                    className="form-control form-control-sm"
                                    {...register(`filas_demanda.${index}.demanda`, { required: true })}
                                />
                            </td>
                            <td>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control form-control-sm"
                                    {...register(`filas_demanda.${index}.probabilidad`, { required: true, min: 0, max: 1 })}
                                />
                            </td>
                            <td className="text-center">
                                {fields.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => remove(index)}
                                    >
                                        &times;
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="text-end fw-bold">Total Probabilidad:</td>
                        <td className={Math.abs(sumaProbabilidades - 1.0) < 0.001 ? "text-success fw-bold" : "text-danger fw-bold"}>
                            {sumaProbabilidades.toFixed(2)}
                        </td>
                        <td>
                            <button 
                                type="button" 
                                className="btn btn-outline-primary btn-sm w-100"
                                onClick={() => append({ demanda: 0, probabilidad: 0 })}
                            >
                                +
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ParametrosTabla;