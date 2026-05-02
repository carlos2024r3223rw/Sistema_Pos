<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

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

if ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->id) && !empty($data->nombre)) {
        try {
            $query = "UPDATE clientes SET nombre = :nom, documento = :doc, telefono = :tel, direccion = :dir, email = :email WHERE id = :id";
            $stmt = $conn->prepare($query);

            $stmt->bindParam(":nom", $data->nombre);
            $stmt->bindParam(":doc", $data->documento);
            $stmt->bindParam(":tel", $data->telefono);
            $stmt->bindParam(":dir", $data->direccion);
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":id", $data->id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Cliente actualizado"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Error al actualizar"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error: " . $e->getMessage()]);
        }
    }
}

if ($method == 'DELETE') {
    $id = $_GET['id'] ?? null;

    if ($id) {
        try {
            $stmt = $conn->prepare("DELETE FROM clientes WHERE id = :id");
            $stmt->bindParam(":id", $id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Cliente eliminado"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Error al eliminar"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error: " . $e->getMessage()]);
        }
    }
}
?>