
-- Crear tabla empleados si no existe
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(64),
    salario INT
);

-- Cambiar delimitador para crear procedures
DELIMITER $$

-- Procedure para mostrar empleados
DROP PROCEDURE IF EXISTS MostrarEmpleados$$
CREATE PROCEDURE MostrarEmpleados()
BEGIN
    SELECT * FROM empleados;
END$$

-- Procedure para agregar empleado
DROP PROCEDURE IF EXISTS AgregarEmpleado$$
CREATE PROCEDURE AgregarEmpleado(
    IN p_nombre VARCHAR(64),
    IN p_salario INT
)
BEGIN
    INSERT INTO empleados (nombre, salario)
    VALUES (p_nombre, p_salario);
END$$

-- Volver al delimitador normal
DELIMITER ;

-- Verificar procedures
-- SHOW PROCEDURE STATUS WHERE Db = 'Tarea1BDS2';

-- CALL MostrarEmpleados();





    