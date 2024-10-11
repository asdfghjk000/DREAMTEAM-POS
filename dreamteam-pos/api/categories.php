<?php
include 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM categories");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categories);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $code = $_POST['code'];

    $stmt = $pdo->prepare("INSERT INTO categories (name, code) VALUES (:name, :code)");
    if ($stmt->execute(['name' => $name, 'code' => $code])) {
        echo json_encode(['success' => true, 'message' => 'Category added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding category']);
    }
}
?>
