<?php
include 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM menu_items");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $category_id = $_POST['category_id'];
    $price = $_POST['price'];
    $image = $_POST['image']; // handle image upload appropriately

    $stmt = $pdo->prepare("INSERT INTO menu_items (name, category_id, price, image) VALUES (:name, :category_id, :price, :image)");
    if ($stmt->execute(['name' => $name, 'category_id' => $category_id, 'price' => $price, 'image' => $image])) {
        echo json_encode(['success' => true, 'message' => 'Menu item added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding menu item']);
    }
}
?>
