<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once __DIR__ . '/config/db.php';

try {
    $stmt = $conn->query("SELECT id, nombre FROM categorias ORDER BY nombre ASC");
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categorias);
} catch (Exception $e) {
    echo json_encode(["error" => "Error cargando categorias"]);
}
?>
