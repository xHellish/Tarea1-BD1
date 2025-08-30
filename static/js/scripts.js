
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

// Función para agregar empleado
function agregarEmpleado() {

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre_input').value;
    const salario = document.getElementById('salario_input').value;
    
    // Petición POST para agregar un nuevo empleado
    fetch('/agregar-empleado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Indicar que el contenido es JSON
        },
        body: JSON.stringify({ nombre, salario })
    })
    .then(response => {
        response.json();
        mostrarEmpleadosGrid();
    })
    .catch(error => {
        console.error('Error al agregar empleado:', error);
    });
}

// Cerrar el modal al hacer clic en el botón Regresar
document.getElementById('regresar-modal').addEventListener('click', (e) => {
    e.preventDefault();  // Prevenir el envío normal del formulario (recargar la página)
    document.getElementById('modal-agregar').style.display = 'none';
});

// Manejar el envío del formulario
document.getElementById('form-insertar').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevenir el envío normal del formulario (recargar la página) 
    agregarEmpleado();
});

// Cerrar el modal al hacer clic fuera del contenido
document.getElementById('modal-agregar').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// Evento para abrir el modal
document.getElementById('agregar-empleado').addEventListener('click', () => {
    document.getElementById('modal-agregar').style.display = 'block';
});

// Evento para mostrar empleados al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarEmpleadosGrid();
});

