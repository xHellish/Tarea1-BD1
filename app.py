# Model
import BD_model

# Librerías
from flask import Flask, render_template, request

# Crear la app
app = Flask(__name__)
PORT = 5500

# Configuraciones
app.config['TEMPLATES_AUTO_RELOAD'] = True  # Recargar plantillas en hosting time

# --------------------------------------------------------------------------------- #
# Rutas

# Ruta principal
@app.route('/')  # Renderizar la plantilla index.html en la ruta principal
def index():
    return render_template('index.html')

# Ruta para obtener empleados
@app.route('/obtener-empleados')
def obtener_empleados():
    empleados = BD_model.obtenerEmpleados()
    return {'empleados': empleados}

# Ruta para agregar empleado
@app.route('/agregar-empleado', methods=['POST'])
def agregar_empleado():
    nombre = request.json['nombre']
    salario = request.json['salario']
    result = BD_model.agregarEmpleado(nombre, salario)
    return result

# --------------------------------------------------------------------------------- #
# Iniciar el servidor
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=PORT)