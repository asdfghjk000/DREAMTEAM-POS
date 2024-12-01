<?php
include 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $total_amount = $_POST['total_amount'];
    $payment_type = $_POST['payment_type'];

    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, payment_type) VALUES (:user_id, :total_amount, :payment_type)");
    if ($stmt->execute(['user_id' => $user_id, 'total_amount' => $total_amount, 'payment_type' => $payment_type])) {
        echo json_encode(['success' => true, 'message' => 'Order created successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error creating order']);
    }
}
?>
