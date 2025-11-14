const form = document.getElementById('formUsuario');
const campos = ['nombre', 'email', 'edad'];
const barra = document.getElementById('barraProgreso');
const contenedorDatos = document.getElementById('datosMostrados');
const toggleBtn = document.getElementById('toggleDatos');

// ------------------------------------------------------
// VALIDAR CAMPOS
// ------------------------------------------------------
function validarCampo(id, mensaje) {
  const campo = document.getElementById(id);
  const error = document.getElementById(`error-${id}`);
  if (campo.value.trim() === "") {
    error.textContent = mensaje;
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}

// ------------------------------------------------------
// BARRA DE PROGRESO
// ------------------------------------------------------
function actualizarBarra() {
  let completados = 0;
  campos.forEach(campo => {
    if (document.getElementById(campo).value.trim() !== "") completados++;
  });
  const porcentaje = (completados / campos.length) * 100;
  barra.style.width = `${porcentaje}%`;
}
form.addEventListener('input', actualizarBarra);

// ------------------------------------------------------
// GUARDAR DATOS
// ------------------------------------------------------
document.getElementById('guardar').addEventListener('click', () => {
  let valido = true;

  if (!validarCampo('nombre', 'El nombre es obligatorio.')) valido = false;
  if (!validarCampo('email', 'El email es obligatorio.')) valido = false;
  if (!validarCampo('edad', 'La edad es obligatoria.')) valido = false;

  // Si no es válido, no guardar
  if (!valido) return;

  const datos = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    edad: document.getElementById('edad').value
  };

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios.push(datos);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert('💾 Guardando datos...');

  form.reset();
  barra.style.width = "0%";

  // QUITAR MENSAJES ROJOS AL LIMPIAR
  campos.forEach(campo => {
    document.getElementById(`error-${campo}`).textContent = "";
  });

  // REFRESCAR AUTOMÁTICAMENTE SI ESTÁN VISIBLES
  if (contenedorDatos.style.display === 'block') {
    mostrarUsuarios();
  }

  alert('✅ Datos guardados correctamente.');
});

// ------------------------------------------------------
// MOSTRAR USUARIOS
// ------------------------------------------------------
function mostrarUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios'));

  if (!usuarios || usuarios.length === 0) {
    contenedorDatos.innerHTML = `<p><strong>⚠️ No hay datos guardados.</strong></p>`;
    contenedorDatos.style.display = 'block';
    toggleBtn.textContent = "Ocultar Datos";
    return;
  }

  let html = "";
  usuarios.forEach((usuario, index) => {
    html += `
      <div style="margin-bottom: 10px;">
        <p><strong>Usuario #${index + 1}</strong></p>
        <p><strong>Nombre:</strong> ${usuario.nombre}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Edad:</strong> ${usuario.edad}</p>

        <button onclick="eliminarUsuario(${index})"
          style="padding:5px 10px; background:red; color:white; border:none; border-radius:5px; cursor:pointer;">
          Eliminar Usuario
        </button>
        <hr>
      </div>
    `;
  });

  contenedorDatos.innerHTML = html;
  contenedorDatos.style.display = 'block';
  toggleBtn.textContent = "Ocultar Datos";
}

// ------------------------------------------------------
// ELIMINAR UN SOLO USUARIO
// ------------------------------------------------------
function eliminarUsuario(index) {
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios.splice(index, 1);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert("🗑️ Usuario eliminado.");

  mostrarUsuarios();
}

// ------------------------------------------------------
// BOTÓN MOSTRAR / OCULTAR
// ------------------------------------------------------
toggleBtn.addEventListener('click', () => {
  if (contenedorDatos.style.display === 'none' || contenedorDatos.style.display === '') {
    mostrarUsuarios();
  } else {
    contenedorDatos.style.display = 'none';
    toggleBtn.textContent = "Mostrar Datos";
  }
});

// ------------------------------------------------------
// BORRAR TODOS LOS DATOS
// ------------------------------------------------------
document.getElementById('borrar').addEventListener('click', () => {
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (usuarios.length === 0) {
    alert("⚠️ No hay datos para borrar.");
    return;
  }

  localStorage.removeItem('usuarios');
  contenedorDatos.style.display = 'none';
  toggleBtn.textContent = "Mostrar Datos";

  alert('🗑️ Todos los datos han sido borrados.');
});

// ------------------------------------------------------
// LIMPIAR FORMULARIO **Y BORRAR MENSAJES ROJOS**
// ------------------------------------------------------
document.getElementById('limpiar').addEventListener('click', () => {
  form.reset();
  barra.style.width = "0%";

  // QUITAR MENSAJES ROJOS
  campos.forEach(campo => {
    document.getElementById(`error-${campo}`).textContent = "";
  });

  alert("🧹 Formulario limpio.");
});
