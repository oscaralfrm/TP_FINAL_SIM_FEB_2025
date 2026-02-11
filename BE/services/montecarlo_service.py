import time
import math
from utils.generadores import generar_rnd, calcular_probs_acumuladas, obtener_demanda
from models.simulacion import FilaVectorEstado


class MontecarloService:

    def simular_todo(self, params):
        """
        Ejecuta la simulación para las 3 políticas y compara resultados.
        """
        start_time = time.time()

        # Preparar datos probabilísticos una sola vez
        demandas = params['demandas']
        probs_acum = calcular_probs_acumuladas(params['probabilidades'])

        # Extraer parámetros de políticas
        pol_a = params['politicas'].get('politica_a', False)  # Boolean
        pol_b_q = params['politicas'].get('politica_b', 0)  # Cantidad
        pol_c_q = params['politicas'].get('politica_c', 0)  # Cantidad

        resultados = {}
        mejor_ganancia = -float('inf')
        mejor_politica_nombre = ""

        # 1. Ejecutar Política A (Demanda día anterior)
        if pol_a:
            res_a = self._ejecutar_simulacion(params, demandas, probs_acum, 'A', 0)
            resultados['politica_a'] = res_a
            if res_a['ganancia_total'] > mejor_ganancia:
                mejor_ganancia = res_a['ganancia_total']
                mejor_politica_nombre = "politica_a"

        # 2. Ejecutar Política B (Fija)
        if pol_b_q > 0:
            res_b = self._ejecutar_simulacion(params, demandas, probs_acum, 'B', pol_b_q)
            resultados['politica_b'] = res_b
            if res_b['ganancia_total'] > mejor_ganancia:
                mejor_ganancia = res_b['ganancia_total']
                mejor_politica_nombre = "politica_b"

        # 3. Ejecutar Política C (Fija Alternativa)
        if pol_c_q > 0:
            res_c = self._ejecutar_simulacion(params, demandas, probs_acum, 'C', pol_c_q)
            resultados['politica_c'] = res_c
            if res_c['ganancia_total'] > mejor_ganancia:
                mejor_ganancia = res_c['ganancia_total']
                mejor_politica_nombre = "politica_c"

        total_time = round(time.time() - start_time, 4)

        return {
            "resultados": resultados,
            "mejor_politica": mejor_politica_nombre,
            "tiempo_ejecucion": total_time
        }

    def _ejecutar_simulacion(self, params, demandas, probs_acum, tipo_politica, cantidad_fija):
        """
        Lógica Core de Montecarlo con optimización de memoria.
        Solo guarda en 'vectores_estado' las filas solicitadas por el usuario.
        """
        # Parámetros visualización
        desde = params['visualizacion']['desde_dia']
        cantidad_ver = params['visualizacion']['cantidad_dias']
        hasta = desde + cantidad_ver

        # Datos económicos
        p_venta = params['precio_venta']
        p_dev = params['precio_devolucion']
        c_unit = params['costo_unitario']
        c_op = params['costo_oportunidad']
        dias_sim = params['dias_simulacion']

        # Inicializadores
        vectores_estado = []  # Solo para la grilla
        ganancia_acumulada_global = 0.0
        ganancias_diarias = []  # Para cálculo de desviación estándar y min/max

        # Memoria de 2 filas: 'demanda_anterior' simula la fila (i-1) necesaria para Pol A.
        # Para Pol A en día 1, asumimos compra = 0 (o podría ser promedio)
        demanda_anterior = 0

        for dia in range(1, dias_sim + 1):

            # 1. Determinar RND y Demanda
            rnd = generar_rnd()
            demanda_actual = obtener_demanda(rnd, demandas, probs_acum)

            # 2. Determinar Cantidad a Comprar (Q)
            q_actual = 0
            if tipo_politica == 'A':
                # Día 1 no hay anterior, compramos 0 (o lo que defina el enunciado)
                q_actual = demanda_anterior if dia > 1 else 0
            else:
                q_actual = cantidad_fija  # Política B o C

            # 3. Crear Fila (Calcula ventas, costos, ganancia del día)
            fila = FilaVectorEstado(
                dia=dia,
                rnd=rnd,
                demanda=demanda_actual,
                cantidad_comprada=q_actual,
                precio_venta=p_venta,
                precio_devolucion=p_dev,
                costo_unitario=c_unit,
                costo_op=c_op,
                ganancia_acum_anterior=ganancia_acumulada_global
            )

            # 4. Actualizar Acumuladores Globales y Estadísticos
            ganancia_acumulada_global = fila.ganancia_acumulada
            ganancias_diarias.append(fila.ganancia_dia)

            # 5. Actualizar "Fila Anterior" (en este caso solo necesitamos la demanda)
            demanda_anterior = demanda_actual

            # 6. Guardar en vector de visualización SOLO si está en rango
            if desde <= dia < hasta:
                vectores_estado.append(fila.to_dict())

        # --- Fin del bucle ---

        # Cálculos finales
        promedio = ganancia_acumulada_global / dias_sim
        desviacion = 0
        if dias_sim > 1:
            # Desviación estándar muestral
            varianza = sum((g - promedio) ** 2 for g in ganancias_diarias) / (dias_sim - 1)
            desviacion = math.sqrt(varianza)

        return {
            "ganancia_total": round(ganancia_acumulada_global, 2),
            "ganancia_promedio": round(promedio, 2),
            "ganancia_maxima": round(max(ganancias_diarias), 2),
            "ganancia_minima": round(min(ganancias_diarias), 2),
            "desviacion_estandar": round(desviacion, 2),
            "vectores_estado": vectores_estado
        }