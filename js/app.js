const lista = [];
const personas = [];
const formularioPersona = document.getElementById("formularioPersona");
const listaPersonas = document.getElementById("listaPersonas");
const montoIndividual = document.getElementById("montoIndividual");
const seccionLista = document.getElementById("seccionLista");
const listaPagos = document.getElementById("listaPagos");
const seccionResultados = document.getElementById("seccionResultados");

seccionResultados.style.display = "none";

/*Visibilidad Seccion Lista Personas*/
function actualizarVisibilidad() {
  if (lista.length > 0) {
    seccionLista.style.display = "block"; // Mostrar si hay datos
    montoIndividual.style.display = "block";
    listaPagos.innerHTML = "<p class='text-center text-danger'>Por favor, ingrese participantes.</p>";
  } else {
    seccionLista.style.display = "none"; // Ocultar si está vacío
    montoIndividual.style.display = "none";
  }
}
actualizarVisibilidad();

function agregarPersona() {
  const nombre = document.getElementById("nombre").value;
  const cantidad = parseFloat(document.getElementById("cantidad").value, 10);

  /*Validación de datos*/
  if (!nombre || nombre.trim() === "") {
    mostrarModal("¡Debes ingresar un nombre o apodo!");
    return;
  }
      
  if (isNaN(cantidad) || cantidad < 0) {
    mostrarModal("¡Debes ingresar un valor numérico! SI NO APORTÓ DEBES PONER 0");
    return;
  }
        
  function mostrarModal(mensaje) {
    const modal = new bootstrap.Modal(document.getElementById("modalError"));
    document.getElementById("modalErrorMensaje").innerText = mensaje;
    modal.show();
  }

  const persona = { nombre, cantidad };
  lista.push(persona);
  personas.push(persona);

  // Crear el elemento contenedor con las clases adecuadas
  const div = document.createElement("div");
  div.classList.add("list-item");
      
  // Crear el span para el contenido
  const span = document.createElement("span");
  span.classList.add("content", "text-uppercase");
  span.textContent = `${nombre}  |  $${cantidad}`;

  // Crear el icono de eliminar (o edición)
  const icon = document.createElement("i");
  icon.classList.add("icon", "bi", "bi-trash3-fill");
  icon.addEventListener("click", () => {
    div.remove();
    lista.splice(lista.indexOf(persona), 1);
    personas.splice(personas.indexOf(persona), 1);
    calcularMontoIndividual();
    actualizarVisibilidad();
    crearPagos();
  });
      
  // Agregar los elementos al div contenedor
  div.appendChild(span);
  div.appendChild(icon);
      
  // Agregar el div a la lista
  listaPersonas.appendChild(div);
      
  // Resetear el formulario
  formularioPersona.reset();
      
  // Calcular el monto individual
  calcularMontoIndividual();
  actualizarVisibilidad();
  crearPagos(personas);
}

function calcularMontoIndividual() {
  const total = lista.reduce((sum, persona) => sum + persona.cantidad, 0);
  const montoPorPersona = total / lista.length;
  montoIndividual.textContent = `Por Cabeza: ${montoPorPersona.toFixed(2)}`;
}

formularioPersona.addEventListener("submit", (event) => {
  event.preventDefault();
  agregarPersona();
});

function crearPagos() {
  listaPagos.innerHTML = "";
  if (lista.length === 0) {
    //console.log("⚠️ No hay personas en la lista.");
    seccionResultados.style.display = "block";
    listaPagos.innerHTML = "<p class='text-center text-danger'>Por favor, ingrese participantes.</p>";
    return;
  }
  const personas = lista.map(p => ({ nombre: p.nombre, cantidad: p.cantidad }));
  let prom = personas.reduce((sum, persona) => sum + persona.cantidad, 0) / personas.length;
    
  personas.forEach(persona => {
    persona.cantidad = +(persona.cantidad - prom).toFixed(2);
  });
    
  const personasOrdenadas = [...personas].sort((a, b) => b.cantidad - a.cantidad);
  const personasPositivas = personasOrdenadas.filter(p => p.cantidad > 0);
  const personasNegativas = personasOrdenadas.filter(p => p.cantidad < 0);

  if (personasPositivas.length === 0 || personasNegativas.length === 0) {
    //console.log("⚠️ No hay suficientes datos para realizar transferencias.");
    seccionResultados.style.display = "block";
    listaPagos.innerHTML = "<p class='text-center text-warning'>No hay suficientes datos para realizar transferencias.</p>";
    return;
  }
  
  seccionResultados.style.display = "block";

  const transferencias = [];
  
  personasPositivas.forEach((positiva) => {
    personasNegativas.forEach((negativa) => {
      if (positiva.cantidad > 0 && negativa.cantidad < 0) {
        const transferir = Math.min(positiva.cantidad, Math.abs(negativa.cantidad));
        positiva.cantidad = +(positiva.cantidad - transferir).toFixed(2);
        negativa.cantidad = +(negativa.cantidad + transferir).toFixed(2);
    
        transferencias.push({
          de: negativa.nombre,
          para: positiva.nombre,
          monto: transferir.toFixed(2),
        });
      }
    });
  });
    
  //console.log("🔹 Transferencias realizadas:");
  
  transferencias.forEach(t => {
    //console.log(`${t.de} debe transferir $${t.monto} a ${t.para}`);
    
    const div = document.createElement("div");
    div.classList.add("list-item");
    
    const span = document.createElement("span");
    span.classList.add("content", "text-uppercase");
    span.textContent = `${t.de} debe transferir $${t.monto} a ${t.para}`;
    
    div.appendChild(span);
    listaPagos.appendChild(div);
  });
}
    
document.getElementById("botonCompartir").addEventListener("click", compartirWhatsApp);

function compartirWhatsApp() {
  if (lista.length === 0) {
    alert("❌ No hay datos para compartir. Agrega personas primero.");
    return;
  }
  
  let mensaje = "📢 *Resumen de Gastos - Juntadita* 📢\n\n";
  
  // Agregar lista de personas y cuánto pusieron
  mensaje += "👥 *Participantes y Aportes:*\n";
  lista.forEach(p => {
    mensaje += `🔹 ${p.nombre}: $${p.cantidad.toFixed(2)}\n`;
  });
  
  mensaje += "\n💸 *Transferencias Necesarias:*\n";
  
  if (listaPagos.innerHTML.trim() === "") {
    mensaje += "✅ No hay transferencias necesarias, todos aportaron por igual.\n";
  } else {
    const transferencias = listaPagos.querySelectorAll(".list-item span");
    transferencias.forEach(t => {
      mensaje += `🔹 ${t.textContent}\n`;
    });
  }
  
  // Agregar firma con link y opción de propina
  mensaje += "\n📊 Calculado con *Juntadita* 🎉\n";
  mensaje += "🌐 Visita: https://juntadita-app.vercel.app/\n";
  mensaje += "💖 Si te fue útil, considera dejar una propina 💰\n";
  mensaje += "🔗 Propina: https://link.mercadopago.com.ar/juntadita\n";
  
  // Convertir mensaje a formato URL para WhatsApp
  let url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  
  // Abrir WhatsApp con el mensaje
  window.open(url, "_blank");
}
