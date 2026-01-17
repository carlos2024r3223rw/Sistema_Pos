<?php
// api/actualizar_producto.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
include_once __DIR__ . '/config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->nombre)) {
    try {
        $query = "UPDATE productos SET nombre=:nom, codigo_barras=:cod, precio_venta=:pre, stock_actual=:stock WHERE id=:id";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(":nom", $data->nombre);
        $stmt->bindParam(":cod", $data->codigo_barras);
        $stmt->bindParam(":pre", $data->precio_venta);
        $stmt->bindParam(":stock", $data->stock_actual);
        $stmt->bindParam(":id", $data->id);

        if($stmt->execute()) {
            echo json_encode(["message" => "Producto actualizado"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "No se pudo actualizar"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error: " . $e->getMessage()]);
    }
}
?>