<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/config/db.php';

try {
    $total_productos = $conn->query("SELECT COUNT(*) FROM productos")->fetchColumn();
    $ventas_hoy = $conn->query("SELECT SUM(total) FROM ventas WHERE DATE(fecha_venta) = CURDATE()")->fetchColumn() ?: 0;
    $bajo_stock = $conn->query("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo")->fetchColumn();

    echo json_encode([
        "total_productos" => (int)$total_productos,
        "ventas_hoy" => (float)$ventas_hoy,
        "bajo_stock" => (int)$bajo_stock
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}