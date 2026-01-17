<?php
// api/generar_datos.php
// AUMENTAMOS EL TIEMPO LIMITE DE EJECUCION (Insertar 200 tarda un poco)
set_time_limit(300); 

include_once __DIR__ . '/config/db.php';

echo "<h1>🏭 Generando inventario masivo...</h1>";
echo "<p>Esto puede tardar unos segundos...</p>";

try {
    $conn->beginTransaction();

    // Arrays para combinar palabras y crear nombres divertidos
    $tipos = ["Galletas", "Jugo", "Papas", "Chicle", "Cerveza", "Agua", "Leche", "Pan", "Yogurt", "Chocolate", "Queso", "Jamón", "Detergente", "Jabón", "Arroz"];
    $marcas = ["Lays", "CocaCola", "Nestle", "Bimbo", "Corona", "Pepsi", "Danone", "Milka", "Diana", "Ideal", "Maggi"];
    $sabores = ["Fresa", "Vainilla", "Picante", "Original", "Limon", "Naranja", "Chocolate", "Menta"];

    // Preparamos la sentencia SQL
    // Fíjate que insertamos en 'imagen' una URL directa
    $stmt = $conn->prepare("INSERT INTO productos (nombre, codigo_barras, precio_venta, stock_actual, imagen) VALUES (:nom, :cod, :pre, :stock, :img)");

    for ($i = 0; $i < 200; $i++) {
        // 1. Nombre Aleatorio: "Yogurt Danone Fresa"
        $nombre = $tipos[array_rand($tipos)] . " " . $marcas[array_rand($marcas)] . " " . $sabores[array_rand($sabores)];
        
        // 2. Código único
        $codigo = rand(10000000, 99999999);
        
        // 3. Precio ($0.50 a $20.00)
        $precio = rand(5, 200) / 10; 
        
        // 4. Stock
        $stock = rand(0, 100);

        // 5. IMAGEN FALSA (Placeholder)
        // Usamos un servicio que genera imágenes con texto (las iniciales del producto)
        // Ej: https://placehold.co/400x400/orange/white?text=Yogurt
        $color = dechex(rand(0x000000, 0xFFFFFF)); // Color aleatorio hexadecimal
        $texto_url = urlencode($nombre);
        $imagen = "https://placehold.co/200x200/$color/white?text=$texto_url";

        $stmt->bindParam(":nom", $nombre);
        $stmt->bindParam(":cod", $codigo);
        $stmt->bindParam(":pre", $precio);
        $stmt->bindParam(":stock", $stock);
        $stmt->bindParam(":img", $imagen);
        
        $stmt->execute();
    }

    $conn->commit();
    echo "<h2 style='color:green'>¡ÉXITO! 200 Productos creados con imágenes. 🚀</h2>";
    echo "<a href='/'>Volver al sistema</a>";

} catch (Exception $e) {
    $conn->rollBack();
    echo "<h2 style='color:red'>Error: " . $e->getMessage() . "</h2>";
}
?>