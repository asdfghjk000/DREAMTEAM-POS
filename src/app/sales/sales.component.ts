import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

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
  TotalSales: number = 0;
  OverallTotalSales: number = 0;
  TotalQuantity: number = 0;
  OverallTotalQuantity: number = 0;
  top5Products: { ProductName: string; totalQuantity: number }[] = [];
  top5Categories: { categoryName: string; totalQuantity: number }[] = [];
  monthlySales: { month: string; totalSales: number }[] = [];
  weeklySalesByDay: { day: string; date: string; totalSales: number }[] = [];

  apiUrl = 'http://localhost/backend-db/getSalesAnalytics.php';

  totalFoodQuantity: any;
  totalDrinkQuantity: any;
  overalltotalFoodQuantity: any;
  overalltotalDrinkQuantity: any;
CategoryTotalQuantity: any;
  
  
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      (response) => {
        if (response.success) {
          this.salesData = response.data;
          this.calculateTotals();
          this.calculateCategoryTotals(this.salesData);
          this.calculateOverallTotals();  // Call the method to calculate the totals
          this.calculateOverallCategoryTotals();
          this.getTop5Products();
          this.getTop5Categories();
          this.calculateWeeklySales();
          this.calculateMonthlySales();
          this.renderCharts();
        }
      },
      (error) => {
        console.error('Error fetching sales data:', error);
      }
    );
  }


// Calculate Total Sales and Total Quantity from all products sold today
calculateTotals(): void {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format

  // Filter sales data to include only today's entries
  const todaySalesData = this.salesData.filter(product => 
    product.OrderDate.startsWith(today) // Filter for today's date
  );

  // Debugging log
  console.log('All Sales Data Today:', todaySalesData);

  // Calculate today's total sales (sum of totalSales from all products sold today)
  this.TotalSales = todaySalesData.reduce(
    (total, product) => total + parseFloat(product.totalSales),
    0
  );

  console.log('Total Sales Today:', this.TotalSales);

  // Call calculateCategoryTotals and pass the filtered todaySalesData
  this.calculateCategoryTotals(todaySalesData); // Pass the todaySalesData here
}



calculateCategoryTotals(todaySalesData: any[]): void {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format

  // Calculate total Food quantity for today
  this.totalFoodQuantity = todaySalesData
    .filter(
      (product) =>
        product.categoryMain === 'Food' && product.OrderDate.startsWith(today)
    )
    .reduce((total, product) => total + parseInt(product.totalQuantity, 10), 0);

  // Calculate total Drink quantity for today
  this.totalDrinkQuantity = todaySalesData
    .filter(
      (product) =>
        product.categoryMain === 'Drink' && product.OrderDate.startsWith(today)
    )
    .reduce((total, product) => total + parseInt(product.totalQuantity, 10), 0);

  // Sum of Food and Drink quantities to update CategoryTotalQuantity
  this.CategoryTotalQuantity = this.totalFoodQuantity + this.totalDrinkQuantity;

  // Debugging logs to check category-wise and total quantities
  console.log('Total Food Quantity:', this.totalFoodQuantity);
  console.log('Total Drink Quantity:', this.totalDrinkQuantity);
  console.log('Category Total Quantity (Food + Drink):', this.CategoryTotalQuantity);
}



  calculateOverallTotals(): void {
    // Calculate overall total sales
    this.OverallTotalSales = this.salesData.reduce(
      (total, product) => total + parseFloat(product.totalSales),
      0
    );
  
    // Calculate overall total quantity sold
    this.OverallTotalQuantity = this.salesData.reduce(
      (total, product) => total + parseInt(product.totalQuantity, 10),
      0
    );
  }

  calculateOverallCategoryTotals(): void {
    // Calculate overall total quantity for Food category
    this.overalltotalFoodQuantity = this.salesData
      .filter((product) => product.categoryMain === 'Food')
      .reduce((total, product) => total + parseInt(product.totalQuantity, 10), 0);
  
    // Calculate overall total quantity for Drink category
    this.overalltotalDrinkQuantity = this.salesData
      .filter((product) => product.categoryMain === 'Drink')
      .reduce((total, product) => total + parseInt(product.totalQuantity, 10), 0);
  
  }
  

  getTop5Products(): void {
    // Step 1: Aggregate total quantities for each product
    const productTotals: { [key: string]: number } = {};
  
    this.salesData.forEach((product) => {
      const productName = product.ProductName;
      const quantity = parseInt(product.totalQuantity, 10);
  
      if (productTotals[productName]) {
        productTotals[productName] += quantity;
      } else {
        productTotals[productName] = quantity;
      }
    });
  
    // Step 2: Create an array of products with their total quantities
    const aggregatedProducts = Object.keys(productTotals)
      .map((productName) => ({
        ProductName: productName,
        totalQuantity: productTotals[productName],
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity) // Sort by total quantity in descending order
      .slice(0, 5); // Take the top 5 products
  
    this.top5Products = aggregatedProducts;
  
    // Step 3: Calculate the overall total quantity of the top 5 products
    this.TotalQuantity = aggregatedProducts.reduce(
      (sum, product) => sum + product.totalQuantity,
      0
    );
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

  calculateWeeklySales(): void {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  
    const dailySales: { [key: string]: number } = {};
    this.salesData.forEach((product) => {
      const orderDate = product.OrderDate.split(' ')[0];
      dailySales[orderDate] = (dailySales[orderDate] || 0) + parseFloat(product.totalSales);
    });
  
    this.weeklySalesByDay = [];
    for (let day = startOfWeek; day <= endOfWeek; day.setDate(day.getDate() + 1)) {
      const date = day.toISOString().split('T')[0];
      this.weeklySalesByDay.push({
        day: day.toLocaleDateString('en-US', { weekday: 'long' }),
        date: date,
        totalSales: dailySales[date] || 0,
      });
    }
  }
  

  calculateMonthlySales(): void {
  const monthlyTotals: { [key: string]: number } = {};
  this.salesData.forEach((product) => {
    const orderDate = new Date(product.OrderDate);
    const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + parseFloat(product.totalSales);
  });

  const sortedKeys = Object.keys(monthlyTotals).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const latest5Months = sortedKeys.slice(0, 5);

  this.monthlySales = latest5Months.map((key) => {
    const [year, month] = key.split('-');
    return {
      month: `${month.padStart(2, '0')}/${year}`,
      totalSales: monthlyTotals[key],
    };
  });

}

  renderCharts(): void {
    this.renderTopProductsDoughnutChart();
    this.renderTopCategoriesBarChart();
    this.renderWeeklySalesLineChart();
    this.renderMonthlySalesBarChart();
    this.renderAOVChart()
  }

  renderTopProductsDoughnutChart(): void {
    const ctx = document.getElementById('topProductsPieChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.top5Products.map((product) => product.ProductName),
        datasets: [
          {
            data: this.top5Products.map((product) => product.totalQuantity),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
            hoverOffset: 10,
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  }

  renderTopCategoriesBarChart(): void {
    const ctx = document.getElementById('topCategoriesPieChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.top5Categories.map((category) => category.categoryName),
        datasets: [
          {
            label: 'Top Categories',
            data: this.top5Categories.map((category) => category.totalQuantity),
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  renderWeeklySalesLineChart(): void {
    const ctx = document.getElementById('weeklySalesBarChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.weeklySalesByDay.map((day) => day.day),
        datasets: [
          {
            label: 'Current Week',
            data: this.weeklySalesByDay.map((day) => day.totalSales),
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  renderMonthlySalesBarChart(): void {
    const ctx = document.getElementById('monthlySalesBarChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.monthlySales.map((sale) => sale.month),
        datasets: [
          {
            label: 'Monthly Sales',
            data: this.monthlySales.map((sale) => sale.totalSales),
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  renderAOVChart(): void {
    const latestSalesData = this.salesData
      .sort((a, b) => new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime())
      .slice(0, 25);
  
    const ctx = document.getElementById('aovLineChart') as HTMLCanvasElement;
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: latestSalesData.map(data => data.OrderDate.split(' ')[0]),
        datasets: [
          {
            label: 'Average Order Value (Latest 25 Days)',
            data: latestSalesData.map(
              data => parseFloat(data.totalSales) / parseInt(data.totalQuantity, 10)
            ),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }  
  
}
