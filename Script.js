const productos = [
  {
    id: 1,
    nombre: "Boda Clásica",
    precio: 250000,
    categoria: "Bodas",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    nombre: "Boda Premium",
    precio: 420000,
    categoria: "Bodas",
    img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    nombre: "Cumpleaños Premium",
    precio: 180000,
    categoria: "Cumpleaños",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    nombre: "Cumpleaños Infantil",
    precio: 140000,
    categoria: "Cumpleaños",
    img: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    nombre: "Evento Corporativo",
    precio: 300000,
    categoria: "Corporativos",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    nombre: "Reunión Ejecutiva",
    precio: 210000,
    categoria: "Corporativos",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80"
  }
];

let carrito = new Map();

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const selectorCategoria = document.getElementById("categoria");
const btnWhatsapp = document.getElementById("btn-whatsapp");
const paypalContainer = document.getElementById("paypal-button-container");

function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

function obtenerProductoPorId(id) {
  return productos.find((p) => p.id === id);
}

function totalDelCarrito() {
  return Array.from(carrito.values()).reduce((acc, item) => {
    return acc + item.precio * item.cantidad;
  }, 0);
}

function renderProductos(lista = productos) {
  contenedorProductos.innerHTML = "";

  lista.forEach((prod) => {
    const card = document.createElement("article");
    card.className = "producto";

    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <div class="producto-info">
        <small>${prod.categoria}</small>
        <h3>${prod.nombre}</h3>
        <p>${formatearPrecio(prod.precio)}</p>
        <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
      </div>
    `;

    contenedorProductos.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const producto = obtenerProductoPorId(id);
  if (!producto) return;

  if (carrito.has(id)) {
    carrito.get(id).cantidad += 1;
  } else {
    carrito.set(id, { ...producto, cantidad: 1 });
  }

  actualizarCarrito();
}

function cambiarCantidad(id, cambio) {
  if (!carrito.has(id)) return;

  const item = carrito.get(id);
  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito.delete(id);
  }

  actualizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito.delete(id);
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito.clear();
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.size === 0) {
    listaCarrito.innerHTML = `<li>Tu carrito está vacío.</li>`;
    totalCarrito.textContent = formatearPrecio(0);
    actualizarWhatsapp();
    renderPaypal();
    return;
  }

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nombre}</strong><br>
      ${formatearPrecio(item.precio)} x ${item.cantidad} = ${formatearPrecio(subtotal)}
      <div class="item-botones">
        <button onclick="cambiarCantidad(${item.id}, -1)">−</button>
        <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
        <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      </div>
    `;

    listaCarrito.appendChild(li);
  });

  totalCarrito.textContent = formatearPrecio(totalDelCarrito());
  actualizarWhatsapp();
  renderPaypal();
}

function actualizarWhatsapp() {
  let mensaje = "Hola, quiero cotizar este pedido:%0A";
  const total = totalDelCarrito();

  if (carrito.size === 0) {
    mensaje = "Hola, quiero información sobre sus servicios.";
  } else {
    carrito.forEach((item) => {
      mensaje += `- ${item.nombre} x${item.cantidad} = ${formatearPrecio(item.precio * item.cantidad)}%0A`;
    });
    mensaje += `%0ATotal: ${formatearPrecio(total)}`;
  }

  btnWhatsapp.href = `https://wa.me/573001234567?text=${mensaje}`;
}

function filtrarPorCategoria() {
  const categoria = selectorCategoria.value;

  if (categoria === "todos") {
    renderProductos(productos);
    return;
  }

  const filtrados = productos.filter((p) => p.categoria === categoria);
  renderProductos(filtrados);
}

function renderPaypal() {
  paypalContainer.innerHTML = "";

  const total = totalDelCarrito();
  if (total <= 0 || !window.paypal) return;

  paypal.Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: total.toFixed(0)
            }
          }
        ]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function () {
        alert("Pago aprobado con éxito");
        vaciarCarrito();
      });
    },
    onError: function () {
      alert("Hubo un error con PayPal");
    }
  }).render("#paypal-button-container");
}

selectorCategoria.addEventListener("change", filtrarPorCategoria);

renderProductos();
actualizarCarrito();
