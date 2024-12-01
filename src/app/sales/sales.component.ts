import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface SalesData {
    totalSales: string;
    totalOrders: number;
    PaymentMethod: string;
    ProductName: string;
    totalQuantity: string;
    categoryName: string;
    categoryMain: string; // Added to handle "Food" or "Drink"
  }
  

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})


export class SalesComponent implements OnInit {
    salesData: SalesData[] = [];
    overallTotalSales: number = 0;
    overallTotalQuantity: number = 0;
    top5Products: { ProductName: string; totalQuantity: number }[] = [];
    top5Categories: { categoryName: string; totalQuantity: number }[] = [];
    totalFoodQuantity: number = 0; // Total quantity sold for "Food"
    totalDrinkQuantity: number = 0; // Total quantity sold for "Drink"
    apiUrl = 'http://localhost/backend-db/getSalesAnalytics.php';
  
    constructor(private http: HttpClient) {}
  
    ngOnInit(): void {
      this.http.get<any>(this.apiUrl).subscribe(
        (response) => {
          if (response.success) {
            this.salesData = response.data;
            this.calculateTotals();
            this.getTop5Products();
            this.getTop5Categories();
            this.calculateCategoryTotals(); // Calculate "Food" and "Drink" totals
          }
        },
        (error) => {
          console.error('Error fetching sales data:', error);
        }
      );
    }
  
    calculateTotals(): void {
      this.overallTotalSales = this.salesData.reduce(
        (total, product) => total + parseFloat(product.totalSales),
        0
      );
      this.overallTotalQuantity = this.salesData.reduce(
        (total, product) => total + parseInt(product.totalQuantity, 10),
        0
      );
    }
  
    getTop5Products(): void {
      this.top5Products = [...this.salesData]
        .sort((a, b) => parseInt(b.totalQuantity, 10) - parseInt(a.totalQuantity, 10))
        .slice(0, 5)
        .map((product) => ({
          ProductName: product.ProductName,
          totalQuantity: parseInt(product.totalQuantity, 10),
        }));
    }
  
    getTop5Categories(): void {
      const categoryTotals: { [key: string]: number } = {};
  
      this.salesData.forEach((product) => {
        const category = product.categoryName;
        const quantity = parseInt(product.totalQuantity, 10);
  
        if (categoryTotals[category]) {
          categoryTotals[category] += quantity;
        } else {
          categoryTotals[category] = quantity;
        }
      });
  
      this.top5Categories = Object.keys(categoryTotals)
        .map((category) => ({
          categoryName: category,
          totalQuantity: categoryTotals[category],
        }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5);
    }
  
    calculateCategoryTotals(): void {
      this.totalFoodQuantity = this.salesData
        .filter((product) => product.categoryMain === 'Food')
        .reduce((total, product) => total + parseInt(product.totalQuantity, 10), 0);
  
      this.totalDrinkQuantity = this.salesData
        .filter((product) => product.categoryMain === 'Drink')
        .reduce((total, product) => total + parseInt(product.totalQuantity, 10), 0);
    }
  }
  