// reportes.js — Manejo de reportes con localStorage y SweetAlert2

document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("#tabla-reportes");
    const tbody = tabla.querySelector("tbody") || tabla; 
    const formFiltro = document.querySelector("#form-filtro");
    const inputNombre = document.querySelector("#filtro_nom");

    mostrarReportes();

    function obtenerReportes() {
        return JSON.parse(localStorage.getItem("reportesUsuarios")) || [];
    }

    function guardarReportes(reportes) {
        localStorage.setItem("reportesUsuarios", JSON.stringify(reportes));
    }

    function mostrarReportes(filtro = "") {
        const reportes = obtenerReportes();
        tbody.innerHTML = "";

        const filtrados = reportes.filter(r =>
            r.nombre.toLowerCase().includes(filtro.toLowerCase())
        );

        filtrados.forEach((r, i) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${r.nombre}</td>
                <td>${r.apellido}</td>
                <td>${r.correo}</td>
                <td>${r.telefono}</td>
                <td>
                    <button type="button" class="editar" data-index="${i}">Editar</button>
                    <button type="button" class="eliminar" data-index="${i}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        agregarEventosBotones();
    }

    function agregarEventosBotones() {
        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                eliminarReporte(index);
            });
        });

        document.querySelectorAll(".editar").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                editarReporte(index);
            });
        });
    }

    function eliminarReporte(index) {
        Swal.fire({
            title: "¿Seguro que deseas eliminar este reporte?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const reportes = obtenerReportes();
                reportes.splice(index, 1);
                guardarReportes(reportes);
                mostrarReportes();
                Swal.fire("Eliminado", "El usuario fue eliminado correctamente.", "success");
            }
        });
    }

    function editarReporte(index) {
        const reportes = obtenerReportes();
        const r = reportes[index];

        Swal.fire({
            title: 'Editar información',
            html:
                `<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${r.nombre}">
                 <input id="swal-apellido" class="swal2-input" placeholder="Apellido" value="${r.apellido}">
                 <input id="swal-correo" class="swal2-input" placeholder="Correo" value="${r.correo}">
                 <input id="swal-telefono" class="swal2-input" placeholder="Teléfono" value="${r.telefono}">`,
            confirmButtonText: 'Guardar',
            showCancelButton: true,
            focusConfirm: false,
            preConfirm: () => {
                const nuevoNombre = document.getElementById('swal-nombre').value.trim();
                const nuevoApellido = document.getElementById('swal-apellido').value.trim();
                const nuevoCorreo = document.getElementById('swal-correo').value.trim();
                const nuevoTelefono = document.getElementById('swal-telefono').value.trim();

                if (!nuevoNombre || !nuevoApellido || !nuevoCorreo || !nuevoTelefono) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }

                return { nuevoNombre, nuevoApellido, nuevoCorreo, nuevoTelefono };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                reportes[index] = {
                    nombre: result.value.nuevoNombre,
                    apellido: result.value.nuevoApellido,
                    correo: result.value.nuevoCorreo,
                    telefono: result.value.nuevoTelefono
                };
                guardarReportes(reportes);
                mostrarReportes();
                Swal.fire('Actualizado', 'La información fue actualizada con éxito.', 'success');
            }
        });
    }

    formFiltro.addEventListener("submit", (e) => {
        e.preventDefault();
        mostrarReportes(inputNombre.value);
    });

    if (obtenerReportes().length === 0) {
        const ejemplo = [
            { nombre: "Wilder", apellido: "García", correo: "wilder.garciaramirez@gmail.com", telefono: "3136980570" },
            { nombre: "Sara", apellido: "Puerta", correo: "example@gmail.com", telefono: "3136980570" }
        ];
        guardarReportes(ejemplo);
        mostrarReportes();
    }
});
