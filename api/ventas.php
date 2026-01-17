<?php
// api/ventas.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/config/db.php';

try {
    // Seleccionamos la venta y el nombre del usuario (cajero)
    // Usamos LEFT JOIN por si borraron al usuario, que no desaparezca la venta
    $query = "SELECT v.id, v.fecha_venta, v.total, v.metodo_pago, u.nombre as cajero 
              FROM ventas v 
              LEFT JOIN usuarios u ON v.id_usuario = u.id 
              ORDER BY v.fecha_venta DESC";
              
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($ventas);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>