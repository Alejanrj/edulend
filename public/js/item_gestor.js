
document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("table tbody") || document.querySelector("table");

    mostrarArticulos();

    function obtenerArticulos() {
        return JSON.parse(localStorage.getItem("articulosPrestados")) || [];
    }

    function guardarArticulos(articulos) {
        localStorage.setItem("articulosPrestados", JSON.stringify(articulos));
    }

    function mostrarArticulos() {
        const articulos = obtenerArticulos();
        tabla.innerHTML = "";

        articulos.forEach((a, i) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${a.id}</td>
                <td>${a.nombre}</td>
                <td>${a.estado}</td>
                <td>${a.cedula}</td>
                <td>${a.usuario}</td>
                <td>${a.fechaPrestamo}</td>
                <td>${a.fechaLimite}</td>
                <td>
                    ${
                        a.usuario === "disponible"
                            ? `<button class="asignar" data-index="${i}">Asignar usuario</button>
                               <button class="estado" data-index="${i}">Cambiar estado</button>`
                            : `<button class="notificar" data-index="${i}">Enviar notificación</button>
                               <button class="prorroga" data-index="${i}">Gestionar prórroga</button>`
                    }
                </td>
            `;
            tabla.appendChild(fila);
        });

        agregarEventos();
    }

    function agregarEventos() {
        document.querySelectorAll(".asignar").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                asignarUsuario(index);
            });
        });

        document.querySelectorAll(".estado").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                cambiarEstado(index);
            });
        });

        document.querySelectorAll(".notificar").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                enviarNotificacion(index);
            });
        });

        document.querySelectorAll(".prorroga").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                gestionarProrroga(index);
            });
        });
    }

    function asignarUsuario(index) {
        const articulos = obtenerArticulos();
        const a = articulos[index];

        const nombre = prompt("Nombre del usuario:");
        const cedula = prompt("Cédula:");
        const fechaPrestamo = new Date().toLocaleDateString();
        const fechaLimite = calcularFechaEntrega();

        if (nombre && cedula) {
            a.usuario = nombre;
            a.cedula = cedula;
            a.fechaPrestamo = fechaPrestamo;
            a.fechaLimite = fechaLimite;
            guardarArticulos(articulos);
            mostrarArticulos();
            alert(`Artículo asignado correctamente a ${nombre}`);
        }
    }

    function cambiarEstado(index) {
        const articulos = obtenerArticulos();
        const a = articulos[index];

        const nuevoEstado = prompt("Nuevo estado del artículo:", a.estado);
        if (nuevoEstado) {
            a.estado = nuevoEstado;
            guardarArticulos(articulos);
            mostrarArticulos();
        }
    }

    function enviarNotificacion(index) {
        const articulos = obtenerArticulos();
        const a = articulos[index];
        alert(`Notificación enviada a ${a.usuario} (artículo: ${a.nombre}).`);
    }

    function gestionarProrroga(index) {
        const articulos = obtenerArticulos();
        const a = articulos[index];

        const nuevaFecha = prompt(
            "Ingrese nueva fecha límite (DD/MM/AAAA):",
            a.fechaLimite
        );

        if (nuevaFecha) {
            a.fechaLimite = nuevaFecha;
            guardarArticulos(articulos);
            mostrarArticulos();
            alert(`Prórroga actualizada. Nueva fecha límite: ${nuevaFecha}`);
        }
    }

    function calcularFechaEntrega() {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 7);
        return fecha.toLocaleDateString();
    }

    if (obtenerArticulos().length === 0) {
        const ejemplo = [
            {
                id: "pc_01",
                nombre: "Computador",
                estado: "En buen estado",
                cedula: "1069696969",
                usuario: "Riquelme Buenavista",
                fechaPrestamo: "01/03/2025",
                fechaLimite: "15/05/2025"
            },
            {
                id: "bk_07",
                nombre: "Libro cálculo diferencial",
                estado: "En buen estado",
                cedula: "1069696969",
                usuario: "Lauria Berrio",
                fechaPrestamo: "15/02/2025",
                fechaLimite: "01/03/2025"
            },
            {
                id: "pc_02",
                nombre: "Computador",
                estado: "En buen estado",
                cedula: "disponible",
                usuario: "disponible",
                fechaPrestamo: "disponible",
                fechaLimite: "disponible"
            }
        ];
        guardarArticulos(ejemplo);
        mostrarArticulos();
    }
});
