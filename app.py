# Model
import BD_model

# Librerías
from flask import Flask, render_template, request

# Crear la app
app = Flask(__name__)
PORT = 5500

# Configuraciones
app.config['TEMPLATES_AUTO_RELOAD'] = True  # Recargar plantillas en hosting time

# Ruta principal
@app.route('/')  # Renderizar la plantilla index.html en la ruta principal
def index():
    return render_template('index.html')

# Iniciar el servidor
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=PORT)