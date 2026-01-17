<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
include_once __DIR__ . '/config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $stmt = $conn->prepare("SELECT * FROM empresa LIMIT 1");
    $stmt->execute();
    $datos = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($datos ?: []); 
}

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $check = $conn->query("SELECT COUNT(*) FROM empresa")->fetchColumn();

    if ($check > 0) {
        $query = "UPDATE empresa SET nombre=:nom, direccion=:dir, telefono=:tel, simbolo_moneda=:sim, impuesto_porcentaje=:imp, mensaje_ticket=:msj WHERE id=1";
    } else {
        $query = "INSERT INTO empresa (nombre, direccion, telefono, simbolo_moneda, impuesto_porcentaje, mensaje_ticket) VALUES (:nom, :dir, :tel, :sim, :imp, :msj)";
    }

    $stmt = $conn->prepare($query);
    $stmt->bindParam(":nom", $data->nombre);
    $stmt->bindParam(":dir", $data->direccion);
    $stmt->bindParam(":tel", $data->telefono);
    $stmt->bindParam(":sim", $data->simbolo_moneda);
    $stmt->bindParam(":imp", $data->impuesto_porcentaje);
    $stmt->bindParam(":msj", $data->mensaje_ticket);

    if($stmt->execute()) {
        echo json_encode(["message" => "Configuración guardada"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo guardar"]);
    }
}
?>