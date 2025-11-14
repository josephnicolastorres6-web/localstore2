const form = document.getElementById('formUsuario');
const campos = ['nombre', 'email', 'edad'];
const barra = document.getElementById('barraProgreso');
const contenedorDatos = document.getElementById('datosMostrados');
const toggleBtn = document.getElementById('toggleDatos'); // usado en varios lugares

// Validar campos
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

// Actualizar barra de progreso
function actualizarBarra() {
  let completados = 0;
  campos.forEach(campo => {
    if (document.getElementById(campo).value.trim() !== "") completados++; 
  });
  const porcentaje = (completados / campos.length) * 100;
  barra.style.width = `${porcentaje}%`;
}

form.addEventListener('input', actualizarBarra);

// Guardar usuario
document.getElementById('guardar').addEventListener('click', () => {
  let valido = true;
  if (!validarCampo('nombre', 'El nombre es obligatorio.')) valido = false;
  if (!validarCampo('email', 'El email es obligatorio.')) valido = false;
  if (!validarCampo('edad', 'La edad es obligatoria.')) valido = false;

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

  // Si el panel de datos estaba abierto, refrescamos la lista y mantenemos el panel abierto
  const panelAbierto = contenedorDatos.style.display === 'block';
  if (panelAbierto) {
    mostrarUsuarios();
    toggleBtn.textContent = "Ocultar Datos";
  }

  form.reset();
  barra.style.width = "0%";
  // Solo ocultamos el contenedor si estaba cerrado antes; si estaba abierto lo dejamos mostrado (ya refrescado)
  if (!panelAbierto) contenedorDatos.style.display = 'none';

  campos.forEach(campo => {
    document.getElementById(`error-${campo}`).textContent = "";
  });

  alert('✅ Datos guardados correctamente.');
});

// Mostrar usuarios con botón eliminar individual
function mostrarUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (!usuarios || usuarios.length === 0) {
    contenedorDatos.innerHTML = `<p><strong>⚠️ No hay datos guardados.</strong></p>`;
    contenedorDatos.style.display = 'block';
    toggleBtn.textContent = "Ver Datos";
    return;
  }

  let html = "";
  usuarios.forEach((usuario, index) => {
    html += `
      <div class="usuario-card" data-index="${index}">
        <p><strong>Usuario #${index + 1}</strong></p>
        <p><strong>Nombre:</strong> ${usuario.nombre}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Edad:</strong> ${usuario.edad}</p>
        <button class="eliminarUsuario" data-index="${index}">🗑️ Eliminar este usuario</button>
        <hr>
      </div>
    `;
  });

  contenedorDatos.innerHTML = html;
  contenedorDatos.style.display = 'block';

  // Asignar evento a cada botón eliminar individual
  document.querySelectorAll('.eliminarUsuario').forEach(btn => {
    btn.addEventListener('click', eliminarUsuario);
  });
}

// Eliminar usuario individual (handler)
function eliminarUsuario(e) {
  const index = parseInt(e.target.getAttribute('data-index'), 10);
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (isNaN(index) || index < 0 || index >= usuarios.length) return;

  usuarios.splice(index, 1);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert('🗑️ Usuario eliminado con éxito.');

  // Si quedan usuarios, refrescar; si no, mostrar mensaje vacío
  mostrarUsuarios();
}

// Botón Ver / Ocultar Datos (toggle)
toggleBtn.addEventListener('click', () => {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (!usuarios || usuarios.length === 0) {
    alert('⚠️ No hay datos para mostrar.');
    return;
  }

  if (contenedorDatos.style.display === 'none' || contenedorDatos.style.display === '') {
    mostrarUsuarios();
    toggleBtn.textContent = 'Ocultar Datos';
  } else {
    contenedorDatos.style.display = 'none';
    toggleBtn.textContent = 'Ver Datos';
  }
});

// Borrar todos los datos
document.getElementById('borrar').addEventListener('click', () => {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  if (!usuarios || usuarios.length === 0) {
    alert('⚠️ No hay datos para borrar.');
    return;
  }

  localStorage.removeItem('usuarios');
  contenedorDatos.style.display = 'none';
  barra.style.width = '0%';
  toggleBtn.textContent = 'Ver Datos';
  alert('🗑️ Datos borrados del almacenamiento.');
});

// Limpiar formulario (con comprobación si hay datos)
document.getElementById('limpiar').addEventListener('click', () => {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Si no hay datos en storage, avisar (tal como pediste)
  if (!usuarios || usuarios.length === 0) {
    alert('⚠️ No hay datos para limpiar.');
    return;
  }

  // Solo limpiar el formulario, no borrar los usuarios del storage
  form.reset();
  barra.style.width = '0%';
  contenedorDatos.style.display = 'none';
  toggleBtn.textContent = 'Ver Datos';
  campos.forEach(campo => {
    document.getElementById(`error-${campo}`).textContent = '';
  });

  alert('🧹 Formulario limpio.');
});

// Comprobación inicial si no hay nada
function todoVacio() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios'));
  return !usuarios || usuarios.length === 0;
}

if (todoVacio()) {
  // No interrumpimos la ejecución; solo una notificación inicial (puedes quitarla si molesta)
  // alert('📂 No hay datos guardados en el almacenamiento.');
}
