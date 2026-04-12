const productos = [
  {
    id: 1,
    nombre: "Paquete Boda Clásica",
    precio: 250000,
    categoria: "Bodas",
    img: "img/boda-clasica.jpg"
  },
  {
    id: 2,
    nombre: "Paquete Cumpleaños Premium",
    precio: 180000,
    categoria: "Cumpleaños",
    img: "img/cumple-premium.jpg"
  },
  {
    id: 3,
    nombre: "Evento Corporativo Gold",
    precio: 320000,
    categoria: "Corporativos",
    img: "img/corporativo-gold.jpg"
  }
];
const contenedorProductos = document.getElementById("productos");
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

function renderProductos(lista = productos) {
  contenedorProductos.innerHTML = "";

  lista.forEach(prod => {
    const card = document.createElement("article");
    card.className = "producto";

    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>${formatearPrecio(prod.precio)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;

    contenedorProductos.appendChild(card);
  });
}

renderProductos();
