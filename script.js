const form = document.getElementById('formUsuario');
const campos = ['nombre', 'email', 'edad'];
const barra = document.getElementById('barraProgreso');
const contenedorDatos = document.getElementById('datosMostrados');

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

// Barra
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

  alert("💾 Guardando datos...");

  form.reset();
  barra.style.width = "0%";
  campos.forEach(campo => {
    document.getElementById(`error-${campo}`).textContent = "";
  });

  alert("✅ Datos guardados correctamente.");

  // ⭐⭐⭐
  // 🔥 SI EL PANEL DE DATOS ESTÁ ABIERTO → AUTO-REFRESCAR LISTA
  // ⭐⭐⭐
  if (contenedorDatos.style.display === "block") {
    mostrarUsuarios();
    toggleBtn.textContent = "Ocultar Datos";
  }
});

// Mostrar usuarios + eliminar individual
function mostrarUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios'));

  if (!usuarios || usuarios.length === 0) {
    contenedorDatos.innerHTML = `<p><strong>⚠️ No hay datos guardados.</strong></p>`;
    contenedorDatos.style.display = 'block';
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
        <button class="eliminarUsuarioBtn">Eliminar Usuario</button>
        <hr>
      </div>
    `;
  });

  contenedorDatos.innerHTML = html;
  contenedorDatos.style.display = 'block';

  document.querySelectorAll('.eliminarUsuarioBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.parentElement.getAttribute('data-index');
      eliminarUsuario(index);
    });
  });
}

// Eliminar usuario individual
function eliminarUsuario(index) {
  let usuarios = JSON.parse(localStorage.getItem('usuarios'));
  usuarios.splice(index, 1);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  mostrarUsuarios();
  alert("🗑️ Usuario eliminado.");
}

// Botón ver/ocultar
const toggleBtn = document.getElementById('toggleDatos');

toggleBtn.addEventListener('click', () => {
  const usuarios = JSON.parse(localStorage.getItem('usuarios'));

  if (!usuarios || usuarios.length === 0) {
    alert("⚠️ No hay datos para mostrar.");
    return;
  }

  if (contenedorDatos.style.display === 'none' || contenedorDatos.style.display === '') {
    mostrarUsuarios();
    toggleBtn.textContent = "Ocultar Datos";
  } else {
    contenedorDatos.style.display = 'none';
    toggleBtn.textContent = "Ver Datos";
  }
});

// Borrar todo
document.getElementById('borrar').addEventListener('click', () => {
  localStorage.removeItem('usuarios');
  contenedorDatos.style.display = 'none';
  barra.style.width = "0%";
  toggleBtn.textContent = "Ver Datos";
  alert("🗑️ Datos eliminados.");
});

// Limpiar formulario
document.getElementById('limpiar').addEventListener('click', () => {
  barra.style.width = "0%";
  contenedorDatos.style.display = 'none';
  toggleBtn.textContent = "Ver Datos";
  campos.forEach(campo => {
    document.getElementById(`error-${campo}`).textContent = "";
  });
});

function todoVacio() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios'));
  return !usuarios || usuarios.length === 0;
}

if (todoVacio()) {
  alert("📂 No hay datos guardados en el almacenamiento.");
}
