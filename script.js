const IVA = 1.21;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let totalCarrito = parseFloat(localStorage.getItem("totalCarrito")) || 0;

// Mostrar el estado actual del localStorage al cargar
console.log("Carrito cargado desde localStorage:", carrito);
console.log("Total cargado desde localStorage:", totalCarrito);

const resultadoConIva = (precio) => precio * IVA;

const productos = {
  1: { nombre: "Pilas alcalinas", precio: 5000 },
  2: { nombre: "Baterías para notebook", precio: 45000 },
  3: { nombre: "Batería de gel", precio: 30000 },
  4: { nombre: "Cargador para pilas recargables", precio: 60000 }
};

const guardarEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("totalCarrito", totalCarrito.toString());
  console.log("Datos guardados en localStorage:");
  console.log("Carrito:", carrito);
  console.log("Total:", totalCarrito);
};

const actualizarVistaCarrito = () => {
  if (carrito.length === 0) {
    document.getElementById("carrito").innerText = "Tu carrito está vacío.";
    return;
  }

  let detalle = "Productos en tu carrito:\n";
  carrito.forEach((producto, i) => {
    detalle += `${i + 1}. ${producto.nombre} - $${(producto.precio * IVA).toFixed(2)}\n`;
  });
  detalle += `\nTotal (con IVA): $${totalCarrito.toFixed(2)}`;
  document.getElementById("carrito").innerText = detalle;
};

document.addEventListener("DOMContentLoaded", () => {
  // Restaurar carrito al cargar
  actualizarVistaCarrito();

  // Agregar productos
  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const producto = productos[id];
      carrito.push(producto);
      totalCarrito += resultadoConIva(producto.precio);
      guardarEnLocalStorage();
      alert(`${producto.nombre} agregado al carrito.`);
    });
  });

  // Ver carrito
  document.getElementById("ver-carrito").addEventListener("click", () => {
    actualizarVistaCarrito();
  });

  // Salir (vaciar carrito):
  document.getElementById("salir").addEventListener("click", () => {
    alert("Gracias por su compra. ¡Vuelva pronto!");
    carrito = [];
    totalCarrito = 0;
    localStorage.removeItem("carrito");
    localStorage.removeItem("totalCarrito");
    console.log("LocalStorage limpiado tras finalizar compra.");
    actualizarVistaCarrito();
  });
});