<?php
class Users {
    private $conn;
    private $table_name = "users";

    public $UserID;
    public $Username;
    public $Password;
    public $Role;
    public function __construct($db) {
        $this->conn = $db;
    }


    // Read users
    public function read() {
        try {
            $query = "SELECT UserID, Username, FROM " . $this->table_name . " ORDER BY Userame";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            error_log("Read users error: " . $e->getMessage());
            return false;
        }
    }

    // Update a user
    public function update() {
        try {
            if (empty($this->UserID) || empty($this->Username) || empty($this->categoryMain)) {
                throw new Exception("UserID, Username, Password, and Role are required");
            }

            $query = "UPDATE " . $this->table_name . " 
                     SET Username = :Username, Password, Role, = :Role
                     WHERE UserID = :UserID";

            $stmt = $this->conn->prepare($query);

            // Clean inputs
            $this->Username = htmlspecialchars(strip_tags($this->Username));
            $this->Role = htmlspecialchars(strip_tags($this->Role));
            $this->UserID = htmlspecialchars(strip_tags($this->UserID));
            $this->Password = htmlspecialchars(strip_tags($this->Password));


            // Bind values
            $stmt->bindParam(':Username', $this->Username);
            $stmt->bindParam(':Role', $this->Role);
            $stmt->bindParam(':UserID', $this->UserID);
            $stmt->bindParam(':Password', $this->Password);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Update user error: " . $e->getMessage());
            return false;
        } catch (Exception $e) {
            error_log("Update user error: " . $e->getMessage());
            return false;
        }
    }

    // Delete a category
    public function delete() {
        try {
            if (empty($this->UserID)) {
                throw new Exception("User ID is required");
            }

            $query = "DELETE FROM " . $this->table_name . " WHERE UserID = :UserID";
            $stmt = $this->conn->prepare($query);

            // Clean categoryID input
            $this->UserID = htmlspecialchars(strip_tags($this->UserID));

            // Bind value
            $stmt->bindParam(':UserID', $this->UserID);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Delete User error: " . $e->getMessage());
            return false;
        } catch (Exception $e) {
            error_log("Delete User error: " . $e->getMessage());
            return false;
        }
    }
}
?>
