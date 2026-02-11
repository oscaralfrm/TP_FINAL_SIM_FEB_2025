import random

def generar_rnd():
    """Genera un número aleatorio uniforme [0, 1)."""
    return random.random()

def calcular_probs_acumuladas(probabilidades):
    """
    Convierte lista de probabilidades [0.1, 0.2] en acumuladas [0.1, 0.3].
    """
    acumuladas = []
    suma = 0.0
    for p in probabilidades:
        suma += p
        acumuladas.append(suma)
    return acumuladas

def obtener_demanda(rnd, demandas, probs_acumuladas):
    """
    Busca la demanda correspondiente al RND usando las probabilidades acumuladas.
    """
    for i, prob in enumerate(probs_acumuladas):
        if rnd < prob:
            return demandas[i]
    return demandas[-1]  # Retorna el último por defecto (por seguridad de redondeo)