<?php
// Include the database connection file
include_once 'database.php';

// Set headers for CORS and allowed methods
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Define Encryption Key
define('ENCRYPTION_KEY', 'jD3vA1PqXyZ8KbRtF5mN6wL4GoVcHsQ2YxWpUz7BnTfOgEkR');

// Function to encrypt data before sending it
function encryptForTransmission($data) {
    $iv = openssl_random_pseudo_bytes(16);
    $encrypted = openssl_encrypt(
        json_encode($data),
        'AES-256-CBC',
        ENCRYPTION_KEY,
        OPENSSL_RAW_DATA,
        $iv
    );

    $combined = $iv . $encrypted;
    return base64_encode($combined);
}

function decryptData($encryptedData) {
    $decoded = base64_decode($encryptedData);
    $iv = substr($decoded, 0, 16);
    $encrypted = substr($decoded, 16);

    return openssl_decrypt(
        $encrypted,
        'AES-256-CBC',
        ENCRYPTION_KEY,
        OPENSSL_RAW_DATA,
        $iv
    );
}

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->Username) && !empty($data->Password)) {
    $username = htmlspecialchars(strip_tags($data->Username));
    $encryptedPassword = $data->Password;

    $password = decryptData($encryptedPassword);

    $checkQuery = "SELECT Username, Password, Role FROM users WHERE Username = :username LIMIT 1";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":username", $username);
    $checkStmt->execute();

    if ($checkStmt->rowCount() == 0) {
        if ($username === 'eshercafeadmin' || $username === 'eshercafestaff') {
            $role = ($username === 'eshercafeadmin') ? 'admin' : 'staff';
            $predefinedPassword = ($username === 'eshercafeadmin') ? 'adminpos24' : 'kioskstaff2024';

            $insertQuery = "INSERT INTO users (Username, Password, Role) VALUES (:username, :password, :role)";
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->bindParam(":username", $username);
            $insertStmt->bindParam(":password", $predefinedPassword);
            $insertStmt->bindParam(":role", $role);

            if ($insertStmt->execute()) {
                $response = [
                    "success" => true,
                    "message" => "User  created successfully.",
                    "user" => ["Role" => $role]
                ];
                echo json_encode(["data" => encryptForTransmission($response)]);
                return;
            } else {
                $response = [
                    "success" => false,
                    "message" => "Error creating user."
                ];
                echo json_encode(["data" => encryptForTransmission($response)]);
                return;
            }
        }
    }

    $user = $checkStmt->fetch(PDO::FETCH_ASSOC);
    if ($user && $password === $user['Password']) {
        $response = [
            "success" => true,
            "message" => "Login successful.",
            "user" => ["Role" => $user['Role']]
        ];

        echo json_encode(["data" => encryptForTransmission($response)]);
    } else {
        $response = [
            "success" => false,
            "message" => "Username or password is incorrect."
        ];

        echo json_encode(["data" => encryptForTransmission($response)]);
    }
} else {
    $response = [
        "success" => false,
        "message" => "Username and password are required."
    ];

    echo json_encode(["data" => encryptForTransmission($response)]);
}
?>