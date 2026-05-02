<?php
// api/detalle_venta.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/config/db.php';

$id_venta = $_GET['id'] ?? null;

if (!$id_venta) {
    echo json_encode([]);
    exit;
}

try {

    $query = "SELECT d.cantidad, d.precio_unitario as precio_venta, p.nombre 
              FROM detalle_ventas d
              JOIN productos p ON d.id_producto = p.id
              WHERE d.id_venta = :id";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(":id", $id_venta);
    $stmt->execute();
    $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($detalles);
} catch (Exception $e) {
    echo json_encode([]);
}
?>