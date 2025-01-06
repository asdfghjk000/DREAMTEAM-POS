import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Define the response structure for fetching users
interface User {
  Username: string;
  Password: string;
  Role: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  originalUsername: string | null = null;
  showConfirmDialog: boolean = false;
  userToDelete: string | null = null; // Store the username to delete
  successMessage: string | null = null; // Success message to be displayed

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    // Fetch users
    this.fetchUsers();
  
    // Retrieve success message from local storage
    this.successMessage = localStorage.getItem('successMessage');
    
    // Ensure we are clearing the success message after 3 seconds
    if (this.successMessage) {
      console.log("Success Message Found:", this.successMessage); // Debugging line
      setTimeout(() => {
        this.successMessage = null; // Clear message
        localStorage.removeItem('successMessage'); // Remove from local storage
        console.log("Success Message Cleared"); // Debugging line
      }, 3000); // Hide message after 3 seconds
    }
  }
  

  // Fetch users from the backend
  fetchUsers(): void {
    this.http.get<{ success: boolean; users: User[] }>('http://localhost/backend-db/manageUsers.php').subscribe(
      (response) => {
        if (response.success) {
          this.users = response.users;
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // Select a user for editing
  editUser(user: User): void {
    this.originalUsername = user.Username; // Store the original username
    this.selectedUser = { ...user }; // Create a copy to edit
  }

  // Cancel the edit action
  cancelEdit(): void {
    this.selectedUser = null;
    this.originalUsername = null;
  }

  // Update a user in the backend
  updateUser(): void {
    if (this.selectedUser && this.originalUsername) {
      const payload = {
        action: 'edit',
        originalUsername: this.originalUsername,
        updatedUser: this.selectedUser
      };

      this.http.post<{ success: boolean; message: string }>('http://localhost/backend-db/manageUsers.php', payload).subscribe(
        (response) => {
          if (response.success) {
            this.fetchUsers(); // Refresh the user list
            this.cancelEdit();
            this.successMessage = 'User updated successfully!';
            // Store success message in local storage
            localStorage.setItem('successMessage', this.successMessage);
          } else {
            alert('Error updating user: ' + response.message);
          }
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  // Prepare to delete a user and show the confirmation modal
  prepareDeleteUser(username: string): void {
    this.userToDelete = username;
    this.showConfirmDialog = true; // Show the modal
  }

  // Confirm deletion of the user
  confirmDeleteUsers(): void {
    if (this.userToDelete) {
      const payload = { action: 'delete', Username: this.userToDelete };

      this.http.post<{ success: boolean; message: string }>('http://localhost/backend-db/manageUsers.php', payload).subscribe(
        (response) => {
          if (response.success) {
            alert('User deleted successfully!');
            this.fetchUsers(); // Refresh the user list
            this.showConfirmDialog = false; // Hide the modal
            this.successMessage = 'User deleted successfully!';
            // Store success message in local storage
            localStorage.setItem('successMessage', this.successMessage);
          } else {
            alert('Error deleting user: ' + response.message);
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  // Cancel the deletion and hide the modal
  cancelDeleteUsers(): void {
    this.showConfirmDialog = false; // Hide the modal
    this.userToDelete = null; // Clear the user to delete
  }
}
