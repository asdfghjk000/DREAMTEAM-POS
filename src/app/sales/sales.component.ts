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
  OrderDate: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  salesData: SalesData[] = [];
  overallTotalSales: number = 0;
  overallTotalQuantity: number = 0;
  dailySales: number = 0;
  weeklySales: number = 0;
  weeklyPeriod: string = '';
  top5Products: { ProductName: string; totalQuantity: number }[] = [];
  top5Categories: { categoryName: string; totalQuantity: number }[] = [];
  totalFoodQuantity: number = 0;
  totalDrinkQuantity: number = 0;
  weeklySalesByDay: { day: string; date: string; totalSales: number }[] = [];
  monthlySales: {
    monthIndex: any;year: any; month: string; totalSales: number 
}[] = [];
  totalMonthlySales: number = 0;
  selectedMonth: number | null = null;
  totalSalesForMonth: number = 0; 
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
          this.calculateCategoryTotals();
          this.calculateWeeklySales();
          this.calculateMonthlySales();
        }
      },
      (error) => {
        console.error('Error fetching sales data:', error);
      }
    );
  }

  calculateTotals(): void {
    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const todaySalesData = this.salesData.filter((product) =>
      product.OrderDate.startsWith(todayDate)
    );
  
    this.overallTotalSales = todaySalesData.reduce(
      (total, product) => total + parseFloat(product.totalSales),
      0
    );
    this.overallTotalQuantity = todaySalesData.reduce(
      (total, product) => total + parseInt(product.totalQuantity, 10),
      0
    );
  }
  
  calculateCategoryTotals(): void {
    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const todaySalesData = this.salesData.filter((product) =>
      product.OrderDate.startsWith(todayDate)
    );
  
    this.totalFoodQuantity = todaySalesData
      .filter((product) => product.categoryMain === 'Food')
      .reduce((total, product) => total + parseInt(product.totalQuantity, 10), 0);
  
    this.totalDrinkQuantity = todaySalesData
      .filter((product) => product.categoryMain === 'Drink')
      .reduce((total, product) => total + parseInt(product.totalQuantity, 10), 0);
  }
  

  getTop5Products(): void {
    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
    this.top5Products = [...this.salesData]
      .filter((product) => product.OrderDate.startsWith(todayDate)) // Filter for today's sales
      .sort((a, b) => parseInt(b.totalQuantity, 10) - parseInt(a.totalQuantity, 10))
      .slice(0, 5)
      .map((product) => ({
        ProductName: product.ProductName,
        totalQuantity: parseInt(product.totalQuantity, 10),
      }));
  }
  
  getTop5Categories(): void {
    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const categoryTotals: { [key: string]: number } = {};
  
    // Filter today's sales and aggregate quantities by category
    this.salesData
      .filter((product) => product.OrderDate.startsWith(todayDate))
      .forEach((product) => {
        const category = product.categoryName;
        const quantity = parseInt(product.totalQuantity, 10);
  
        if (categoryTotals[category]) {
          categoryTotals[category] += quantity;
        } else {
          categoryTotals[category] = quantity;
        }
      });
  
    // Convert to array, sort, and get the top 5
    this.top5Categories = Object.keys(categoryTotals)
      .map((category) => ({
        categoryName: category,
        totalQuantity: categoryTotals[category],
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);
  }
  

  calculateWeeklySales(): void {
    const today = new Date();
    
    // Determine the start of the week (Sunday) and the end of the week (Saturday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Set the date to Sunday (start of the week)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set the date to Saturday (end of the week)
  
    // Days of the week array for labeling
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Initialize daily sales for the week
    const dailySales: { [key: string]: { day: string; date: string; totalSales: number } } = {};
  
    // Initialize the sales object for all days of the week with total sales set to 0
    for (let i = 0; i <= 6; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i); // Increment each day
      const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      dailySales[formattedDate] = { day: daysOfWeek[i], date: formattedDate, totalSales: 0 };
    }
  
    // Accumulate sales data for each day of the week
    this.salesData.forEach((product) => {
      const orderDate = product.OrderDate.split(' ')[0]; // Extract date in YYYY-MM-DD format
      if (dailySales[orderDate]) {
        dailySales[orderDate].totalSales += parseFloat(product.totalSales); // Add the sales to the corresponding day
      }
    });
  
    // Prepare the weekly sales breakdown by day
    this.weeklySalesByDay = Object.values(dailySales);
    
    // Calculate the total weekly sales
    this.weeklySales = this.weeklySalesByDay.reduce((total, day) => total + day.totalSales, 0);
  
    // Format the weekly period range (e.g., "2024-12-01 - 2024-12-07")
    this.weeklyPeriod = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
  }
  
  // Helper method to format date as YYYY-MM-DD
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  calculateMonthlySales(): void {
    // Array of month names
    const monthNames: string[] = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Get the current year
    const currentYear = new Date().getFullYear();
  
    // Initialize an object to store sales by month and year
    const monthlySales: { [key: string]: number } = {};
  
    // Loop through the salesData array and aggregate sales by month and year
    this.salesData.forEach((product) => {
      const orderDate = new Date(product.OrderDate);
      const monthYear = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`; // Format as "YYYY-MM"
      
      // Only consider sales data for the current year
      if (orderDate.getFullYear() === currentYear) {
        if (monthlySales[monthYear]) {
          monthlySales[monthYear] += parseFloat(product.totalSales); // Sum sales for this month and year
        } else {
          monthlySales[monthYear] = parseFloat(product.totalSales);
        }
      }
    });
  
    // Define the type for monthly sales that includes monthIndex
    interface MonthlySale {
      month: string;
      year: string;
      totalSales: number;
      monthIndex: number; // Adding the monthIndex property
    }
  
    // Now assign the calculated monthly sales data with correct type
    this.monthlySales = Object.keys(monthlySales).map((monthYear): MonthlySale => {
      const [year, month] = monthYear.split('-');
      const monthName = monthNames[parseInt(month) - 1]; // Convert numeric month to month name
      return {
        month: monthName, // Use the month name
        year: year,       // Include the year for clarity
        totalSales: monthlySales[monthYear],
        monthIndex: parseInt(month) - 1 // Store the month index (0 for January, 11 for December)
      };
    });
  
    // Sort the monthlySales array by year and monthIndex (descending order, latest first)
    this.monthlySales.sort((a, b) => {
      const yearComparison = parseInt(b.year) - parseInt(a.year); // Compare years in descending order
      if (yearComparison !== 0) return yearComparison;
      return b.monthIndex - a.monthIndex; // Compare months in descending order if years are the same
    });
  
    // Set the total sales for all months in the current year
    this.totalMonthlySales = this.monthlySales.reduce(
      (total, month) => total + month.totalSales,
      0
    );
  }  
  

}

