<?php
// api/guardar_producto.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

include_once __DIR__ . '/config/db.php';

// Validar si viene ID (si viene es EDICIÓN, si no es CREACIÓN)
$id = $_POST['id'] ?? null;
$nombre = $_POST['nombre'] ?? '';
$precio = $_POST['precio_venta'] ?? 0;
$stock = $_POST['stock_actual'] ?? 0;
$codigo = $_POST['codigo_barras'] ?? '';

// Lógica de la Imagen
$ruta_imagen = null;

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $directorio = __DIR__ . "/imagenes/";
    if (!is_dir($directorio)) mkdir($directorio, 0777, true);

    $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $nombre_archivo = uniqid() . "." . $extension;
    $ruta_destino = $directorio . $nombre_archivo;

    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta_destino)) {
        $ruta_imagen = "api/imagenes/" . $nombre_archivo;
    }
}

try {
    if ($id) {
        // --- MODO EDICIÓN (UPDATE) ---
        $sql = "UPDATE productos SET nombre=:nom, codigo_barras=:cod, precio_venta=:pre, stock_actual=:stock";
        if ($ruta_imagen) $sql .= ", imagen=:img"; 
        $sql .= " WHERE id=:id";

        $stmt = $conn->prepare($sql);
        if ($ruta_imagen) $stmt->bindParam(":img", $ruta_imagen);
        $stmt->bindParam(":id", $id);

    } else {
        // --- MODO CREACIÓN (INSERT) ---
        $sql = "INSERT INTO productos (nombre, codigo_barras, precio_venta, stock_actual, imagen) VALUES (:nom, :cod, :pre, :stock, :img)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":img", $ruta_imagen);
    }

    $stmt->bindParam(":nom", $nombre);
    $stmt->bindParam(":cod", $codigo);
    $stmt->bindParam(":pre", $precio);
    $stmt->bindParam(":stock", $stock);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Guardado con éxito"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error en BD"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>