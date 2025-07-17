const IVA = 1.21;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let totalCarrito = parseFloat(localStorage.getItem("totalCarrito")) || 0;

const resultadoConIva = (precio) => precio * IVA;

const productos = {
  1: { nombre: "Pilas alcalinas", precio: 5000, img: "img/pilas_alcalinas.jpg"},
  2: { nombre: "Baterías para notebook", precio: 45000, img: "img/bateria_notebook.jpg"},
  3: { nombre: "Batería de gel", precio: 30000, img: "img/bateria_gel.jpg"},
  4: { nombre: "Pilas recargables AAA", precio: 10500, img: "img/pilas_aaa.jpg"},
  5: { nombre: "Pilas para audiología", precio: 6400, img: "img/pilas_audio.jpg"},
  6: { nombre: "Cargador para pilas recargables", precio: 60000, img: "img/cargador_pilas.jpg"},
  7: { nombre: "Batería para Samsung s25+", precio: 150000, img: "img/bateria_samsung.jpg"},
  8: { nombre: "Fire TV stick Amazon", precio: 55000, img: "img/firetv.jpg"},
  9: { nombre: "Linterna LED recargable", precio: 120000, img: "img/linterna_led.jpg"},
  10:{ nombre: "Luces de emergencia", precio: 60000, img: "img/luz_emergencia.jpg"}
};

const guardarEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("totalCarrito", totalCarrito.toString());
};

const actualizarVistaCarrito = () => {
  const modal = document.getElementById("carrito-modal");
  const detalle = document.getElementById("carrito-detalle");
  const vaciarBtn = document.getElementById("vaciar-carrito");

  if (carrito.length === 0) {
    detalle.innerHTML = "<p>Tu carrito está vacío.</p>";
    if (vaciarBtn) vaciarBtn.style.display = "none";
  } else {
    let html = "";
    carrito.forEach((producto, i) => {
      html += `
        <div class="producto-carrito">
          <img src="${producto.img}" alt="${producto.nombre}" class="producto-img-carrito" />
          <div>
            <p><strong>${producto.nombre}</strong></p>
            <p>$${(producto.precio * IVA).toFixed(2)}</p>
          </div>
        </div>
      `;
    });
    html += `<hr><p><strong>Total (con IVA): $${totalCarrito.toFixed(2)}</strong></p>`;
    detalle.innerHTML = html;

    if (vaciarBtn) vaciarBtn.style.display = "inline-block";
  }
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
};

const actualizarContadorCarrito = () => {
  document.getElementById("contador-carrito").innerText = carrito.length;
};

const animarIconoCarrito = () => {
  const icono = document.getElementById("carrito-icono");
  icono.classList.add("animado");
  setTimeout(() => icono.classList.remove("animado"), 500);
};

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();

  // Mostrar productos
  const contenedor = document.getElementById("productos-contenedor");
  Object.entries(productos).forEach(([id, producto]) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}" class="producto-img" />
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button data-id="${id}">Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });

  // Delegación de eventos para agregar productos al carrito
  contenedor.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
      const id = e.target.dataset.id;
      const producto = productos[id];
      carrito.push(producto);
      totalCarrito += resultadoConIva(producto.precio);
      guardarEnLocalStorage();
      actualizarContadorCarrito();
      animarIconoCarrito();

      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: `${producto.nombre} agregado al carrito.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      });
    }
  });

  // Mostrar modal carrito al hacer click en el ícono
  document.getElementById("carrito-icono").addEventListener("click", actualizarVistaCarrito);

  // Cerrar modal con la X
  document.querySelector(".cerrar-modal").addEventListener("click", () => {
    const modal = document.getElementById("carrito-modal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  });

  // Cerrar modal haciendo clic fuera del contenido
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("carrito-modal");
    if (e.target === modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  });

  // Botón vaciar carrito
  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    limpiarCarrito();
    Swal.fire({
      icon: 'success',
      title: 'Carrito vacío',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
  });

  // Finalizar compra: ocultar modal y mostrar selector de pago
document.getElementById("salir").addEventListener("click", () => {
  const modal = document.getElementById("carrito-modal");

  if (carrito.length === 0) {
    // Ocultar el modal antes de mostrar el aviso
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'No hay productos en el carrito para finalizar la compra.',
    });
    return;
  }

  // Si hay productos, seguir con el proceso de compra
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");

  Swal.fire({
    title: 'Selecciona un método de pago',
    input: 'radio',
    inputOptions: {
      tarjeta: 'Tarjeta de crédito',
      mercadopago: 'MercadoPago',
      efectivo: 'Efectivo en local (10% de descuento)'
    },
    inputValidator: (value) => {
      if (!value) {
        return 'Debes seleccionar un método de pago';
      }
    },
    confirmButtonText: 'Continuar con el pago'
  }).then((result) => {
    if (result.isConfirmed) {
      let metodo = result.value;
      let totalFinal = totalCarrito;

      if (metodo === "efectivo") {
        totalFinal *= 0.9;
        Swal.fire({
          icon: 'info',
          title: 'Pago en efectivo',
          html: `<p>¡Recibiste un <strong>10% de descuento</strong>!</p><p>Total a pagar en el local: <strong>$${totalFinal.toFixed(2)}</strong></p>`,
        }).then(limpiarCarrito);
      }

      if (metodo === "mercadopago") {
        Swal.fire({
          icon: 'info',
          title: 'Redirigiendo a MercadoPago...',
          timer: 3000,
          didOpen: () => Swal.showLoading()
        }).then(() => {
          window.open("https://www.mercadopago.com.ar", "_blank");
          Swal.fire({
            icon: 'success',
            title: 'Compra finalizada',
            text: `Total: $${totalFinal.toFixed(2)}`
          }).then(limpiarCarrito);
        });
      }

      if (metodo === "tarjeta") {
        Swal.fire({
          title: 'Datos de tu tarjeta',
          html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre en la tarjeta">
            <input type="text" id="numero" class="swal2-input" placeholder="Número de tarjeta">
            <input type="text" id="vencimiento" class="swal2-input" placeholder="MM/AA">
            <input type="text" id="cvv" class="swal2-input" placeholder="CVV">`,
          focusConfirm: false,
          preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            const numero = document.getElementById('numero').value;
            if (!nombre || !numero) {
              Swal.showValidationMessage('Completa todos los campos');
            }
            return { nombre, numero };
          }
        }).then((datos) => {
          if (datos.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Pago aprobado',
              text: `Gracias por tu compra, ${datos.value.nombre}!`
            }).then(limpiarCarrito);
          }
        });
      }
    }
  });
});

  // Función para limpiar carrito y actualizar la vista
  function limpiarCarrito() {
  carrito = [];
  totalCarrito = 0;
  localStorage.removeItem("carrito");
  localStorage.removeItem("totalCarrito");
  actualizarVistaCarrito();
  actualizarContadorCarrito();

  const vaciarBtn = document.getElementById("vaciar-carrito");
  if (vaciarBtn) vaciarBtn.style.display = "none";

  // Ocultar el modal también si quedó abierto
  const modal = document.getElementById("carrito-modal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}
});