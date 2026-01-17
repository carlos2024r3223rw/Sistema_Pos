<?php
// api/productos.php

// 1. Cabeceras para permitir que React se conecte (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

// 2. Incluir la conexión (USANDO RUTA ABSOLUTA PARA EVITAR ERRORES)
include_once __DIR__ . '/config/db.php';

try {
    // 3. Preparar la consulta
    // (Seleccionamos todo de la tabla productos)
    $query = "SELECT * FROM productos";
    $stmt = $conn->prepare($query);
    
    // 4. Ejecutar
    $stmt->execute();
    
    // 5. Obtener los datos y enviarlos como JSON
    $productos = $stmt->fetchAll();
    
    // Verificar si hay datos
    if($productos) {
        echo json_encode($productos);
    } else {
        echo json_encode([]); // Devuelve array vacío si no hay productos
    }

} catch (Exception $e) {
    // Si hay error en la consulta
    http_response_code(500);
    echo json_encode(["error" => "Error al consultar productos: " . $e->getMessage()]);
}
?>