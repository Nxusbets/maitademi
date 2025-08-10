import { useState, useEffect } from 'react';
import { 
  productService, 
  customerService, 
  salesService, 
  expenseService,
  promotionService,
  leadService
} from '../services/firebaseService';
import { creationService } from '../services/creationService'; // <-- Importa el servicio

export const useFirebaseData = () => {
  const [data, setData] = useState({
    products: [],
    customers: [],
    sales: [],
    expenses: [],
    promotions: [],
    leads: [],
    creations: [] // <-- Agrega creaciones
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
        promotionsResult,
        leadsResult,
        creationsResult // <-- Agrega creaciones
      ] = await Promise.all([
        productService.getAll(),
        customerService.getAll(),
        salesService.getAll(),
        expenseService.getAll(),
        promotionService.getAll(),
        leadService.getAll(),
        creationService.getAll() // <-- Llama a getAll
      ]);

      // Extraer los datos de los resultados
      const products = productsResult.success ? productsResult.data : [];
      const customers = customersResult.success ? customersResult.data : [];
      const sales = salesResult.success ? salesResult.data : [];
      const expenses = expensesResult.success ? expensesResult.data : [];
      const promotions = promotionsResult.success ? promotionsResult.data : []; // Agregar esta línea
      const leads = leadsResult.success ? leadsResult.data : [];
      const creations = creationsResult && creationsResult.success ? creationsResult.data : []; // <-- Extrae creaciones

      setData({
        products,
        customers,
        sales,
        expenses,
        promotions, // Agregar esta línea
        leads,
        creations // <-- Guarda creaciones
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