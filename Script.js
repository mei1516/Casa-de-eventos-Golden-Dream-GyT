const productos = [
  {id:1,nombre:"Boda",precio:200000,categoria:"Bodas"},
  {id:2,nombre:"Cumpleaños",precio:150000,categoria:"Cumpleaños"}
];

let carrito = new Map();

const contenedor = document.getElementById("productos");
const lista = document.getElementById("lista-carrito");
const total = document.getElementById("total");
const select = document.getElementById("categoria");
const whatsapp = document.getElementById("whatsapp");

function formato(v){
  return new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP"}).format(v);
}

function render(listaProd=productos){
  contenedor.innerHTML="";
  listaProd.forEach(p=>{
    contenedor.innerHTML+=`
      <div class="producto">
        <h3>${p.nombre}</h3>
        <p>${formato(p.precio)}</p>
        <button onclick="agregar(${p.id})">Agregar</button>
      </div>
    `;
  });
}

function agregar(id){
  const p=productos.find(x=>x.id===id);
  carrito.set(id,{...p,cantidad:(carrito.get(id)?.cantidad||0)+1});
  actualizar();
}

function actualizar(){
  lista.innerHTML="";
  let suma=0;

  carrito.forEach(i=>{
    const sub=i.precio*i.cantidad;
    suma+=sub;
    lista.innerHTML+=`<li>${i.nombre} x${i.cantidad}</li>`;
  });

  total.textContent=formato(suma);

  let msg="Hola quiero:%0A";
  carrito.forEach(i=>{
    msg+=`- ${i.nombre} x${i.cantidad}%0A`;
  });

  whatsapp.href=`https://wa.me/573001234567?text=${msg}`;
}

select.addEventListener("change",()=>{
  if(select.value==="todos") render();
  else render(productos.filter(p=>p.categoria===select.value));
});

render();
