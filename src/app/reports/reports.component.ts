import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  } }


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
exportSales() {
throw new Error('Method not implemented.');
}

  isLoading: boolean = false;
  ordersData: any;
  errorMessage: any;
  salesData: any;
  productsData: any;
  categoriesData: any[] = [];
  activeTab: string = 'daily';  // Set default active tab to 'daily'
  dailyReport: { date: string; salesAmount: any; numberOfOrders: any; productsSold: any; }[] = [];
  monthlyReport: {
topSellingProduct: any; month: string; totalSales: any; numberOfOrders: any; averageDailySales: number; 
}[] = [];
  salesReport: any;
  ordersReport: any;
  productsReport: any;
  categoryReport: { categoryName: string; productsCount: any; totalSales: any; averageSalesPerProduct: number; }[] = [];
  annualReport: any;

  ngOnInit(): void {
    this.fetchAllData();
  }
  
  fetchAllData(): void {
    this.isLoading = true;
  
    this.getProducts();
    this.getSales();
    this.getOrders();
    this.getCategory();
  
    setTimeout(() => {
      // Check if required data is available before generating reports
      if (this.productsData.length > 0 && this.salesData.length > 0) {
        // Generate the category report
        this.generateCategoryReport(); 
        console.log("Category Report:", this.categoryReport); // Debugging
        
        // Generate the products report
        this.generateProductsReport(); 
        console.log("Products Report:", this.productsReport); // Debugging
        
        // Generate the sales report
        this.generateSalesReport(); 
        console.log("Sales Report:", this.salesReport); // Debugging
      } else {
        this.errorMessage = "Failed to fetch some data required for the reports.";
      }
    
      // End the loading state
      this.isLoading = false; 
    }, 1500);
    
    
  }
  
// Map of reports for navigation
reportOrder = ['daily', 'monthly', 'annual', 'sales', 'orders', 'products', 'category'];

// Method to navigate to the previous report
goToPreviousReport() {
  const currentIndex = this.reportOrder.indexOf(this.activeTab);
  // Navigate to the previous report
  this.activeTab = this.reportOrder[(currentIndex - 1 + this.reportOrder.length) % this.reportOrder.length];
}

// Method to navigate to the next report
goToNextReport() {
  const currentIndex = this.reportOrder.indexOf(this.activeTab);
  // Navigate to the next report
  this.activeTab = this.reportOrder[(currentIndex + 1) % this.reportOrder.length];
}



      constructor(private http: HttpClient) {}

      // Fetch Orders Data from API
      getOrders(): void {
        this.isLoading = true;
        this.http.get<any>('http://localhost/backend-db/getOrder.php')
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.ordersData = response.data;
                this.generateDailyReport(); // Call report generation method
                this.generateMonthlyReport(); // Call report generation method
                this.generateAnnualReport();
                this.generateOrdersReport(); // Call report generation method
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
      getSales(): void {
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
      getProducts(): void {
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

      getCategory(): void {
        this.http.get<any>('http://localhost/backend-db/readCategories.php')
          .subscribe({
            next: (response) => {
              if (response && Array.isArray(response)) {
                this.categoriesData = response;
                console.log('Categories Data:', this.categoriesData); // Debug here
              } else {
                this.errorMessage = 'Failed to load category data.';
                this.categoriesData = [];
              }
            },
            error: (error) => {
              this.errorMessage = 'An error occurred while fetching category data.';
              console.error(error);
              this.categoriesData = [];
            }
          });
      }
      

      // Helper function to group by date or other criteria
groupBy(data: any[], key: string): any {
  return data.reduce((result, currentValue) => {
    // Get the group key
    const groupKey = currentValue[key];
    // If the key does not exist in the result object, create it
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentValue);
    return result;
  }, {});
}

generateDailyReport(): void {
  // Ensure orders have a 'formattedDate' (e.g., '2024-12-15') extracted from the order date
  const ordersWithFormattedDate = this.ordersData.map((order: { date: string | number | Date; }) => {
    const date = new Date(order.date); // Parse the order date
    const formattedDate = date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD' (e.g., '2024-12-15')
    return { ...order, formattedDate }; // Add 'formattedDate' to each order
  });

  // Group orders by formatted date
  const ordersByDate = this.groupBy(ordersWithFormattedDate, 'formattedDate'); // Group by 'formattedDate'

  // Generate the daily report
  this.dailyReport = Object.keys(ordersByDate)
    .sort((a, b) => b.localeCompare(a)) // Sort dates in descending order (latest first)
    .map(date => {
      const orders = ordersByDate[date];

      // Total Sales Amount: Sum the order amounts for the day
      const salesAmount = orders.reduce((sum: number, order: { amount: number }) => sum + order.amount, 0);

      // Count the number of unique products sold
      const productsSold = orders.reduce((productSet: Set<string>, order: { items: any[] }) => {
        order.items.forEach((item: string) => productSet.add(item.split(' x')[0])); // Unique product names
        return productSet;
      }, new Set());

      return {
        date,
        salesAmount, // Return salesAmount as a number
        numberOfOrders: orders.length,
        productsSold: productsSold.size
      };
    });
}



// Monthly Report Calculation
generateMonthlyReport(): void {
  // List of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Ensure the ordersData has a 'month' property
  const ordersWithMonth = this.ordersData.map((order: { date: string | number | Date; }) => {
    const date = new Date(order.date); // Assuming order.date is a valid date string
    const month = date.getMonth(); // getMonth() returns a 0-based month index (0 = January, 11 = December)
    return { ...order, month }; // Add 'month' to each order object
  });

  const ordersByMonth = this.groupBy(ordersWithMonth, 'month'); // Group orders by month

  this.monthlyReport = Object.keys(ordersByMonth).map(monthIndex => {
    const orders = ordersByMonth[monthIndex];
    const totalSales = orders.reduce((sum: number, order: { amount: number }) => sum + order.amount, 0);
    const numberOfOrders = orders.length;
    const averageDailySales = totalSales / 30; // Assuming 30 days in a month

    // To find the top-selling product
    const productsSold = orders.reduce((acc: any, order: { items: any[] }) => {
      order.items.forEach((item: string) => {
        const productName = item.split(' x')[0]; // Extract product name from "ProductName xQuantity"
        acc[productName] = (acc[productName] || 0) + 1; // Count product quantity
      });
      return acc;
    }, {});
    
    // Find the top-selling product by quantity
    const topSellingProduct = Object.keys(productsSold).reduce((a, b) => productsSold[a] > productsSold[b] ? a : b);

    return {
      month: monthNames[parseInt(monthIndex)], // Convert month index to month name
      totalSales,
      numberOfOrders,
      averageDailySales,
      topSellingProduct
    };
  });
}



generateAnnualReport(): void {
  // Ensure the orders have a 'year' extracted from the 'date' field
  const ordersWithYear = this.ordersData.map((order: { date: string | number | Date; }) => {
    const date = new Date(order.date); // Assuming order.date is a valid date string
    const year = date.getFullYear(); // Extract the full year (e.g., 2023, 2024)
    return { ...order, year }; // Add 'year' to each order object
  });

  // Group orders by year
  const ordersByYear = this.groupBy(ordersWithYear, 'year'); // Group by the 'year' property

  this.annualReport = Object.keys(ordersByYear).map(year => {
    const orders = ordersByYear[year];
    
    // Total Revenue: Sum the order amounts for the year
    const totalRevenue = orders.reduce((sum: number, order: { amount: number }) => sum + order.amount, 0);
    
    // Number of Orders: Count of orders for the year
    const numberOfOrders = orders.length;
    
    // Calculate top categories
    const categorySales = this.getCategoriesForOrders(orders);
    const topCategories = Object.entries(categorySales)
      .sort(([, salesA], [, salesB]) => salesB - salesA) // Sort by sales volume descending
      .slice(0, 2) // Get the top 2 categories
      .map(([categoryName]) => categoryName)
      .join(', '); // Join category names with a comma
    
    // Total Products Sold: Count the number of items sold across all orders
    const totalProductsSold = orders.reduce((sum: number, order: { items: any[] }) => sum + order.items.length, 0);
    
    return {
      year, // The 'year' will now be the actual year, like 2023, 2024
      totalRevenue,
      numberOfOrders,
      topCategories,
      totalProductsSold
    };
  });
}


// Helper function to get the categories and their total sales from orders
getCategoriesForOrders(orders: any[]): { [categoryName: string]: number } {
  const categorySales: { [categoryName: string]: number } = {};

  orders.forEach(order => {
    order.items.forEach((item: string) => {
      const productName = item.split(' x')[0]; // Extract product name
      const sale = this.salesData.find((sale: { ProductName: string; }) => sale.ProductName === productName);
      
      if (sale) {
        const category = sale.categoryName;
        const totalAmount = sale.totalSales * sale.totalQuantity; // Calculate the total sales for the product
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }
        categorySales[category] += totalAmount; // Add to the category's total sales
      }
    });
  });

  return categorySales;
}




// Sales Report Calculation
generateSalesReport(): void {
  this.salesReport = this.salesData.map((sale: { 
    orderID: number;   // Ensure this matches the actual field name in salesData
    totalSales: number; 
    totalQuantity: number; 
    OrderDate: string; 
    ProductName: string 
  }) => {
    const totalAmount = sale.totalSales * sale.totalQuantity; // Total amount for this product
    return {
      orderID: sale.orderID,     // Ensure this matches the field name
      date: sale.OrderDate,      // Ensure this matches the field name
      productName: sale.ProductName,
      quantity: sale.totalQuantity,
      totalAmount
    };
  });
  console.log('Sales Report:', this.salesReport); // Debugging
}




// Orders Report Calculation
generateOrdersReport(): void {
  this.ordersReport = this.ordersData.map((order: { items: any[]; amount: number; orderNumber: string; date: string }) => {
    const products = order.items.join(', '); // Join products in the order into a string
    const totalCost = order.amount; // Assuming order.amount includes the total cost
    return {
      orderID: order.orderNumber,
      products: products,
      orderDate: order.date,
      totalCost
    };
  });
}




// Products Report Calculation
generateProductsReport(): void {
  this.productsReport = this.productsData.map((product: { 
    productID: number; 
    productName: string; 
    categoryName: string; 
    stockQuantity: number; 
  }) => {
    // Calculate sales volume by filtering salesData
    const salesVolume = this.salesData
      .filter((sale: { ProductName: string; }) => sale.ProductName === product.productName)
      .reduce((total: number, sale: { totalQuantity: string; }) => total + parseInt(sale.totalQuantity, 10), 0);

    // Map to desired report format
    return {
      productID: product.productID,
      productName: product.productName,
      stockQuantity: product.stockQuantity || 0, // Assuming stockQuantity exists
      salesVolume
    };
  });

  console.log('Products Report:', this.productsReport); // Debugging
}



// Category Report Calculation
generateCategoryReport(): void {
  const categoriesByProduct = this.groupBy(this.productsData, 'categoryName');
  
  this.categoryReport = Object.keys(categoriesByProduct).map(category => {
    const products = categoriesByProduct[category];
    const totalSales = products.reduce((sum: number, product: { productName: string; price: number; }) => {
      const salesVolume = this.salesData.filter((sale: { ProductName: string; }) => sale.ProductName === product.productName)
        .reduce((total: number, sale: { totalQuantity: number; }) => total + sale.totalQuantity, 0);
      return sum + (salesVolume * product.price);
    }, 0);
    const averageSales = products.length > 0 ? totalSales / products.length : 0;

    return {
      categoryName: category,
      productsCount: products.length,
      totalSales,
      averageSalesPerProduct: averageSales
    };
  });
  
  console.log("Category Report:", this.categoryReport); // Debug log
}


  // Export functions (for now, logging to the console)
  exportDaily(): void {
    const doc = new jsPDF();
  
    // Table header
    const header = [['Date', 'Sales Amount', 'Number of Orders', 'Products Sold']];
  
    // Table content
    const content = this.dailyReport.map(report => [
      report.date,
      report.salesAmount.toFixed(2), // Formatting the sales amount
      report.numberOfOrders,
      report.productsSold
    ]);
  
    // Add the table to the PDF document
    autoTable(doc, {
      head: header,
      body: content,
      margin: { top: 20 },
      didDrawPage: function (data) {
        // Footer
        doc.setFontSize(10);
        doc.text('Generated by Report System', 10, doc.internal.pageSize.height - 10);
      }
    });
  
    // Save the document
    doc.save('Daily_Report.pdf');
  }

  // Similar export functions for other reports
  exportMonthly(): void {
    const doc = new jsPDF();
    
    const header = [['Month', 'Total Sales', 'Number of Orders', 'Average Daily Sales', 'Top Selling Product']];
    
    const content = this.monthlyReport.map(report => [
      report.month,
      report.totalSales.toFixed(2),
      report.numberOfOrders,
      report.averageDailySales.toFixed(2),
      report.topSellingProduct
    ]);
  
    autoTable(doc, {
      head: header,
      body: content,
      margin: { top: 20 },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text('Generated by Report System', 10, doc.internal.pageSize.height - 10);
      }
    });
  
    doc.save('Monthly_Report.pdf');
  }
  

  exportAnnual(): void {
    const doc = new jsPDF();
    
    const header = [['Year', 'Total Revenue', 'Number of Orders', 'Top Categories', 'Total Products Sold']];
    
    const content = this.annualReport.map((report: { year: any; totalRevenue: number; numberOfOrders: any; topCategories: any; totalProductsSold: any; }) => [
      report.year,
      report.totalRevenue.toFixed(2),
      report.numberOfOrders,
      report.topCategories,
      report.totalProductsSold
    ]);
  
    autoTable(doc, {
      head: header,
      body: content,
      margin: { top: 20 },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text('Generated by Report System', 10, doc.internal.pageSize.height - 10);
      }
    });
  
    doc.save('Annual_Report.pdf');
  }
  

  exportSalesReport(): void {
    const doc = new jsPDF();
  
    const header = [['Order ID', 'Date', 'Product Name', 'Quantity', 'Total Amount']];
  
    const content = this.salesReport.map((report: { orderID: any; date: any; productName: any; quantity: any; totalAmount: number; }) => [
      report.orderID,
      report.date,
      report.productName,
      report.quantity,
      report.totalAmount.toFixed(2)
    ]);
  
    autoTable(doc, {
      head: header,
      body: content,
      margin: { top: 20 },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text('Generated by Report System', 10, doc.internal.pageSize.height - 10);
      }
    });
  
    doc.save('Sales_Report.pdf');
  }
  

  exportOrders(): void {
    const doc = new jsPDF();
  
    const header = [['Order ID', 'Products', 'Order Date', 'Total Cost']];
  
    const content = this.ordersReport.map((report: { orderID: any; products: any; orderDate: any; totalCost: number; }) => [
      report.orderID,
      report.products,
      report.orderDate,
      report.totalCost.toFixed(2)
    ]);
  
    autoTable(doc, {
      head: header,
      body: content,
      margin: { top: 20 },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text('Generated by Report System', 10, doc.internal.pageSize.height - 10);
      }
    });
  
    doc.save('Orders_Report.pdf');
  }
  

  exportProducts(): void {
    const doc = new jsPDF();
  
    const header = [['Product ID', 'Product Name', 'Stock Quantity', 'Sales Volume']];
  
    const content = this.productsReport.map((report: { productID: any; productName: any; stockQuantity: any; salesVolume: any; }) => [
      report.productID,
      report.productName,
      report.stockQuantity,
      report.salesVolume
    ]);
  
    autoTable(doc, {
      head: header,
      body: content,
      margin: { top: 20 },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text('Generated by Report System', 10, doc.internal.pageSize.height - 10);
      }
    });
  
    doc.save('Products_Report.pdf');
  }
  
  exportCategory(): void {
    const doc = new jsPDF();
  
    const header = [['Category Name', 'Products Count', 'Total Sales', 'Average Sales Per Product']];
  
    const content = this.categoryReport.map(report => [
      report.categoryName,
      report.productsCount,
      report.totalSales.toFixed(2),
      report.averageSalesPerProduct.toFixed(2)
    ]);
  
    autoTable(doc, {
      head: header,
      body: content,
      margin: { top: 20 },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text('Generated by Report System', 10, doc.internal.pageSize.height - 10);
      }
    });
  
    doc.save('Category_Report.pdf');
  }

  
}
  

  
  

