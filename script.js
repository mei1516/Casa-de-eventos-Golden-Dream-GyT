const productos = [
  {
    id: 1,
    nombre: "Paquete Boda Esencial",
    precio: 850000,
    categoria: "Bodas",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    descripcion: "Espacio decorado, mobiliario básico y ambientación elegante para una celebración memorable."
  },
  {
    id: 2,
    nombre: "Paquete Boda Premium",
    precio: 1800000,
    categoria: "Bodas",
    img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80",
    descripcion: "Incluye decoración premium, zona de fotos, montaje especial y acompañamiento logístico."
  },
  {
    id: 3,
    nombre: "Cumpleaños Infantil Mágico",
    precio: 420000,
    categoria: "Cumpleaños",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
    descripcion: "Decoración temática, mesa principal y montaje ideal para celebraciones infantiles."
  },
  {
    id: 4,
    nombre: "Cumpleaños Adulto Elegante",
    precio: 560000,
    categoria: "Cumpleaños",
    img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80",
    descripcion: "Ambiente moderno y distinguido para reuniones privadas y celebraciones especiales."
  },
  {
    id: 5,
    nombre: "Evento Empresarial Básico",
    precio: 950000,
    categoria: "Empresariales",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
    descripcion: "Salón acondicionado para reuniones corporativas, capacitaciones y presentaciones."
  },
  {
    id: 6,
    nombre: "Evento Empresarial Full",
    precio: 1650000,
    categoria: "Empresariales",
    img: "https://images.unsplash.com/photo-1511795409834-432f7b1d82b4?auto=format&fit=crop&w=900&q=80",
    descripcion: "Montaje ejecutivo con presentación profesional para eventos de alto impacto."
  },
  {
    id: 7,
    nombre: "Decoración Temática Deluxe",
    precio: 380000,
    categoria: "Decoración",
    img: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=900&q=80",
    descripcion: "Diseño visual personalizado con globos, paleta de color y detalles decorativos destacados."
  },
  {
    id: 8,
    nombre: "Mesa Principal y Backing",
    precio: 290000,
    categoria: "Decoración",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
    descripcion: "Incluye mesa decorada, fondo para fotos y una presentación visual impactante."
  }
];

let carrito = new Map();
let ultimaCategoriaInteres = localStorage.getItem("ultimaCategoriaInteres") || "todos";

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const contenedorPayPal = document.getElementById("paypal-button-container");
const selectorCategoria = document.getElementById("categoria");
const topElo = document.getElementById("top-elo");
const dueloContainer = document.getElementById("duelo-container");
const recomendadosContainer = document.getElementById("recomendados");
const tituloRecomendados = document.getElementById("titulo-recomendados");

let ratings = cargarRatings();

/* =========================
   FORMATO MONEDA COLOMBIA
========================= */
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

/* =========================
   UTILIDADES
========================= */
function obtenerProductoPorId(id) {
  return productos.find(p => p.id === id);
}

function totalDelCarrito() {
  return Array.from(carrito.values()).reduce((acc, item) => {
    return acc + (Number(item.precio) * Number(item.cantidad));
  }, 0);
}

function guardarCategoriaInteres(categoria) {
  ultimaCategoriaInteres = categoria;
  localStorage.setItem("ultimaCategoriaInteres", categoria);
}

function obtenerCategoriaPreferida() {
  if (selectorCategoria && selectorCategoria.value !== "todos") {
    return selectorCategoria.value;
  }

  if (ultimaCategoriaInteres !== "todos") {
    return ultimaCategoriaInteres;
  }

  return null;
}

function irAPago() {
  const panelPago = document.getElementById("panel-pago");
  if (panelPago) {
    panelPago.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function irAMediosPago() {
  const mediosPago = document.getElementById("medios-pago");
  if (mediosPago) {
    mediosPago.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* =========================
   CARRUSEL HERO
========================= */
let slideActual = 0;
let autoSlide;

function obtenerSlides() {
  return document.querySelectorAll(".slide");
}

function obtenerDots() {
  return document.querySelectorAll(".dot");
}

function mostrarSlide(index) {
  const slides = obtenerSlides();
  const dots = obtenerDots();

  if (!slides.length) return;

  if (index < 0) {
    slideActual = slides.length - 1;
  } else if (index >= slides.length) {
    slideActual = 0;
  } else {
    slideActual = index;
  }

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === slideActual);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === slideActual);
  });
}

function moverCarrusel(direccion) {
  mostrarSlide(slideActual + direccion);
  reiniciarAutoSlide();
}

function irASlide(index) {
  mostrarSlide(index);
  reiniciarAutoSlide();
}

function iniciarAutoSlide() {
  autoSlide = setInterval(() => {
    mostrarSlide(slideActual + 1);
  }, 5000);
}

function reiniciarAutoSlide() {
  clearInterval(autoSlide);
  iniciarAutoSlide();
}

/* =========================
   RENDER PRODUCTOS
========================= */
function renderProductos(lista = productos) {
  contenedorProductos.innerHTML = "";

  lista.forEach(prod => {
    const div = document.createElement("article");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <span class="categoria-chip">${prod.categoria}</span>
      <h3>${prod.nombre}</h3>
      <p class="descripcion-producto">${prod.descripcion}</p>
      <p>${formatearPrecio(prod.precio)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function filtrarPorCategoria() {
  const seleccion = selectorCategoria.value;

  if (seleccion !== "todos") {
    guardarCategoriaInteres(seleccion);
  }

  const productosFiltrados =
    seleccion === "todos"
      ? productos
      : productos.filter(p => p.categoria === seleccion);

  renderProductos(productosFiltrados);
  renderRecomendados();
}

/* =========================
   RECOMENDADOS
========================= */
function renderRecomendados() {
  if (!recomendadosContainer || !tituloRecomendados) return;

  const categoriaPreferida = obtenerCategoriaPreferida();
  let candidatos = categoriaPreferida
    ? productos.filter(p => p.categoria === categoriaPreferida)
    : [...productos];

  candidatos.sort((a, b) => ratings[b.id] - ratings[a.id]);

  if (candidatos.length < 4) {
    const complementarios = productos
      .filter(p => !candidatos.some(c => c.id === p.id))
      .sort((a, b) => ratings[b.id] - ratings[a.id]);

    candidatos = [...candidatos, ...complementarios];
  }

  const seleccionados = candidatos.slice(0, 4);

  tituloRecomendados.textContent = categoriaPreferida
    ? `Recomendados en ${categoriaPreferida}`
    : "Recomendados para ti";

  recomendadosContainer.innerHTML = "";

  seleccionados.forEach(producto => {
    const card = document.createElement("article");
    card.className = "recomendado-card";
    card.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <div class="recomendado-info">
        <h3>${producto.nombre}</h3>
        <p>${producto.categoria}</p>
        <p class="precio-recomendado">${formatearPrecio(producto.precio)}</p>
        <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
      </div>
    `;
    recomendadosContainer.appendChild(card);
  });
}

/* =========================
   CARRITO
========================= */
function agregarAlCarrito(id) {
  const producto = obtenerProductoPorId(id);
  if (!producto) return;

  guardarCategoriaInteres(producto.categoria);

  if (carrito.has(id)) {
    carrito.get(id).cantidad += 1;
  } else {
    carrito.set(id, { ...producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
  renderRecomendados();
}

function cambiarCantidad(id, cambio) {
  if (!carrito.has(id)) return;

  const item = carrito.get(id);
  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito.delete(id);
  } else {
    carrito.set(id, item);
  }

  guardarCarrito();
  actualizarCarrito();
}

function eliminarDelCarrito(id) {
  if (!carrito.has(id)) return;

  carrito.delete(id);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.size === 0) {
    listaCarrito.innerHTML = `<li class="carrito-vacio">Tu carrito está vacío.</li>`;
    totalCarrito.textContent = formatearPrecio(0);
    cantidadCarrito.textContent = "0";
    contenedorPayPal.style.display = "none";
    return;
  }

  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach(item => {
    const subtotal = Number(item.precio) * Number(item.cantidad);
    total += subtotal;
    cantidadTotal += Number(item.cantidad);

    const li = document.createElement("li");
    li.className = "item-carrito";
    li.innerHTML = `
      <strong>${item.nombre}</strong>
      <div class="item-detalle">
        ${formatearPrecio(item.precio)} x ${item.cantidad} = ${formatearPrecio(subtotal)}
      </div>
      <div class="controles-cantidad">
        <button onclick="cambiarCantidad(${item.id}, -1)">−</button>
        <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
        <button class="eliminar" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      </div>
    `;
    listaCarrito.appendChild(li);
  });

  totalCarrito.textContent = formatearPrecio(total);
  cantidadCarrito.textContent = cantidadTotal;
  contenedorPayPal.style.display = "block";
}

function vaciarCarrito(confirmar = true) {
  if (carrito.size === 0) return;

  if (!confirmar || confirm("¿Seguro que quieres vaciar el carrito?")) {
    carrito.clear();
    guardarCarrito();
    actualizarCarrito();
  }
}

function finalizarCompra() {
  if (carrito.size === 0) {
    alert("Tu carrito está vacío. Agrega servicios antes de pagar.");
    return;
  }

  contenedorPayPal.style.display = "block";
  contenedorPayPal.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(Array.from(carrito.entries())));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito");

  if (data) {
    carrito = new Map(JSON.parse(data));
  }

  actualizarCarrito();
}

/* =========================
   ELO
========================= */
function cargarRatings() {
  const guardados = localStorage.getItem("ratings");

  if (guardados) {
    return JSON.parse(guardados);
  }

  const iniciales = {};
  productos.forEach(p => {
    iniciales[p.id] = 1000;
  });

  localStorage.setItem("ratings", JSON.stringify(iniciales));
  return iniciales;
}

function guardarRatings() {
  localStorage.setItem("ratings", JSON.stringify(ratings));
}

function actualizarElo(ganadorId, perdedorId) {
  const K = 32;
  const ratingGanador = ratings[ganadorId];
  const ratingPerdedor = ratings[perdedorId];

  const esperadoGanador = 1 / (1 + Math.pow(10, (ratingPerdedor - ratingGanador) / 400));
  const esperadoPerdedor = 1 / (1 + Math.pow(10, (ratingGanador - ratingPerdedor) / 400));

  ratings[ganadorId] = Math.round(ratingGanador + K * (1 - esperadoGanador));
  ratings[perdedorId] = Math.round(ratingPerdedor + K * (0 - esperadoPerdedor));

  guardarRatings();
}

function renderTopElo() {
  if (!topElo) return;

  const ordenados = [...productos].sort((a, b) => ratings[b.id] - ratings[a.id]);
  topElo.innerHTML = "";

  ordenados.forEach((producto, index) => {
    const card = document.createElement("div");
    card.className = "top-card";
    card.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <div class="top-card-info">
        <span class="badge-ranking">#${index + 1}</span>
        <h3>${producto.nombre}</h3>
        <p>${producto.categoria}</p>
        <p class="elo-score">ELO: ${ratings[producto.id]}</p>
      </div>
    `;
    topElo.appendChild(card);
  });
}

function generarDuelo() {
  if (!dueloContainer || productos.length < 2) return;

  let index1 = Math.floor(Math.random() * productos.length);
  let index2;

  do {
    index2 = Math.floor(Math.random() * productos.length);
  } while (index1 === index2);

  const p1 = productos[index1];
  const p2 = productos[index2];

  dueloContainer.innerHTML = `
    <div class="duelo-card">
      <img src="${p1.img}" alt="${p1.nombre}">
      <h3>${p1.nombre}</h3>
      <p>${formatearPrecio(p1.precio)} · ELO ${ratings[p1.id]}</p>
      <button onclick="votarDuelo(${p1.id}, ${p2.id})">Elegir este</button>
    </div>

    <div class="duelo-card">
      <img src="${p2.img}" alt="${p2.nombre}">
      <h3>${p2.nombre}</h3>
      <p>${formatearPrecio(p2.precio)} · ELO ${ratings[p2.id]}</p>
      <button onclick="votarDuelo(${p2.id}, ${p1.id})">Elegir este</button>
    </div>
  `;
}

function votarDuelo(ganadorId, perdedorId) {
  actualizarElo(ganadorId, perdedorId);
  renderTopElo();
  renderRecomendados();
  generarDuelo();
}

function reiniciarElo() {
  const nuevos = {};
  productos.forEach(p => {
    nuevos[p.id] = 1000;
  });

  ratings = nuevos;
  guardarRatings();
  renderTopElo();
  renderRecomendados();
  generarDuelo();
}

/* =========================
   PAYPAL
========================= */
if (window.paypal) {
  paypal.Buttons({
    createOrder: function (data, actions) {
      const total = totalDelCarrito();

      if (total <= 0) {
        alert("Agrega servicios antes de pagar.");
        return;
      }

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: "COP",
              value: total.toFixed(0)
            },
            description: "Reserva de servicios - Casa de Eventos Golden Dream"
          }
        ]
      });
    },

    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        const nombre = details?.payer?.name?.given_name || "cliente";
        alert(`¡Gracias ${nombre}! Tu pago fue aprobado y tu reserva quedó registrada.`);
        vaciarCarrito(false);
      });
    },

    onError: function (err) {
      console.error("Error con PayPal:", err);
      alert("Hubo un problema con el pago. Intenta de nuevo.");
    }
  }).render("#paypal-button-container");
}

/* =========================
   INICIO
========================= */
if (selectorCategoria) {
  selectorCategoria.addEventListener("change", filtrarPorCategoria);
}

renderProductos();
cargarCarrito();
renderRecomendados();
renderTopElo();
generarDuelo();
mostrarSlide(0);
iniciarAutoSlide();
