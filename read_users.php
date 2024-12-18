<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once 'Database.php';
include_once 'users.php';

$response = ["success" => false, "data" => []];

$database = new Database();
$db = $database->getConnection();

if ($db) {
    $user = new Users($db);

    // Modify the query to include status from Product.php's read method
    $stmt = $user->read();

    if ($stmt) {
        $num = $stmt->rowCount();
        if ($num > 0) {
            $users_arr = [];

            // Assuming you are fetching rows from the result set
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $user_item = [
                    "UserID" => $row['UserID'],           // Use proper column names
                    "Username" => $row['Username'],
                    "Password" => $row['Password'],
                    "Role" => $row['Role'],
                ];

                $users_arr[] = $user_item;
            }

            // Return success and data if users found
            $response['success'] = true;
            $response['data'] = $users_arr;
        } else {
            // Handle case when no users are found
            $response['message'] = "No users found.";
        }
    } else {
        // Handle case when the query execution fails
        $response['message'] = "Failed to execute query to fetch users.";
    }
} else {
    // Handle case when database connection fails
    $response['message'] = "Failed to connect to the database.";
}

// Output the response as JSON
echo json_encode($response);
?>
