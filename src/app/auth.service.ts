import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost/backend-db/login.php'; // Backend endpoint

  constructor(private http: HttpClient) {}

  // Login method, sends the login request
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { Username: username, Password: password },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Decrypt the role from the encrypted data returned by the backend
  async decryptRole(encryptedData: any): Promise<string | null> {
    try {
      // Decode the JWT or encrypted response
      const payload = JSON.parse(atob(encryptedData));
      const iv = Uint8Array.from(atob(payload.iv), (c) => c.charCodeAt(0)); // Convert base64 IV to Uint8Array
      const keyMaterial = await this.getKeyMaterial('s3cUr3!kEy@2024#EsHeR^'); // The same key used for encryption
      const key = await this.getCryptoKey(keyMaterial); // Generate CryptoKey from key material

      // Decrypt the data and get the role
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv: iv,
        },
        key,
        Uint8Array.from(atob(payload.data), (c) => c.charCodeAt(0)) // Convert encrypted data to Uint8Array
      );

      return JSON.parse(new TextDecoder().decode(decrypted))['Role'];
    } catch (error) {
      console.error('Error decrypting role:', error);
      return null;
    }
  }

  private async getKeyMaterial(keyString: string): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(keyString), // Convert string to ArrayBuffer
      { name: 'AES-CBC' },
      false,
      ['encrypt', 'decrypt']
    );
  }

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
}
