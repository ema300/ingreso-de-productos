var productos = [];
var vendido = 0.00;
var acum = 0;
var carrito = [];


localStorage.setItem('finalizo_compra', 'no');
// Obtén el valor almacenado en localStorage
var compra_actual = localStorage.getItem('finalizo_compra');



window.addEventListener('load', function () {
    if (localStorage.getItem('productos')) {
        productos = JSON.parse(localStorage.getItem('productos'));
        carrito = JSON.parse(localStorage.getItem('carrito'));

        displayProductsInTable();
        actualizarTotalPrecio(); // Actualizar el total de precios
        actualizarCompraActual();
    }
});

function displayProductsInTable(productsToDisplay = productos) {
    var tabla = document.getElementById('tabla-productos');
    tabla.innerHTML = ""; // Limpiar el contenido existente de la tabla
    var headerRow = tabla.insertRow();
    for (var key in productsToDisplay[0]) {
        var headerCell = headerRow.insertCell();
        headerCell.innerHTML = key;
    }

    productsToDisplay.forEach(function (product, index) {
        var row = tabla.insertRow();
        for (var key in product) {
            var cell = row.insertCell();
            cell.innerHTML = product[key];
        }

        // Agregar un botón de eliminar a cada fila
        var deleteCell = row.insertCell();
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Eliminar';
        deleteButton.addEventListener('click', function () {
            eliminarProducto(index);
        });
        deleteCell.appendChild(deleteButton);
    });
}


function obtenerFechaYHoraActuales() {
    var now = new Date();
    var fecha = now.toISOString().slice(0, 10);
    var hora = now.toTimeString().slice(0, 8);
    return { fecha, hora };
}

function calcularTotal() {
    var precio = parseFloat(document.getElementById('precio').value);
    var cantidad = parseFloat(document.getElementById('cantidad').value);
    var total = precio * cantidad;
    document.getElementById('total-precio').value = total.toFixed(2);
}


function eliminarProducto(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        if (compra_actual === 'no' && carrito[index].Total=== productos[index].Total) {
            vendido = localStorage.getItem('valor_compra_actual');

            acum = Math.max(parseFloat(vendido), carrito[index].Total ) - Math.min(parseFloat(vendido), carrito[index].Total );
            localStorage.setItem('valor_compra_actual', JSON.stringify(acum));
            var vendidoActualElement = document.getElementById('vendido-actual');
            vendidoActualElement.textContent = 'Compra actual: $' + acum;


            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));


            productos.splice(index, 1);
            localStorage.setItem('productos', JSON.stringify(productos));
            displayProductsInTable();

    
        }
        console.log(productos.length)
        if (productos.length===0) {
            localStorage.removeItem('productos');
            localStorage.removeItem('carrito');
            productos = [];
            Carrito = [];
            localStorage.removeItem('Ident');
    
            localStorage.setItem('finalizo_compra', 'si');
            compra_actual = localStorage.getItem('finalizo_compra');
            vendido = localStorage.setItem('valor_compra_actual', '0.00');
            localStorage.removeItem('valor_compra_actual');
            vendido = 0;
    
            acum = 0;
    
            displayProductsInTable();
            actualizarTotalPrecio();
            actualizarCompraActual();
        }
        else{
            productos.splice(index, 1);
            localStorage.setItem('productos', JSON.stringify(productos));

            displayProductsInTable();
            actualizarTotalPrecio(); // Actualizar el total de precios después de eliminar
            
        }
        
       
        
    }
}
document.getElementById('guardar').addEventListener('click', function () {
    var nombre = document.getElementById('nombre').value;
    var precio = parseFloat(document.getElementById('precio').value);
    var cantidad = parseFloat(document.getElementById('cantidad').value);
    actualizarTotalPrecio();

    localStorage.setItem('finalizo_compra', 'no');
    // Obtén el valor almacenado en localStorage
    compra_actual = localStorage.getItem('finalizo_compra');
    //para el ID
    if (localStorage.getItem('Ident') === null) {
        localStorage.setItem('Ident', '0');
    }
    var id_anterior = localStorage.getItem('Ident');

    // Obtén el valor almacenado en localStorage
    var id = parseInt(id_anterior) + 1;

    localStorage.setItem('Ident', id.toString());

    if (nombre.trim() === '' || isNaN(precio) || isNaN(cantidad) || precio < 0 || cantidad < 0) {
        alert('Por favor, complete todos los campos correctamente y asegúrese de que el precio y la cantidad no sean negativos.');
        return;
    }

    var { fecha, hora } = obtenerFechaYHoraActuales();

    var total = (precio * cantidad).toFixed(2);
    vendido = total;
    localStorage.setItem('valor_compra_actual', vendido);
    // Obtén el valor almacenado en localStorage

    productos.push({
        "ID": id,
        "Producto": nombre,
        "Precio": precio,
        "Cantidad": cantidad,
        "Total": total,
        "Fecha": fecha,
        "Hora": hora
    });

    
    carrito = productos.slice();

    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('carrito', JSON.stringify(carrito));
    displayProductsInTable();

    document.getElementById('nombre').value = "";
    document.getElementById('precio').value = "";
    document.getElementById('cantidad').value = "";

    actualizarTotalPrecio();
    actualizarCompraActual();
});

document.getElementById('exportar-xlsx').addEventListener('click', function () {
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(productos);
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');

    var now = new Date();
    var datePart = now.toISOString().slice(0, 10).replace(/-/g, '-');
    var timePart = now.toTimeString().slice(0, 8).replace(/:/g, '-');
    var fileName = 'productos_' + datePart + '_' + timePart + '.xlsx';

    XLSX.writeFile(wb, fileName);
});

document.getElementById('vaciar-localstorage').addEventListener('click', function () {
    var confirmacion = confirm('¿Estás seguro de que deseas vaciar los datos almacenados en el almacenamiento local?');
    if (confirmacion) {
        localStorage.removeItem('productos');
        localStorage.removeItem('carrito');
        productos = [];
        Carrito = [];
        localStorage.removeItem('Ident');

        localStorage.setItem('finalizo_compra', 'si');
        compra_actual = localStorage.getItem('finalizo_compra');
        vendido = localStorage.setItem('valor_compra_actual', '0.00');
        localStorage.removeItem('valor_compra_actual');
        vendido = 0;

        acum = 0;

        displayProductsInTable();
        actualizarTotalPrecio();
        actualizarCompraActual();


    }
});

function finalizar_compra() {
    var confirmacion = confirm('¿Estás seguro de que deseas finalizar la compra?');
    if (confirmacion) {
        localStorage.setItem('finalizo_compra', 'si');
        compra_actual = localStorage.getItem('finalizo_compra');
        vendido = localStorage.setItem('valor_compra_actual', '0.00');
        localStorage.removeItem('valor_compra_actual');
        vendido = 0;
        carrito =[];
        acum = 0;
        actualizarCompraActual();
    }
}

document.getElementById('precio').addEventListener('input', calcularTotal);
document.getElementById('cantidad').addEventListener('input', calcularTotal);

var sortDirection = 'asc';

function toggleSortDirection() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
}

function sortProducts() {
    productos.sort(function (a, b) {
        if (sortDirection === 'asc') {

            return a.Hora.localeCompare(b.Hora);
        } else {
            return b.Hora.localeCompare(a.Hora);
        }
    });

    displayProductsInTable();
}

document.getElementById('sort-button').addEventListener('click', function () {
    toggleSortDirection();
    sortProducts();
});

document.getElementById('search-button').addEventListener('click', function () {
    var searchInput = document.getElementById('search-input').value.toLowerCase();
    var filteredProducts = productos.filter(function (product) {
        return (
            product.Producto.toLowerCase().includes(searchInput) ||
            product.Fecha.includes(searchInput) ||
            product.Hora.includes(searchInput) ||
            product.Precio.toString().includes(searchInput)
        );
    });

    displayProductsInTable(filteredProducts);
});

document.getElementById('show-all-button').addEventListener('click', function () {
    displayProductsInTable();
});

function actualizarTotalPrecio() {
    var total = productos.reduce(function (acumulador, producto) {


        return acumulador + parseFloat(producto.Total);
    }, 0);

    var totalPrecioElement = document.getElementById('total-precio');
    totalPrecioElement.textContent = 'Total: $' + total.toFixed(2);
}

function actualizarCompraActual() {
    if (compra_actual === 'no') {
        console.log('No finalizo');
        vendido = localStorage.getItem('valor_compra_actual');
        acum = parseFloat(acum) + parseFloat(vendido);
        localStorage.setItem('valor_compra_actual', JSON.stringify(acum));
        var vendidoActualElement = document.getElementById('vendido-actual');
        vendidoActualElement.textContent = 'Compra actual: $' + acum;
    } else {
        console.log('Si finalizo');
        vendido = 0;
        var vendidoActualElement = document.getElementById('vendido-actual');
        vendidoActualElement.textContent = 'Compra actual: $' + vendido.toFixed(2);
        vendido = localStorage.setItem('valor_compra_actual', '0');
    }
}


