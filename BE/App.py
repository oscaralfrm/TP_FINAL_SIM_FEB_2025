from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.validaciones import validar_parametros
from services.montecarlo_service import MontecarloService
import traceback

app = Flask(__name__)
CORS(app)  # Habilita peticiones desde el frontend

montecarlo_service = MontecarloService()


@app.route('/simular', methods=['POST'])
def simular():
    try:
        data = request.json

        # 1. Validar inputs
        errores = validar_parametros(data)
        if errores:
            return jsonify({"success": False, "errors": errores}), 400

        # 2. Ejecutar servicio
        resultado = montecarlo_service.simular_todo(data)

        return jsonify({
            "success": True,
            "data": resultado
        }), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": "Error interno del servidor",
            "error": str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)