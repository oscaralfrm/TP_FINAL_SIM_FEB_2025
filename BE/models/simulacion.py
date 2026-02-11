class FilaVectorEstado:
    def __init__(self, dia, rnd, demanda, cantidad_comprada,
                 precio_venta, precio_devolucion, costo_unitario, costo_op,
                 ganancia_acum_anterior):
        self.dia = dia
        self.rnd = rnd
        self.demanda = demanda
        self.cantidad_comprada = cantidad_comprada

        # Cálculos de negocio
        self.ventas = min(self.demanda, self.cantidad_comprada)
        self.devoluciones = max(0, self.cantidad_comprada - self.demanda)
        self.demanda_insatisfecha = max(0, self.demanda - self.cantidad_comprada)

        self.ingreso_ventas = self.ventas * precio_venta
        self.ingreso_devoluciones = self.devoluciones * precio_devolucion
        self.costo_compra = self.cantidad_comprada * costo_unitario
        self.costo_oportunidad = self.demanda_insatisfecha * costo_op

        # Ganancias
        ingresos = self.ingreso_ventas + self.ingreso_devoluciones
        costos = self.costo_compra + self.costo_oportunidad

        self.ganancia_dia = ingresos - costos
        self.ganancia_acumulada = ganancia_acum_anterior + self.ganancia_dia

    def to_dict(self):
        """Convierte el objeto a diccionario para JSON response"""
        return {
            "dia": self.dia,
            "rnd": round(self.rnd, 4),
            "demanda": self.demanda,
            "cantidad_comprada": self.cantidad_comprada,
            "ventas": self.ventas,
            "devoluciones": self.devoluciones,
            "demanda_insatisfecha": self.demanda_insatisfecha,
            "ingreso_ventas": round(self.ingreso_ventas, 2),
            "ingreso_devoluciones": round(self.ingreso_devoluciones, 2),
            "costo_compra": round(self.costo_compra, 2),
            "costo_oportunidad": round(self.costo_oportunidad, 2),
            "ganancia_dia": round(self.ganancia_dia, 2),
            "ganancia_acumulada": round(self.ganancia_acumulada, 2)
        }