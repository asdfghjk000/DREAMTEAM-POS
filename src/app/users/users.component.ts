import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  userId: number;
  username: string;
  role: string;
  isEditing?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {

  closeModal(){
    this.editingUser = null;
  }

  openEditForm(user: User): void {
    this.editingUser = {...user};
  }

  cancelEditForm(): void {
    this.editingUser = null;
  }
  
  users: User[] = [];
  filteredUsers: User[] = [];
  searchText: string = '';
  apiUrl: string = 'http://localhost/backend-db/';
  errorMessage: string = '';
  isLoading: boolean = false;
  editingUser: User | null = null;
  userToDelete: number | undefined;
  showConfirmDialog: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.readUsers();
  }

  readUsers(): void {
    this.isLoading = true;
    this.http.get<User[]>(`${this.apiUrl}read_users.php`).subscribe({
      next: (data) => {
        console.log('Users received:', data);
        this.users = data.map((user) => ({
          ...user,
          isEditing: false,
        }));
        this.filterUsers();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error reading users:', error);
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      },
    });
  }

  onSearchChange(): void {
    this.filterUsers();
  }

  filterUsers(): void {
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTextLower) ||
        user.role.toLowerCase().includes(searchTextLower)
    );
  }

  enableEditMode(user: User): void {
    user.isEditing = true;
  }

  cancelEditMode(user: User): void {
    user.isEditing = false;
  }

  updateUser(user: User): void {
    if (!this.editingUser) return;

    this.isLoading = true;
    const postData = {
      userId: this.editingUser.userId,
      username: this.editingUser.username,
      role: this.editingUser.role,
    };

    this.http.post<ApiResponse>(`${this.apiUrl}update_user.php`, postData).subscribe({
      next: (response) => {
        console.log('User updated:', response);
        if (response.success) {
          this.readUsers();
          this.editingUser = null;
        } else {
          this.errorMessage = response.message || 'Failed to update user';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = 'Failed to update user';
        this.isLoading = false;
      },
    });
  }

  deleteUser(userId: number): void {
    if (!userId) {
      this.errorMessage = 'User ID is missing.';
      return;
    }

    this.userToDelete = userId; // Store the user ID for confirmation
    this.showConfirmDialog = true; // Show the confirmation dialog
  }

  confirmDeleteUser(): void {
    if (!this.userToDelete) return;

    this.isLoading = true;

    this.http
      .get<ApiResponse>(`${this.apiUrl}delete_user.php?id=${this.userToDelete}`)
      .subscribe({
        next: (response) => {
          console.log('User deleted:', response);
          if (response.success) {
            this.readUsers(); // Reload users after deletion
          } else {
            this.errorMessage = response.message || 'Failed to delete user';
          }
          this.isLoading = false;
          this.showConfirmDialog = false; // Hide the confirmation dialog
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Failed to delete user';
          this.isLoading = false;
          this.showConfirmDialog = false; // Hide the confirmation dialog
        },
      });
  }

  cancelDeleteUser(): void {
    this.showConfirmDialog = false; // Hide the confirmation dialog if canceled
  }
}