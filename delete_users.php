<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");  // Allow DELETE method for deletion
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once 'Database.php';
include_once 'users.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$user = new Users($db);
$response = array();

// Check if 'id' is passed in the URL (GET method)
if (isset($_GET['id'])) {
    $category->categoryID = $_GET['id'];

    // Attempt to delete the user
    if ($user->delete()) {
        $response["success"] = true;
        $response["message"] = "User deleted successfully.";
        http_response_code(200);
    } else {
        $response["success"] = false;
        $response["message"] = "Unable to delete user.";
        http_response_code(503);  // Service unavailable
    }
} else {
    // User ID missing in the request
    $response["success"] = false;
    $response["message"] = "User ID is missing.";
    http_response_code(400);  // Bad request
}

// Return response as JSON
echo json_encode($response);