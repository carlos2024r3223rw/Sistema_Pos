<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

include_once __DIR__ . '/config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No se recibieron datos"]);
    exit;
}

try {
    $conn->beginTransaction();

    // Insertamos la venta con id_usuario 1 e id_arqueo 1 que ya tienes en la DB
    $queryVenta = "INSERT INTO ventas (id_usuario, id_cliente, id_arqueo, total, pago_con, cambio, fecha_venta) 
                   VALUES (1, 1, 1, :total, :pago, :cambio, NOW())";
    $stmtVenta = $conn->prepare($queryVenta);
    $stmtVenta->execute([
        ':total' => $data['total'],
        ':pago'  => $data['pago_con'],
        ':cambio' => $data['cambio']
    ]);
    
    $idVenta = $conn->lastInsertId();

    foreach ($data['items'] as $item) {
        $subtotal = $item['cantidad'] * $item['precio_venta'];
        
        $queryDetalle = "INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) 
                         VALUES (:idv, :idp, :cant, :pre, :sub)";
        $stmtDetalle = $conn->prepare($queryDetalle);
        $stmtDetalle->execute([
            ':idv' => $idVenta,
            ':idp' => $item['id'],
            ':cant' => $item['cantidad'],
            ':pre' => $item['precio_venta'],
            ':sub' => $subtotal
        ]);

        // Actualizamos el stock
        $upd = $conn->prepare("UPDATE productos SET stock_actual = stock_actual - :c WHERE id = :id");
        $upd->execute([':c' => $item['cantidad'], ':id' => $item['id']]);
    }

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "¡Venta realizada!"]);
} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>