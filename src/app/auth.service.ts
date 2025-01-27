import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost/backend-db/login.php'; // Backend endpoint

  constructor(private http: HttpClient) {}

   // Method to handle login
login(username: string, password: string): Observable<any> {
  // Send the password along with the username (no hashing)
  return this.http.post(
    this.apiUrl,
    { Username: username, Password: password }, // Sending the plain text password
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

  // Method to decrypt role from the backend response (assuming AES-CBC encryption)
  async decryptRole(encryptedData: any): Promise<string | null> {
    try {
      // Decode the JWT or encrypted response (assuming it's base64)
      const payload = JSON.parse(atob(encryptedData)); // Decode base64 to string and parse to JSON

      // Convert base64 IV to Uint8Array
      const iv = Uint8Array.from(atob(payload.iv), (c) => c.charCodeAt(0));

      // Get key material from the encryption key (ensure the key length is 256-bit)
      const keyMaterial = await this.getKeyMaterial('s3cUr3!kEy@2024#EsHeR^'); // Ensure this is the same key used for encryption
      const key = await this.getCryptoKey(keyMaterial); // Generate CryptoKey from key material

      // Decrypt the data
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv: iv,
        },
        key,
        Uint8Array.from(atob(payload.data), (c) => c.charCodeAt(0)) // Convert encrypted data to Uint8Array
      );

      // Return the decrypted role
      const decryptedPayload = JSON.parse(new TextDecoder().decode(decrypted));
      return decryptedPayload['Role'];
    } catch (error) {
      console.error('Error decrypting role:', error);
      return null;
    }
  }

  // Utility function to generate key material from a string (hashed to ensure correct length)
  private async getKeyMaterial(keyString: string): Promise<CryptoKey> {
    // Hash the key to ensure it is 256-bit (32 bytes)
    const hashedKey = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(keyString));
    
    // Import the hashed key as the AES key material
    return window.crypto.subtle.importKey(
      'raw',
      hashedKey, // Use the hashed key (256 bits)
      { name: 'AES-CBC' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Method to get the actual CryptoKey from the key material
  private async getCryptoKey(keyMaterial: CryptoKey): Promise<CryptoKey> {
    return keyMaterial;
  }

  // Role handling methods (for local storage)
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  setRole(role: string): void {
    localStorage.setItem('role', role);
  }

  clearRole(): void {
    localStorage.removeItem('role');
  }

  logout(): void {
    this.clearRole();
  }

  // Store token after successful login
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Clear token from localStorage
  clearToken(): void {
    localStorage.removeItem('authToken');
  }
}
