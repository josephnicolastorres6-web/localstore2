const form = document.getElementById('formUsuario');
const campos = ['nombre', 'email', 'edad'];
const barra = document.getElementById('barraProgreso');
const contenedorDatos = document.getElementById('datosMostrados');

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

function actualizarBarra() {
  let completados = 0;
  campos.forEach(campo => {
    if (document.getElementById(campo).value.trim() !== "") completados++;
  });
  const porcentaje = (completados / campos.length) * 100;
  barra.style.width = `${porcentaje}%`;
}

form.addEventListener('input', actualizarBarra);

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

  // Guardar en localStorage
  localStorage.setItem('usuario', JSON.stringify(datos));

  // Mostrar mensaje de éxito
  alert('✅ Datos guardados correctamente.');

  // 🔹 Limpiar formulario después de guardar
  form.reset();
  barra.style.width = "0%";
  contenedorDatos.style.display = 'none';

  // 🔹 Borrar mensajes de error
  campos.forEach(campo => {
    document.getElementById(`error-${campo}`).textContent = "";
  });
});

document.getElementById('verDatos').addEventListener('click', () => {
  const datos = JSON.parse(localStorage.getItem('usuario'));
  if (!datos) {
    contenedorDatos.style.display = 'none';
    return alert('⚠️ No hay datos guardados.');
  }

  contenedorDatos.innerHTML = `
    <h3>👤 Datos Guardados</h3>
    <p><strong>Nombre:</strong> ${datos.nombre}</p>
    <p><strong>Email:</strong> ${datos.email}</p>
    <p><strong>Edad:</strong> ${datos.edad}</p>
  `;
  contenedorDatos.style.display = 'block';
});

document.getElementById('borrar').addEventListener('click', () => {
  localStorage.removeItem('usuario');
  contenedorDatos.style.display = 'none';
  barra.style.width = "0%";
  alert('🗑️ Datos borrados del almacenamiento.');
});

document.getElementById('limpiar').addEventListener('click', () => {
  barra.style.width = "0%";
  contenedorDatos.style.display = 'none';
  campos.forEach(campo => {
    document.getElementById(`error-${campo}`).textContent = "";
  });
});
