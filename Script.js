/* =========================
   PRODUCTOS
========================= */
const productos = [
  {
    id: 1,
    nombre: "Paquete Boda Clásica",
    precio: 250000,
    categoria: "Bodas",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed"
  },
  {
    id: 2,
    nombre: "Cumpleaños Premium",
    precio: 180000,
    categoria: "Cumpleaños",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d"
  },
  {
    id: 3,
    nombre: "Evento Corporativo Gold",
    precio: 320000,
    categoria: "Corporativos",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df"
  },
  {
    id: 4,
    nombre: "Decoración Elegante",
    precio: 90000,
    categoria: "Bodas",
    img: "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57"
  },
  {
    id: 5,
    nombre: "DJ + Sonido",
    precio: 120000,
    categoria: "Cumpleaños",
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063"
  },
  {
    id: 6,
    nombre: "Banquete Premium",
    precio: 200000,
    categoria: "Corporativos",
    img: "https://images.unsplash.com/photo-1555244162-803834f70033"
  }
];

/* =========================
   VARIABLES
========================= */
let carrito = new Map();
let ratings = cargarRatings();

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const selectorCategoria = document.getElementById("categoria");
const recomendadosContainer = document.getElementById("recomendados");
const topElo = document.getElementById("top-elo");
const dueloContainer = document.getElementById("duelo-container");

/* =========================
   FORMATO COP
========================= */
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(valor);
}

/* =========================
   RENDER PRODUCTOS
========================= */
function renderProductos(lista = productos) {
  contenedorProductos.innerHTML = "";

  lista.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";

    div.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>${formatearPrecio(prod.precio)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;

    contenedorProductos.appendChild(div);
  });
}

/* =========================
   FILTRO
========================= */
selectorCategoria.addEventListener("change", () => {
  const categoria = selectorCategoria.value;

  if (categoria === "todos") {
    renderProductos();
  } else {
    const filtrados = productos.filter(p => p.categoria === categoria);
    renderProductos(filtrados);
  }
});

/* =========================
   CARRITO
========================= */
function obtenerProducto(id) {
  return productos.find(p => p.id === id);
}

function agregarAlCarrito(id) {
  const prod = obtenerProducto(id);

  if (carrito.has(id)) {
    carrito.get(id).cantidad++;
  } else {
    carrito.set(id, { ...prod, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
  renderRecomendados();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.nombre}</strong><br>
      ${formatearPrecio(item.precio)} x ${item.cantidad} = ${formatearPrecio(subtotal)}
      <br>
      <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
      <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
      <button onclick="eliminar(${item.id})">Eliminar</button>
    `;

    listaCarrito.appendChild(li);
  });

  totalCarrito.textContent = formatearPrecio(total);
}

function cambiarCantidad(id, cambio) {
  if (!carrito.has(id)) return;

  const item = carrito.get(id);
  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito.delete(id);
  }

  guardarCarrito();
  actualizarCarrito();
}

function eliminar(id) {
  carrito.delete(id);
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(Array.from(carrito)));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito");

  if (data) {
    carrito = new Map(JSON.parse(data));
  }

  actualizarCarrito();
}

/* =========================
   RECOMENDADOS
========================= */
function renderRecomendados() {
  if (!recomendadosContainer) return;

  const top = [...productos]
    .sort((a, b) => ratings[b.id] - ratings[a.id])
    .slice(0, 4);

  recomendadosContainer.innerHTML = "";

  top.forEach(p => {
    const card = document.createElement("div");

    card.innerHTML = `
      <img src="${p.img}">
      <h4>${p.nombre}</h4>
      <p>${formatearPrecio(p.precio)}</p>
    `;

    recomendadosContainer.appendChild(card);
  });
}

/* =========================
   ELO
========================= */
function cargarRatings() {
  const data = localStorage.getItem("ratings");

  if (data) return JSON.parse(data);

  const inicial = {};
  productos.forEach(p => inicial[p.id] = 1000);
  return inicial;
}

function guardarRatings() {
  localStorage.setItem("ratings", JSON.stringify(ratings));
}

function actualizarElo(ganador, perdedor) {
  const K = 32;

  const r1 = ratings[ganador];
  const r2 = ratings[perdedor];

  const e1 = 1 / (1 + Math.pow(10, (r2 - r1) / 400));
  const e2 = 1 / (1 + Math.pow(10, (r1 - r2) / 400));

  ratings[ganador] = Math.round(r1 + K * (1 - e1));
  ratings[perdedor] = Math.round(r2 + K * (0 - e2));

  guardarRatings();
}

/* =========================
   TOP
========================= */
function renderTop() {
  if (!topElo) return;

  const ordenados = [...productos].sort((a, b) => ratings[b.id] - ratings[a.id]);

  topElo.innerHTML = "";

  ordenados.forEach((p, i) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <img src="${p.img}">
      <p>#${i + 1} - ${p.nombre}</p>
      <small>ELO: ${ratings[p.id]}</small>
    `;

    topElo.appendChild(div);
  });
}

/* =========================
   DUELO
========================= */
function generarDuelo() {
  if (!dueloContainer) return;

  let i1 = Math.floor(Math.random() * productos.length);
  let i2;

  do {
    i2 = Math.floor(Math.random() * productos.length);
  } while (i1 === i2);

  const p1 = productos[i1];
  const p2 = productos[i2];

  dueloContainer.innerHTML = `
    <div>
      <img src="${p1.img}">
      <h3>${p1.nombre}</h3>
      <button onclick="votar(${p1.id}, ${p2.id})">Elegir</button>
    </div>

    <div>
      <img src="${p2.img}">
      <h3>${p2.nombre}</h3>
      <button onclick="votar(${p2.id}, ${p1.id})">Elegir</button>
    </div>
  `;
}

function votar(g, p) {
  actualizarElo(g, p);
  renderTop();
  renderRecomendados();
  generarDuelo();
}

/* =========================
   INICIO
========================= */
renderProductos();
cargarCarrito();
renderRecomendados();
renderTop();
generarDuelo();
