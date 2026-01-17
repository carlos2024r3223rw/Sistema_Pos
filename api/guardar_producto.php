<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

include_once __DIR__ . '/config/db.php';

// Recogemos los datos del FormData
$id = isset($_POST['id']) ? $_POST['id'] : null;
$nombre = $_POST['nombre'];
$codigo = $_POST['codigo_barras'];
$precio = $_POST['precio_venta'];
$stock = $_POST['stock_actual'];

$imagen_url = null;

// --- PROCESAR LA IMAGEN ---
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $directorio_subida = "../uploads/productos/";
    
    // Crear carpeta si no existe
    if (!file_exists($directorio_subida)) {
        mkdir($directorio_subida, 0777, true);
    }

    $extension = pathinfo($_FILES["imagen"]["name"], PATHINFO_EXTENSION);
    $nombre_archivo = time() . "_" . bin2hex(random_bytes(5)) . "." . $extension;
    $ruta_final = $directorio_subida . $nombre_archivo;

    if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $ruta_final)) {
        // Guardamos la ruta relativa para que React la encuentre
        $imagen_url = "uploads/productos/" . $nombre_archivo;
    }
}

try {
    if ($id) {
        // --- MODO EDICIÓN ---
        // Si no se subió imagen nueva, mantenemos la anterior (o null si no existía)
        if ($imagen_url) {
            $sql = "UPDATE productos SET nombre=:n, codigo_barras=:c, precio_venta=:p, stock_actual=:s, imagen_url=:i WHERE id=:id";
            $params = [':n'=>$nombre, ':c'=>$codigo, ':p'=>$precio, ':s'=>$stock, ':i'=>$imagen_url, ':id'=>$id];
        } else {
            $sql = "UPDATE productos SET nombre=:n, codigo_barras=:c, precio_venta=:p, stock_actual=:s WHERE id=:id";
            $params = [':n'=>$nombre, ':c'=>$codigo, ':p'=>$precio, ':s'=>$stock, ':id'=>$id];
        }
    } else {
        // --- MODO NUEVO ---
        $sql = "INSERT INTO productos (nombre, codigo_barras, precio_venta, stock_actual, imagen_url) 
                VALUES (:n, :c, :p, :s, :i)";
        $params = [':n'=>$nombre, ':c'=>$codigo, ':p'=>$precio, ':s'=>$stock, ':i'=>$imagen_url];
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode(["status" => "success", "message" => "Producto guardado correctamente"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en la base de datos: " . $e->getMessage()]);
}
?>