import { useState, useEffect } from 'react';
import { 
  productService, 
  customerService, 
  salesService, 
  expenseService,
  promotionService, // Agregar esta línea
  leadService
} from '../services/firebaseService';

export const useFirebaseData = () => {
  const [data, setData] = useState({
    products: [],
    customers: [],
    sales: [],
    expenses: [],
    promotions: [], // Agregar esta línea
    leads: []
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profit: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalPromotions: 0, // Agregar esta línea
    totalLeads: 0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        productsResult, 
        customersResult, 
        salesResult, 
        expensesResult, 
        promotionsResult, // Agregar esta línea
        leadsResult
      ] = await Promise.all([
        productService.getAll(),
        customerService.getAll(),
        salesService.getAll(),
        expenseService.getAll(),
        promotionService.getAll(), // Agregar esta línea
        leadService.getAll()
      ]);

      // Extraer los datos de los resultados
      const products = productsResult.success ? productsResult.data : [];
      const customers = customersResult.success ? customersResult.data : [];
      const sales = salesResult.success ? salesResult.data : [];
      const expenses = expensesResult.success ? expensesResult.data : [];
      const promotions = promotionsResult.success ? promotionsResult.data : []; // Agregar esta línea
      const leads = leadsResult.success ? leadsResult.data : [];

      setData({
        products,
        customers,
        sales,
        expenses,
        promotions, // Agregar esta línea
        leads
      });

      // Calcular estadísticas
      const totalSales = sales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);

      setStats({
        totalSales,
        totalExpenses,
        profit: totalSales - totalExpenses,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalPromotions: promotions.length, // Agregar esta línea
        totalLeads: leads.length
      });

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
  };

  return {
    data,
    loading,
    stats,
    refreshData
  };
};