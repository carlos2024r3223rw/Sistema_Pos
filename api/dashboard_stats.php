<?php
// api/dashboard_stats.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/config/db.php';

$response = [
    "ventas_hoy" => 0,
    "productos_activos" => 0,
    "alertas_stock" => 0
];

try {
    // 1. Ventas de Hoy (Usamos COALESCE para que si es null, devuelva 0)
    $query1 = "SELECT COALESCE(SUM(total), 0) as total FROM ventas WHERE DATE(fecha_venta) = CURDATE()";
    $stmt1 = $conn->prepare($query1);
    $stmt1->execute();
    $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
    $response['ventas_hoy'] = $row1['total'];

    // 2. Productos Totales
    $query2 = "SELECT COUNT(*) as total FROM productos";
    $stmt2 = $conn->prepare($query2);
    $stmt2->execute();
    $row2 = $stmt2->fetch(PDO::FETCH_ASSOC);
    $response['productos_activos'] = $row2['total'];

    // 3. Alertas (Stock bajo 5)
    $query3 = "SELECT COUNT(*) as total FROM productos WHERE stock_actual <= 5";
    $stmt3 = $conn->prepare($query3);
    $stmt3->execute();
    $row3 = $stmt3->fetch(PDO::FETCH_ASSOC);
    $response['alertas_stock'] = $row3['total'];

    echo json_encode($response);

} catch (Exception $e) {
    // En caso de error, devolvemos ceros pero en formato JSON válido
    echo json_encode($response);
}
?>