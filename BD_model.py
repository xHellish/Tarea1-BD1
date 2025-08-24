# Librerías
import mysql.connector

# Conexión
try:
    conexion = mysql.connector.connect(
    host="127.0.0.1",
    user="Hellish",           # tu usuario
    password="xxx333xxx",
    database="tarea1bds2"
)
except mysql.connector.Error as err:
    print("Error: ", err)
    exit()

# Cursor para ejecutar procedimientos
cursor = conexion.cursor()

# Llamar al procedure sin parámetros

print("Llamando al procedure MostrarEmpleados: ")
cursor.callproc("MostrarEmpleados", ())

# Iterar resultados
for result in cursor.stored_results():  # <- con paréntesis
    for fila in result.fetchall():
        print(fila)


