import { Component, OnInit } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import * as XLSX from 'xlsx'; // For exporting Excel files
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  goToNextReport(): void {
    if (this.activeTab === 'sales') {
      this.activeTab = 'orders';
    } else if (this.activeTab === 'orders') {
      this.activeTab = 'products';
    }
  }

  // Method to go to the previous report
  goToPreviousReport(): void {
    if (this.activeTab === 'products') {
      this.activeTab = 'orders';
    } else if (this.activeTab === 'orders') {
      this.activeTab = 'sales';
    }
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }
  
  ordersData: any[] = []; // Initialize as an empty array
  salesData: any[] = [];  // Initialize as an empty array
  productsData: any[] = []; // Initialize products data array

  isLoading: boolean = false;
  errorMessage: string = '';
  activeTab: string = 'sales';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.getSalesData();
    this.getProductsData(); // Fetch product data on init
  }

  // Fetch Orders Data from API
  fetchOrders(): void {
    this.isLoading = true;
    this.http.get<any>('http://localhost/backend-db/getOrder.php')
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.ordersData = response.data;
          } else {
            this.errorMessage = response.message || 'Failed to load orders.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while fetching orders.';
          console.error(error);
          this.isLoading = false;
        }
      });
  }

  // Fetch Sales Data from API
  getSalesData(): void {
    this.http.get<any>('http://localhost/backend-db/getSalesAnalytics.php')
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.salesData = response.data;
          } else {
            this.errorMessage = response.message || 'Failed to load sales data.';
            this.salesData = [];
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while fetching sales data.';
          console.error(error);
          this.salesData = [];
        }
      });
  }

  // Fetch Products Data from API
  getProductsData(): void {
    this.http.get<any>('http://localhost/backend-db/read_Products.php')
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.productsData = response.data;
            console.log('Products Data:', this.productsData); // Debug here
          } else {
            this.errorMessage = response.message || 'Failed to load product data.';
            this.productsData = [];
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while fetching product data.';
          console.error(error);
          this.productsData = [];
        }
      });
  }
  
  

  // Export Orders Data to Excel
  exportOrders(): void {
    // Format orders data to flatten the `items` field
    const formattedData = this.ordersData.map(order => ({
      'Order Number': order.orderNumber,
      'Items': order.items.join(', '), // Convert array to a comma-separated string
      'Amount (PHP)': order.amount,
      'Payment Method': order.payment,
      'Date': order.date,
    }));
  
    console.log('Formatted Orders Data:', formattedData); // Debugging
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');
    XLSX.writeFile(workbook, 'orders_report.xlsx');
  }
  

  // Export Sales Data to Excel
  exportSales(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.salesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
    XLSX.writeFile(workbook, 'sales_report.xlsx');
  }

  // Export Products Data to Excel
  exportProducts(): void {
    // Map the products data to match table headers
    const formattedData = this.productsData.map(product => ({
      'Product Name': product.productName,
      'Category': product.categoryName,
      'Price (PHP)': product.price,
      'Status': product.status,
    }));
  
    console.log('Formatted Products Data:', formattedData); // Debugging
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products Report');
    XLSX.writeFile(workbook, 'products_report.xlsx');
  }
  
  
  
}
