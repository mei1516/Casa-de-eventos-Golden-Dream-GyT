const productos = [
  {
    id: 1,
    nombre: "Evento empresarial",
    precio: 900000,
    categoria: "Empresariales",
    incluye: "Ambientación, sonido básico, logística"
  },
  {
    id: 2,
    nombre: "Boda",
    precio: 1200000,
    categoria: "Bodas",
    incluye: "Decoración, mobiliario, montaje"
  },
  {
    id: 3,
    nombre: "Cumpleaños",
    precio: 400000,
    categoria: "Cumpleaños",
    incluye: "Decoración temática, mesa principal"
  }
];

let carrito = [];

const contenedor = document.getElementById("productos");
const lista = document.getElementById("lista-carrito");
const total = document.getElementById("total");

function render() {
  contenedor.innerHTML = "";

  productos.forEach(p => {
    contenedor.innerHTML += `
      <div class="producto">
        <h3>${p.nombre}</h3>
        <p>${p.incluye}</p>
        <p><strong>Desde $${p.precio.toLocaleString()}</strong></p>
        <button onclick="agregar(${p.id})">Agregar</button>
      </div>
    `;
  });
}

function agregar(id) {
  const prod = productos.find(p => p.id === id);
  carrito.push(prod);
  actualizar();
}

function actualizar() {
  lista.innerHTML = "";

  let suma = 0;

  carrito.forEach(p => {
    suma += p.precio;

    lista.innerHTML += `
      <li>${p.nombre} - $${p.precio.toLocaleString()}</li>
    `;
  });

  total.textContent = "$" + suma.toLocaleString();
}

function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("Agrega servicios");
    return;
  }

  let mensaje = "Hola quiero cotizar:\n";

  carrito.forEach(p => {
    mensaje += "- " + p.nombre + "\n";
  });

  window.open(
    "https://wa.me/573172930703?text=" +
      encodeURIComponent(mensaje)
  );
}

function irACotizacion() {
  document.getElementById("panel-cotizacion").scrollIntoView({
    behavior: "smooth"
  });
}

render();
