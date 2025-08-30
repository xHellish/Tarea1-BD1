# Librerías
import mysql.connector

# Variable global para la conexión
conexion = None
def get_connection():
    global conexion
    if conexion is None or not conexion.is_connected():
        try:
            conexion = mysql.connector.connect(
                host="127.0.0.1",
                user="Hellish",
                password="xxx333xxx",
                database="tarea1bds2"
            )
            print("Nueva conexión establecida")
        except mysql.connector.Error as err:
            print(f"Error de conexión: {err}")
            raise
    return conexion

# Obtener empleados en formato JSON
def obtenerEmpleados():
    cursor = None
    try:
        # Obtener conexión
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Ejecutar procedimiento
        cursor.callproc("MostrarEmpleados")
        
        # Obtener resultados
        empleados = []
        for result in cursor.stored_results():
            empleados = result.fetchall()
            
        return empleados
        
    except mysql.connector.Error as err:
        print(f"Error al obtener empleados: {err}")
        return {'error': str(err)}

# Agregar empleado
def agregarEmpleado(nombre, salario):
    cursor = None
    try:
        # Obtener conexión
        conn = get_connection()
        cursor = conn.cursor()
        
        # Ejecutar procedimiento
        cursor.callproc("AgregarEmpleado", (nombre, salario))
        
        # Confirmar transacción
        conn.commit()
        
        return {'success': True}
        
    except mysql.connector.Error as err:
        print(f"Error al agregar empleado: {err}")
        return {'error': str(err)}


