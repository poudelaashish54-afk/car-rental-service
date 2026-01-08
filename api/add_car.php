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

$model = $data['model'] ?? '';
$pricePerDay = $data['price_per_day'] ?? 0;
$status = $data['status'] ?? 'available';
$description = $data['description'] ?? '';
$imageUrl = $data['image_url'] ?? '';

if (empty($model) || $pricePerDay <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Model and price are required']);
    exit;
}

$conn = getDBConnection();

$stmt = $conn->prepare("INSERT INTO cars (model, price_per_day, status, description, image_url) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sdsss", $model, $pricePerDay, $status, $description, $imageUrl);

if ($stmt->execute()) {
    $carId = $conn->insert_id;

    echo json_encode([
        'success' => true,
        'car' => [
            'id' => $carId,
            'model' => $model,
            'price_per_day' => $pricePerDay,
            'status' => $status,
            'description' => $description,
            'image_url' => $imageUrl
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add car']);
}

$stmt->close();
$conn->close();
?>
