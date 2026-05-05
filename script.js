const productos = [
  {
    id: 1,
    nombre: "Espacio para bodas",
    precio: 850000,
    categoria: "Bodas",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    descripcion: "Ambiente elegante y organizado para celebraciones matrimoniales con atención cuidada.",
    incluye: ["Espacio para el evento", "Apoyo inicial de reserva", "Montaje básico", "Acompañamiento en la cotización"]
  },
  {
    id: 2,
    nombre: "Decoración para boda",
    precio: 620000,
    categoria: "Bodas",
    img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80",
    descripcion: "Propuesta visual sobria y armónica para acompañar uno de los días más importantes.",
    incluye: ["Decoración base", "Ambientación elegante", "Mesa principal", "Montaje decorativo"]
  },
  {
    id: 3,
    nombre: "Celebración de cumpleaños",
    precio: 420000,
    categoria: "Cumpleaños",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
    descripcion: "Espacio preparado para reuniones familiares y celebraciones especiales con buena ambientación.",
    incluye: ["Espacio para celebración", "Decoración base", "Zona principal", "Acompañamiento de reserva"]
  },
  {
    id: 4,
    nombre: "Decoración de cumpleaños",
    precio: 360000,
    categoria: "Cumpleaños",
    img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80",
    descripcion: "Montaje decorativo adaptable al estilo de tu celebración y al tipo de encuentro.",
    incluye: ["Decoración temática", "Mesa principal", "Elementos visuales", "Montaje básico"]
  },
  {
    id: 5,
    nombre: "Evento empresarial",
    precio: 950000,
    categoria: "Empresariales",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
    descripcion: "Espacio apto para reuniones corporativas, presentaciones y encuentros profesionales.",
    incluye: ["Espacio corporativo", "Ambientación básica", "Apoyo logístico", "Montaje para reunión"]
  },
  {
    id: 6,
    nombre: "Ambientación corporativa",
    precio: 540000,
    categoria: "Empresariales",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    descripcion: "Presentación organizada y formal para fortalecer la imagen de tus eventos empresariales.",
    incluye: ["Ambientación empresarial", "Decoración sobria", "Montaje corporativo", "Apoyo visual"]
  },
  {
    id: 7,
    nombre: "Decoración temática",
    precio: 380000,
    categoria: "Decoración",
    img: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=900&q=80",
    descripcion: "Diseño decorativo personalizado para transformar el espacio según tu ocasión.",
    incluye: ["Temática personalizada", "Decoración visual", "Montaje del espacio", "Ajuste según evento"]
  },
  {
    id: 8,
    nombre: "Mesa principal y ambientación",
    precio: 290000,
    categoria: "Decoración",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
    descripcion: "Composición visual elegante para destacar el centro del evento de forma estética.",
    incluye: ["Mesa principal", "Ambientación decorativa", "Montaje visual", "Detalles decorativos"]
  }
];

let carrito = new Map();
let ultimaCategoriaInteres = localStorage.getItem("ultimaCategoriaInteres") || "todos";

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const selectorCategoria = document.getElementById("categoria");
const topElo = document.getElementById("top-elo");
const dueloContainer = document.getElementById("duelo-container");
const recomendadosContainer = document.getElementById("recomendados");
const tituloRecomendados = document.getElementById("titulo-recomendados");

let ratings = cargarRatings();

function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

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

function renderProductos(lista = productos) {
  contenedorProductos.innerHTML = "";

  lista.forEach(prod => {
    const div = document.createElement("article");
    div.className = "producto";

    const incluyeHTML = prod.incluye.map(item => `<li>${item}</li>`).join("");

    div.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}" onerror="this.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80'">
      <span class="categoria-chip">${prod.categoria}</span>
      <h3>${prod.nombre}</h3>
      <p class="descripcion-producto">${prod.descripcion}</p>

      <div class="incluye-box">
        <strong>Puede incluir:</strong>
        <ul>${incluyeHTML}</ul>
      </div>

      <p class="texto-reserva">Desde ${formatearPrecio(prod.precio)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar a cotización</button>
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
    ? `Servicios recomendados en ${categoriaPreferida}`
    : "Servicios recomendados";

  recomendadosContainer.innerHTML = "";

  seleccionados.forEach(producto => {
    const card = document.createElement("article");
    card.className = "recomendado-card";
    card.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}" onerror="this.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80'">
      <div class="recomendado-info">
        <h3>${producto.nombre}</h3>
        <p>${producto.categoria}</p>
        <p class="precio-recomendado">Desde ${formatearPrecio(producto.precio)}</p>
        <button onclick="agregarAlCarrito(${producto.id})">Agregar a cotización</button>
      </div>
    `;
    recomendadosContainer.appendChild(card);
  });
}

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
    listaCarrito.innerHTML = `<li class="carrito-vacio">No has seleccionado servicios todavía.</li>`;
    totalCarrito.textContent = formatearPrecio(0);
    cantidadCarrito.textContent = "0";
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
        Selección x ${item.cantidad} = Desde ${formatearPrecio(subtotal)}
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
}

function vaciarCarrito(confirmar = true) {
  if (carrito.size === 0) return;

  if (!confirmar || confirm("¿Seguro que quieres vaciar la selección?")) {
    carrito.clear();
    guardarCarrito();
    actualizarCarrito();
  }
}

function finalizarCompra() {
  if (carrito.size === 0) {
    alert("Tu selección está vacía. Agrega servicios antes de solicitar la cotización.");
    return;
  }

  let mensaje = "Hola, quiero solicitar una cotización para un evento.\n\n";
  mensaje += "Servicios seleccionados:\n";

  carrito.forEach(item => {
    mensaje += `- ${item.nombre} x ${item.cantidad} - Valor estimado desde ${formatearPrecio(item.precio * item.cantidad)}\n`;
  });

  mensaje += `\nTotal estimado desde: ${formatearPrecio(totalDelCarrito())}\n\n`;
  mensaje += "Fecha del evento:\n";
  mensaje += "Número de invitados:\n";
  mensaje += "Lugar del evento:\n";
  mensaje += "Tipo de evento:\n";
  mensaje += "Observaciones:\n\n";
  mensaje += "Entiendo que el valor puede variar según las necesidades del evento.";

  const url = `https://wa.me/573172930703?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
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
      <img src="${producto.img}" alt="${producto.nombre}" onerror="this.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80'">
      <div class="top-card-info">
        <span class="badge-ranking">#${index + 1}</span>
        <h3>${producto.nombre}</h3>
        <p>${producto.categoria}</p>
        <p class="elo-score">Puntaje: ${ratings[producto.id]}</p>
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
      <img src="${p1.img}" alt="${p1.nombre}" onerror="this.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80'">
      <h3>${p1.nombre}</h3>
      <p>Reserva disponible · Puntaje ${ratings[p1.id]}</p>
      <button onclick="votarDuelo(${p1.id}, ${p2.id})">Elegir este</button>
    </div>

    <div class="duelo-card">
      <img src="${p2.img}" alt="${p2.nombre}" onerror="this.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80'">
      <h3>${p2.nombre}</h3>
      <p>Reserva disponible · Puntaje ${ratings[p2.id]}</p>
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

if (selectorCategoria) {
  selectorCategoria.addEventListener("change", filtrarPorCategoria);
}

renderProductos();
cargarCarrito();
renderRecomendados();
renderTopElo();
generarDuelo();
