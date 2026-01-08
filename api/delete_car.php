<?php
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$carId = $data['id'] ?? 0;

if (empty($carId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Car ID is required']);
    exit;
}

$conn = getDBConnection();

$stmt = $conn->prepare("DELETE FROM cars WHERE id = ?");
$stmt->bind_param("i", $carId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Car not found']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete car']);
}

$stmt->close();
$conn->close();
?>
