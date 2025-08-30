
// Función para formatear moneda (CRC)
function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(monto);
}

// Función para mostrar empleados en el grid
function mostrarEmpleadosGrid() {
    const listaEmpleados = document.getElementById('lista-empleados');
    
    // Mostrar indicador de carga
    listaEmpleados.innerHTML = `
        <div class="text-center py-5" style="grid-column: 1 / -1;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando empleados...</span>
            </div>
        </div>
    `;

    fetch('/obtener-empleados')  // Petición GET para obtener empleados
        .then(response => response.json())  // Convertir la respuesta a JSON
        .then(data => {
            if (data.error) {  // Si hay un error con la petición
                throw new Error(data.error);
            }

            // Si no hay empleados (la lista del JSON está vacía)
            if (data.empleados.length === 0) {
                listaEmpleados.innerHTML = `
                    <div class="text-center py-5" style="grid-column: 1 / -1; color: #6b7280;">
                        <i class="fas fa-user-slash fa-3x mb-3"></i>
                        <p>No hay empleados registrados</p>
                    </div>
                `;
                return;
            }

            // Limpiar el contenedor y agregar encabezados y contenedor con scroll
            // Map() para recorrer la lista de empleados y agregarlos al contenedor
            listaEmpleados.innerHTML = `
                <div class="empleado-header">
                    <div>ID</div>
                    <div>Nombre</div>
                    <div>Salario</div>
                </div>
                <div class="contenedor-tabla">
                    ${data.empleados.map(empleado => `
                        <div class="empleado-fila">
                            <div class="empleado-id" style="margin: 0; display: flex; align-items: center;">
                                #${empleado.id}
                            </div>
                            <div class="empleado-nombre" style="font-size: 1rem; margin: 0; display: flex; align-items: center;">
                                ${empleado.nombre}
                            </div>
                            <div class="empleado-salario" style="font-size: 1rem; margin: 0; display: flex; align-items: center; justify-content: flex-start;">
                                ${formatearMoneda(empleado.salario)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al cargar empleados:', error);
            listaEmpleados.innerHTML = `
                <div class="alert alert-danger" style="grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error al cargar los empleados: ${error.message}
                </div>
            `;
        });
}

// Función para validar el formulario
function validarFormulario(nombre, salario) {
    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === '') {
        alert('Error 50001: Por favor ingrese el nombre del empleado');
        return { isValid: false };
    }

    // Validar que el salario no esté vacío
    if (!salario || salario.trim() === '') {
        alert('Error 50002: Por favor ingrese el salario del empleado');
        return { isValid: false };
    }

    // Validar que el salario sea un número válido (acepta decimales con punto o coma)
    const salarioNum = parseFloat(salario.replace(',', '.'));
    if (isNaN(salarioNum) || salarioNum <= 0) {
        alert('Error 50003: Por favor ingrese un valor numérico válido para el salario (ej: 500000 o 500000.50)');
        return { isValid: false };
    }

    return { 
        isValid: true,
        nombre: nombre.trim(),
        salario: salarioNum
    };
}

// Función para agregar empleado
function agregarEmpleado() {
    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre_input').value;
    const salarioInput = document.getElementById('salario_input');
    const salario = salarioInput.value;
    
    // Validar el formulario antes de enviar
    const validacion = validarFormulario(nombre, salario);
    if (!validacion.isValid) {
        return; // Detener la ejecución si la validación falla
    }

    // Usar los valores ya validados y formateados
    const { nombre: nombreValidado, salario: salarioValidado } = validacion;
    const salarioNum = parseFloat(salarioValidado).toFixed(2);

    // Petición POST para agregar un nuevo empleado
    fetch('/agregar-empleado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Indicar que el contenido es JSON
        },
        body: JSON.stringify({ 
            nombre: nombreValidado, 
            salario: salarioNum 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        mostrarEmpleadosGrid();
        
        // Mantener el modal abierto
        // Limpiar solo el campo de nombre para facilitar la inserción de múltiples empleados
        document.getElementById('nombre_input').value = '';
        document.getElementById('salario_input').value = '';

        // Enfocar el campo de nombre para la siguiente entrada
        document.getElementById('nombre_input').focus();
    })
    .catch(error => {
        console.error('Error al agregar empleado:', error);
        alert('Error 50004: Error al agregar empleado: ' + error.message);
    });
}

// Cerrar el modal al hacer clic en el botón Regresar
const regresarBtn = document.getElementById('regresar-modal');
if (regresarBtn) {
    regresarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('modal-agregar').style.display = 'none';
    });
}

// Manejar el envío del formulario
const formInsertar = document.getElementById('form-insertar');
if (formInsertar) {
    formInsertar.addEventListener('submit', function(e) {
        e.preventDefault();
        agregarEmpleado();
    });
}

// Cerrar el modal al hacer clic fuera del contenido
document.getElementById('modal-agregar').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// Evento para abrir el modal
const agregarBtn = document.getElementById('agregar-empleado');
if (agregarBtn) {
    agregarBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-agregar');
        if (modal) modal.style.display = 'block';
    });
}

// Evento para mostrar empleados al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarEmpleadosGrid();
});

