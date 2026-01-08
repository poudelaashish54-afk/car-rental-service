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

$carId = $data['id'] ?? 0;
$model = $data['model'] ?? '';
$pricePerDay = $data['price_per_day'] ?? 0;
$status = $data['status'] ?? 'available';
$description = $data['description'] ?? '';
$imageUrl = $data['image_url'] ?? '';

if (empty($carId) || empty($model) || $pricePerDay <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID, model and price are required']);
    exit;
}

$conn = getDBConnection();

$stmt = $conn->prepare("UPDATE cars SET model = ?, price_per_day = ?, status = ?, description = ?, image_url = ? WHERE id = ?");
$stmt->bind_param("sdsssi", $model, $pricePerDay, $status, $description, $imageUrl, $carId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0 || true) {
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
        http_response_code(404);
        echo json_encode(['error' => 'Car not found']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update car']);
}

$stmt->close();
$conn->close();
?>
