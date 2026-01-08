<?php
require_once '../config.php';

header('Content-Type: application/json');

if (isset($_SESSION['user_id']) && isset($_SESSION['user_email'])) {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'] ?? '',
            'email' => $_SESSION['user_email']
        ]
    ]);
} else {
    echo json_encode([
        'authenticated' => false
    ]);
}
?>
