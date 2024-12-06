import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx'; // Import xlsx library for Excel export
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  salesData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSalesData();
  }

  // Function to fetch sales data from the PHP API
  getSalesData(): void {
    this.http.get<any>('http://localhost/backend-db/getSalesAnalytics.php').subscribe(
      (response) => {
        if (response.success && response.data) {
          this.salesData = response.data;
        } else {
          console.error('Error fetching sales data', response.message);
        }
      },
      (error) => {
        console.error('Error fetching sales data', error);
      }
    );
  }

  // Function to filter data for daily, weekly, and monthly reports
  filterData(period: 'daily' | 'weekly' | 'monthly'): any[] {
    const now = new Date();
    let filteredData: any[] = [];

    if (period === 'daily') {
      filteredData = this.salesData.filter((item) => {
        const orderDate = new Date(item.OrderDate);
        return orderDate.toDateString() === now.toDateString(); // Filter for today
      });
    } else if (period === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the current week
      filteredData = this.salesData.filter((item) => {
        const orderDate = new Date(item.OrderDate);
        return orderDate >= startOfWeek; // Filter for current week
      });
    } else if (period === 'monthly') {
      filteredData = this.salesData.filter((item) => {
        const orderDate = new Date(item.OrderDate);
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear(); // Filter for current month
      });
    }

    return filteredData;
  }

  // Function to export sales data to Excel
  exportToExcel(period: 'daily' | 'weekly' | 'monthly'): void {
    const filteredData = this.filterData(period);

    // Check if filteredData is not empty
    if (filteredData.length === 0) {
      alert('No sales data available for the selected period.');
      return; // Stop execution if no data is found
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${period} Sales Report`);
    
    // Save the file
    XLSX.writeFile(workbook, `${period}-sales-report.xlsx`);
  }
}
