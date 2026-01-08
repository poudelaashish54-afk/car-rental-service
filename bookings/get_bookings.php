<?php
require_once '../config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$userId = $_SESSION['user_id'];
$conn = getDBConnection();

$stmt = $conn->prepare("SELECT b.id, b.car_id, c.model as car_model, b.start_date, b.end_date, b.full_name, b.email, b.phone, b.status, b.created_at FROM bookings b INNER JOIN cars c ON b.car_id = c.id WHERE b.user_id = ? ORDER BY b.created_at DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode(['bookings' => $bookings]);

$stmt->close();
$conn->close();
?>
