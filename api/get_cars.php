<?php
require_once '../config.php';

header('Content-Type: application/json');

$conn = getDBConnection();

$sql = "SELECT id, model, price_per_day, status, description, image_url, created_at FROM cars ORDER BY created_at DESC";
$result = $conn->query($sql);

$cars = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $cars[] = $row;
    }
}

echo json_encode(['cars' => $cars]);

$conn->close();
?>
