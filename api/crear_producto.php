<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once __DIR__ . '/config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->nombre) && !empty($data->precio_venta)) {
    try {
        $query = "INSERT INTO productos (codigo_barras, nombre, precio_venta, stock_actual) VALUES (:codigo, :nombre, :precio, :stock)";
        $stmt = $conn->prepare($query);

        $codigo = $data->codigo_barras ?? ''; 
        $nombre = $data->nombre;
        $precio = $data->precio_venta;
        $stock = $data->stock_actual ?? 0;

        $stmt->bindParam(":codigo", $codigo);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":precio", $precio);
        $stmt->bindParam(":stock", $stock);

        if($stmt->execute()) {
            echo json_encode(["message" => "Producto creado"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "No se pudo crear el producto"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Faltan datos (Nombre o Precio)"]);
}
?>