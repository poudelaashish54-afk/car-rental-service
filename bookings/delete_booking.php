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
$bookingId = $data['booking_id'] ?? 0;

if (empty($bookingId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Booking ID is required']);
    exit;
}

$userId = $_SESSION['user_id'];
$conn = getDBConnection();

$stmt = $conn->prepare("DELETE FROM bookings WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $bookingId, $userId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Booking not found']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete booking']);
}

$stmt->close();
$conn->close();
?>
