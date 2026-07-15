const productos = [
    // --- CAFÉS DE ESPECIALIDAD ---
    { id: 1, nombre: "Mocaccino Supremo", categoria: "cafes", descripcion: "Espresso perfecto, chocolate artesanal cusqueño, leche vaporizada y canela.", precio: 9.50 },
    { id: 2, nombre: "Latte de Vainilla Francesa", categoria: "cafes", descripcion: "Café espresso suave con un toque gourmet aromático de vainilla fina.", precio: 8.50 },
    { id: 3, nombre: "Capuccino Tradicional", categoria: "cafes", descripcion: "El balance exacto entre un espresso robusto y cremosa espuma de leche.", precio: 7.50 },
    { id: 4, nombre: "Americano de Altura", fontSize: "cafes", descripcion: "Doble shot de esencia de granos seleccionados pasados al momento.", precio: 5.50 },
    { id: 5, nombre: "Frappé Oreo Premium", categoria: "cafes", descripcion: "Café frío licuado con crema, galletas Oreo y fudge de chocolate.", precio: 11.00 },

    // --- SECCIÓN SALCHIPAPAS VARIADAS ---
    { id: 6, nombre: "Salchipapa Clásica Crujiente", categoria: "salchipapas", descripcion: "Papas seleccionadas doradas, rodajas de salchicha Frankfurt y cremas.", precio: 12.00 },
    { id: 7, nombre: "Salchiccono Express", categoria: "salchipapas", descripcion: "Formato personal en cono de papas nativas con hotdog, ideal para el camino.", precio: 8.00 },
    { id: 8, nombre: "Pollipapa de la Casa", categoria: "salchipapas", descripcion: "Cama de papas fritas con trozos de filete de pollo sazonado a la plancha.", precio: 15.00 },
    { id: 9, nombre: "Pollipapa Ahumada Especial", categoria: "salchipapas", descripcion: "Sabores intensos con jugoso pollo ahumado artesanalmente y papas crocantes.", precio: 17.00 },
    { id: 10, nombre: "Salchi-Broaster Espinar", categoria: "salchipapas", descripcion: "Fusión potente: papas doradas, salchichas y una crujiente pieza de pollo broaster.", precio: 18.50 },
    { id: 11, nombre: "Salchipapa Montada", categoria: "salchipapas", descripcion: "Para grandes apetitos: Salchipapa clásica coronada con huevo frito y queso derretido.", precio: 16.00 },

    // --- PASTELERÍA Y POSTRES ---
    { id: 12, nombre: "Torta de Tres Leches Fina", categoria: "postres", descripcion: "Bizcochuelo súper húmedo bañado en tres tipos de leche selectas.", precio: 8.50 },
    { id: 13, nombre: "Brownie con Helado de Vainilla", categoria: "postres", descripcion: "Brownie tibio y melcochudo con una bola de helado artesanal.", precio: 9.50 },
    { id: 14, nombre: "Cheesecake de Frutos Rojos", categoria: "postres", descripcion: "Suave crema de queso horneada sobre galleta crocante y mermelada fina.", precio: 10.50 },
    { id: 15, nombre: "Pie de Limón Andino", categoria: "postres", descripcion: "Crema ácida balanceada cubierta de merengue suizo perfectamente tostado.", precio: 8.00 }
];

const DESTINO_WHATSAPP = "51907094084"; 
let carrito = [];

function filtrarMenu(categoriaSeleccionada) {
    const contenedor = document.getElementById('catalogo-productos');
    contenedor.innerHTML = "";

    const filtrados = productos.filter(p => p.categoria === categoriaSeleccionada);

    filtrados.forEach(p => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-premium-producto');
        tarjeta.innerHTML = `
            <div>
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
            </div>
            <div class="contenedor-compra">
                <span class="precio-tag">S/. ${p.precio.toFixed(2)}</span>
                <button class="btn-añadir-orden" onclick="agregarProducto(${p.id})">Añadir</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });

    const botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(b => b.classList.remove('activo'));
    
    botones.forEach(b => {
        if(b.textContent.toLowerCase().includes(categoriaSeleccionada.substring(0,4))) {
            b.classList.add('activo');
        }
    });
}

function agregarProducto(id) {
    const encontrarProd = productos.find(p => p.id === id);
    const yaExiste = carrito.find(item => item.id === id);

    if (yaExiste) {
        yaExiste.cantidad++;
    } else {
        carrito.push({ ...encontrarProd, cantidad: 1 });
    }
    actualizarCarritoInterfaz();
}

function removerProducto(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoInterfaz();
}

function actualizarCarritoInterfaz() {
    const lista = document.getElementById('lista-pedido');
    const subtotalText = document.getElementById('subtotal-pago');
    const totalText = document.getElementById('total-pago');
    const badge = document.getElementById('contador-items-badge');

    lista.innerHTML = "";
    
    let totalUnidades = 0;
    let cuentaTotal = 0;

    if (carrito.length === 0) {
        lista.innerHTML = `<p class="pedido-vacio">No has seleccionado ningún producto aún.</p>`;
        subtotalText.textContent = "S/. 0.00";
        totalText.textContent = "S/. 0.00";
        badge.textContent = "0";
        return;
    }

    carrito.forEach(item => {
        totalUnidades += item.cantidad;
        let costeElemento = item.precio * item.cantidad;
        cuentaTotal += costeElemento;

        const div = document.createElement('div');
        div.classList.add('item-pedido-activo');
        div.innerHTML = `
            <span><strong>${item.cantidad}x</strong> ${item.nombre}</span>
            <div>
                <span>S/. ${costeElemento.toFixed(2)}</span>
                <button class="btn-sacar-item" onclick="removerProducto(${item.id})"><i class="fa-solid fa-square-minus"></i></button>
            </div>
        `;
        lista.appendChild(div);
    });

    badge.textContent = totalUnidades;
    subtotalText.textContent = `S/. ${cuentaTotal.toFixed(2)}`;
    totalText.textContent = `S/. ${cuentaTotal.toFixed(2)}`;
}

function procesarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Añade algunas delicias antes de enviar.");
        return;
    }

    const nombre = document.getElementById('cliente-nombre').value.trim();
    const direccion = document.getElementById('cliente-direccion').value.trim();

    if (!nombre) {
        alert("Por favor, ingresa tu nombre para saber a quién dirigirnos.");
        return;
    }

    const textoLimpio = direccion.toLowerCase();
    const contieneTerminoEspinar = textoLimpio.includes("espinar");
    const contieneMesa = textoLimpio.includes("mesa");
    const callesComunes = ["central", "cusco", "puno", "arequipa", "plaza", "sucre", "bolivar", "yauri", "tintaya", "28 de julio", "lima"];
    
    let contieneCalleConocida = callesComunes.some(calle => textoLimpio.includes(calle));

    if (!contieneTerminoEspinar && !contieneMesa && !contieneCalleConocida) {
        alert("🛑 DIRECCIÓN NO VÁLIDA:\n\nPor favor, ingresa una ubicación válida dentro de Espinar (Ej: Av. Central 420 Espinar) o ingresa tu número de Mesa si te encuentras en el establecimiento.");
        return; 
    }

    let msj = `🏛️ *NUEVA ORDEN - DULCE ENCUENTRO* 🏛️\n`;
    msj += `=========================================\n\n`;
    msj += `👤 *Cliente:* ${nombre}\n`;
    msj += `📍 *Ubicación / Mesa:* ${direccion}\n\n`;
    msj += `🛒 *DETALLE DEL PEDIDO:*\n`;
    
    let neto = 0;
    carrito.forEach(item => {
        let sub = item.precio * item.cantidad;
        neto += sub;
        msj += `  • ${item.cantidad}x ${item.nombre} (S/. ${sub.toFixed(2)})\n`;
    });

    msj += `\n=========================================\n`;
    msj += `💰 *TOTAL NETO A PAGAR:* S/. ${neto.toFixed(2)}\n`;
    msj += `=========================================\n\n`;
    msj += `✨ _Enviado desde nuestra plataforma web. Aguardo la confirmación de cocina._`;

    const msjCodificado = encodeURIComponent(msj);
    window.open(`https://api.whatsapp.com/send?phone=${DESTINO_WHATSAPP}&text=${msjCodificado}`, '_blank');
}

document.addEventListener("DOMContentLoaded", () => {
    filtrarMenu('cafes');
});