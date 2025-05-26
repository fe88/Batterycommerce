
const IVA = 1.21;
let totalCarrito = 0;
let carrito = [];

const resultadoConIva = (precio) => precio * IVA;

let condition = true;

do {
    let eleccion = prompt(`Bienvenido/a a nuestra tienda, seleccione un producto:
    1 - Pilas alcalinas ($5000)
    2 - Baterías para notebook ($45000)
    3 - Batería de gel ($30000)
    4 - Cargadores para pilas recargables ($60000)
    5 - Ver total y productos
    ESC - Salir de la tienda
    `);

    switch (eleccion) {
        case "1":
            carrito.push({ nombre: "Pilas alcalinas", precio: 5000 });
            totalCarrito += resultadoConIva(5000);
            break;
        case "2":
            carrito.push({ nombre: "Baterías para notebook", precio: 45000 });
            totalCarrito += resultadoConIva(45000);
            break;
        case "3":
            carrito.push({ nombre: "Batería de gel", precio: 30000 });
            totalCarrito += resultadoConIva(30000);
            break;
        case "4":
            carrito.push({ nombre: "Cargador para pilas recargables", precio: 60000 });
            totalCarrito += resultadoConIva(60000);
            break;
        case "5":
        let detalle = "Productos en tu carrito:\n";
        carrito.forEach((producto, index) => {
        detalle += `${index + 1}. ${producto.nombre} - $${(producto.precio * IVA).toFixed(2)}\n`;
    });
        detalle += `\nTotal (con IVA): $${totalCarrito.toFixed(2)}`;
        alert(detalle);
        break;
        case "ESC":
            alert("Gracias por su compra. ¡Vuelva pronto!");
            condition = false;
            break;
        default:
            alert("No contamos con stock del producto solicitado");
            break;
    }
} while (condition);

