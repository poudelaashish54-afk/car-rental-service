<?php
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

$userId = $_SESSION['user_id'];
$carName = $data['car_name'] ?? '';
$startDate = $data['start_date'] ?? '';
$endDate = $data['end_date'] ?? '';
$fullName = $data['full_name'] ?? '';
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = $data['phone'] ?? '';

if (empty($carName) || empty($startDate) || empty($endDate) || empty($fullName) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$conn = getDBConnection();

$stmt = $conn->prepare("INSERT INTO bookings (user_id, car_name, start_date, end_date, full_name, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')");
$stmt->bind_param("issssss", $userId, $carName, $startDate, $endDate, $fullName, $email, $phone);

if ($stmt->execute()) {
    $bookingId = $conn->insert_id;

    echo json_encode([
        'success' => true,
        'booking' => [
            'id' => $bookingId,
            'user_id' => $userId,
            'car_name' => $carName,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'full_name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'status' => 'pending'
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create booking']);
}

$stmt->close();
$conn->close();
?>
