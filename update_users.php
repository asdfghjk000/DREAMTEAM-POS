<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
$data = json_decode(file_get_contents("php://input"));

$response = array();


if (!empty($data->UserID) && !empty($data->Username) && !empty($data->Password) && !empty($data->Role)) {


    // Set category properties
    $user->UserID = $data->UserID;
    $user->Username = $data->Username;
    $user->Password = $data->Password;
    $user->Role = $data->Role; // Set the  value

    // Try to update the category
    if ($user->update()) {
        $response["success"] = true;
        $response["message"] = "User updated successfully.";
        http_response_code(200);
    } else {
        $response["success"] = false;
        $response["message"] = "Unable to update user.";
        http_response_code(503);
    }
} else {
    $response["success"] = false;
    $response["message"] = "UserID, name, password or role is missing.";
    http_response_code(400);
}

echo json_encode($response);
?>
