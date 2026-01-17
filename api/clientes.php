<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

include_once __DIR__ . '/config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        $stmt = $conn->prepare("SELECT * FROM clientes ORDER BY id DESC");
        $stmt->execute();
        $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($clientes);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->nombre)) {
        try {
            $query = "INSERT INTO clientes (nombre, documento, telefono, direccion, email) VALUES (:nom, :doc, :tel, :dir, :email)";
            $stmt = $conn->prepare($query);

            $stmt->bindParam(":nom", $data->nombre);
            $stmt->bindParam(":doc", $data->documento);
            $stmt->bindParam(":tel", $data->telefono);
            $stmt->bindParam(":dir", $data->direccion);
            $stmt->bindParam(":email", $data->email);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Cliente registrado"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Error al registrar"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error: " . $e->getMessage()]);
        }
    }
}
?>