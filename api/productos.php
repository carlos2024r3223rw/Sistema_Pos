<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: content-type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

include_once __DIR__ . '/config/db.php';

try {

    $query = "SELECT * FROM productos";
    $stmt = $conn->prepare($query);
    
    $stmt->execute();
    
    $productos = $stmt->fetchAll();
    
    if($productos) {
        echo json_encode($productos);
    } else {
        echo json_encode([]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al consultar productos: " . $e->getMessage()]);
}
?>