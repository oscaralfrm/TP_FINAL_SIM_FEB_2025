def validar_parametros(data):
    errores = []

    # 1. Validar demandas
    if not data.get('demandas') or any(d < 0 for d in data['demandas']):
        errores.append("Las demandas deben ser números positivos.")

    # 2. Validar probabilidades
    probs = data.get('probabilidades', [])
    if not probs or any(p < 0 or p > 1 for p in probs):
        errores.append("Las probabilidades deben estar entre 0 y 1.")
    if abs(sum(probs) - 1.0) > 0.001:
        errores.append(f"La suma de probabilidades debe ser 1.0 (actual: {sum(probs)}).")

    if len(probs) != len(data.get('demandas', [])):
        errores.append("La cantidad de probabilidades debe coincidir con la cantidad de demandas.")

    # 3. Validar costos
    if data.get('costo_unitario', 0) < 0: errores.append("Costo unitario inválido.")
    if data.get('precio_venta', 0) < 0: errores.append("Precio venta inválido.")

    # 4. Validar días
    dias = data.get('dias_simulacion', 0)
    if not (1 <= dias <= 100000):
        errores.append("Días a simular debe estar entre 1 y 100,000.")

    # 5. Validar visualización
    vis = data.get('visualizacion', {})
    if vis.get('cantidad_dias', 0) > 500:
        errores.append("No se pueden visualizar más de 500 iteraciones en la tabla.")

    return errores