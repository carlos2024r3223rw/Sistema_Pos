<?php

$host = 'localhost';
$db_name = 'sistema_pos';
$username = 'root';
$password = ''; 

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch(PDOException $e) {

header('Content-Type: application/json');
    echo json_encode(['error' => 'Error de conexión a BD: ' . $e->getMessage()]);
    exit;
}
?>