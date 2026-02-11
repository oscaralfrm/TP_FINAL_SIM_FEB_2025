import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import ManejoErrores from '../../utils/ManejoErrores';

const SimulacionForm = ({ onSimular }) => {
    // Estado local para errores de lógica de negocio (suma != 1, etc.)
    const [customError, setCustomError] = useState(null);

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            dias_simulacion: 100,
            costo_unitario: 0,
            precio_venta: 0,
            precio_devolucion: 0,
            costo_oportunidad: 0,
            politica_a: true,
            politica_b_cant: 0,
            politica_c_cant: 0,
            // Inicializamos con un valor para que no esté vacío
            filas_demanda: [
                { demanda: 20, probabilidad: 0.05 }
            ],
            visualizacion: {
                desde_dia: 0,
                cantidad_dias: 50
            }
        }
    });

    // Hook para manejar arrays dinámicos
    const { fields, append, remove } = useFieldArray({
        control,
        name: "filas_demanda"
    });

    // Observamos los cambios en las filas para calcular la suma en tiempo real (UX)
    const filasDemanda = watch("filas_demanda");
    const sumaProbabilidades = filasDemanda?.reduce((acc, curr) => acc + Number(curr.probabilidad || 0), 0) || 0;

    const onSubmit = (data) => {
        console.log("Botón presionado. Datos crudos:", data); // AGREGA ESTO
        setCustomError(null);

        // 1. VALIDACIÓN: Suma de probabilidades debe ser 1 (con un margen de error pequeño por decimales)
        if (Math.abs(sumaProbabilidades - 1.0) > 0.001) {
            setCustomError(`La suma de probabilidades es ${sumaProbabilidades.toFixed(2)}. Debe ser exactamente 1.00`);
            return;
        }

        // 2. VALIDACIÓN: Políticas B y C
        if (Number(data.politica_b_cant) <= 0 && Number(data.politica_c_cant) <= 0) {
           // Opcional: Advertir si no pusieron cantidades en las políticas fijas
        }

        // 3. TRANSFORMACIÓN: Convertir el array de objetos {demanda, prob} a dos arrays separados para el Backend
        const demandasArray = data.filas_demanda.map(f => Number(f.demanda));
        const probabilidadesArray = data.filas_demanda.map(f => Number(f.probabilidad));

        // Armado del Payload final
        const payload = {
            demandas: demandasArray,
            probabilidades: probabilidadesArray,
            costo_unitario: Number(data.costo_unitario),
            precio_venta: Number(data.precio_venta),
            precio_devolucion: Number(data.precio_devolucion),
            costo_oportunidad: Number(data.costo_oportunidad),
            dias_simulacion: Number(data.dias_simulacion),
            politicas: {
                politica_a: data.politica_a,
                politica_b: Number(data.politica_b_cant),
                politica_c: Number(data.politica_c_cant)
            },
            visualizacion: {
                desde_dia: Number(data.visualizacion.desde_dia),
                cantidad_dias: Number(data.visualizacion.cantidad_dias)
            }
        };

        // Enviar al padre (SimulacionPage)
        onSimular(payload);

    };

    return (
        <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Configuración de Simulación</h4>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                
                {/* --- SECCIÓN 1: Parámetros Económicos y Tiempo --- */}
                <div className="row mb-3">
                    <div className="col-md-3">
                        <label className="form-label">Días a Simular</label>
                        <input type="number" className="form-control" {...register("dias_simulacion", { required: true, min: 1 })} />
                        {errors.dias_simulacion && <small className="text-danger">Requerido</small>}
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Costo Unitario ($)</label>
                        <input type="number" step="0.01" className="form-control" {...register("costo_unitario", { required: true, min: 0 })} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Precio Venta ($)</label>
                        <input type="number" step="0.01" className="form-control" {...register("precio_venta", { required: true, min: 0 })} />
                    </div>
                     <div className="col-md-3">
                        <label className="form-label">Precio Devolución ($)</label>
                        <input type="number" step="0.01" className="form-control" {...register("precio_devolucion", { required: true, min: 0 })} />
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-3">
                        <label className="form-label">Costo Oportunidad ($)</label>
                        <input type="number" step="0.01" className="form-control" {...register("costo_oportunidad", { required: true, min: 0 })} />
                    </div>
                </div>

                <hr />

                {/* --- SECCIÓN 2: Demandas y Probabilidades Dinámicas --- */}
                <h5 className="mb-3">Tabla de Demandas</h5>
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

                <hr />

                {/* --- SECCIÓN 3: Políticas --- */}
                <h5 className="mb-3">Políticas de Stock</h5>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <div className="form-check mt-4">
                            <input className="form-check-input" type="checkbox" {...register("politica_a")} id="checkPolA" />
                            <label className="form-check-label" htmlFor="checkPolA">
                                Incluir Política A (Demanda Anterior)
                            </label>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Política B (Cantidad Fija 1)</label>
                        <input type="number" className="form-control" {...register("politica_b_cant")} placeholder="Ej: 22" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Política C (Cantidad Fija 2)</label>
                        <input type="number" className="form-control" {...register("politica_c_cant")} placeholder="Ej: 23" />
                    </div>
                </div>

                <hr />

                {/* --- SECCIÓN 4: Visualización --- */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Mostrar desde día (j)</label>
                        <input type="number" className="form-control" {...register("visualizacion.desde_dia")} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Cantidad filas a mostrar (i)</label>
                        <input type="number" className="form-control" {...register("visualizacion.cantidad_dias", { max: 500 })} />
                        {errors.visualizacion?.cantidad_dias && <small className="text-danger">Máximo 500 filas</small>}
                    </div>
                </div>

                {/* COMPONENTE DE ERROR */}
                <ManejoErrores mensaje={customError} onClose={() => setCustomError(null)} />

                <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">
                        Iniciar Simulación
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SimulacionForm;