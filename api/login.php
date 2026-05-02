<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

include_once __DIR__ . '/config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['usuario']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$usuario = $data['usuario'];
$password = $data['password'];

try {
    $stmt = $conn->prepare("SELECT id, nombre, rol, estado FROM usuarios WHERE nombre = :u AND password_hash = :p");
    $stmt->execute([':u' => $usuario, ':p' => $password]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if ($user['estado'] == 1) {
            echo json_encode([
                "success" => true,
                "token" => base64_encode(random_bytes(16)),
                "usuario" => $user
            ]);
        } else {
            echo json_encode(["success" => false, "error" => "Usuario inactivo"]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Usuario o contraseña incorrectos"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Error del servidor"]);
}
?>
