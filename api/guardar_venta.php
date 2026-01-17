<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once __DIR__ . '/config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->items) && !empty($data->total)) {
    try {
        $conn->beginTransaction();

        $id_usuario = 1; 
        $id_cliente = 1; 
        

        $stmtArqueo = $conn->prepare("SELECT id FROM arqueo_caja WHERE estado = 'Abierta' ORDER BY id DESC LIMIT 1");
        $stmtArqueo->execute();
        $arqueo = $stmtArqueo->fetch(PDO::FETCH_ASSOC);
        $id_arqueo = $arqueo ? $arqueo['id'] : 1; 

        $pago_con = $data->total; 
        $cambio = 0.00;

        $queryVenta = "INSERT INTO ventas 
                       (id_usuario, id_cliente, id_arqueo, total, pago_con, cambio, tipo_comprobante, metodo_pago) 
                       VALUES 
                       (:usr, :cli, :arq, :total, :pago, :cambio, 'Ticket', 'Efectivo')";
        
        $stmtVenta = $conn->prepare($queryVenta);
        $stmtVenta->bindParam(":usr", $id_usuario);
        $stmtVenta->bindParam(":cli", $id_cliente);
        $stmtVenta->bindParam(":arq", $id_arqueo);
        $stmtVenta->bindParam(":total", $data->total);
        $stmtVenta->bindParam(":pago", $pago_con);
        $stmtVenta->bindParam(":cambio", $cambio);
        $stmtVenta->execute();
        
        $idVenta = $conn->lastInsertId();

        $queryDetalle = "INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (:id_venta, :id_prod, :cant, :precio, :subtotal)";
        $stmtDetalle = $conn->prepare($queryDetalle);

        $queryStock = "UPDATE productos SET stock_actual = stock_actual - :cant WHERE id = :id_prod";
        $stmtStock = $conn->prepare($queryStock);

        foreach($data->items as $item) {
            $subtotal = $item->cantidad * $item->precio_venta;

            $stmtDetalle->bindParam(":id_venta", $idVenta);
            $stmtDetalle->bindParam(":id_prod", $item->id);
            $stmtDetalle->bindParam(":cant", $item->cantidad);
            $stmtDetalle->bindParam(":precio", $item->precio_venta);
            $stmtDetalle->bindParam(":subtotal", $subtotal);
            $stmtDetalle->execute();

            $stmtStock->bindParam(":cant", $item->cantidad);
            $stmtStock->bindParam(":id_prod", $item->id);
            $stmtStock->execute();
        }

        $conn->commit();
        echo json_encode(["message" => "Venta registrada con éxito"]);

    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Carrito vacío"]);
}
?>