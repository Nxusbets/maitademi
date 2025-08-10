import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Servicio base genérico con operaciones CRUD completas
const createBaseService = (collectionName) => ({
  // Crear nuevo documento
  create: async (data) => {
    try {
      console.log(`Creating ${collectionName} with data:`, data);
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`${collectionName} created with ID:`, docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Obtener todos los documentos
  getAll: async () => {
    try {
      const q = query(
        collection(db, collectionName), 
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items = [];
      
      querySnapshot.forEach((doc) => {
        items.push({ 
          id: doc.id, 
          ...doc.data() 
        });
      });
      
      console.log(`Retrieved ${items.length} ${collectionName}`);
      return { success: true, data: items };
    } catch (error) {
      console.error(`Error getting ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Actualizar documento existente
  update: async (id, data) => {
    try {
      console.log(`Updating ${collectionName} ${id} with data:`, data);
      
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      console.log(`${collectionName} ${id} updated successfully`);
      return { success: true };
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Eliminar documento
  delete: async (id) => {
    try {
      console.log(`Deleting ${collectionName} with ID:`, id);
      
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      console.log(`${collectionName} ${id} deleted successfully`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Obtener documento por ID
  getById: async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { 
          success: true, 
          data: { id: docSnap.id, ...docSnap.data() } 
        };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      console.error(`Error getting ${collectionName} by ID:`, error);
      return { success: false, error: error.message };
    }
  }
});

// Crear servicios específicos para cada colección
export const productService = createBaseService('products');
// export const customerService = createBaseService('customers');
export const salesService = {
  ...createBaseService('sales'),
  async getByFolio(folio) {
    const q = query(collection(db, 'sales'), where('folio', '==', folio));
    const snap = await getDocs(q);
    if (snap.empty) return { success: false };
    const doc = snap.docs[0];
    return { success: true, data: { id: doc.id, ...doc.data() } };
  },
  async getByCustomerId(customerId) {
    try {
      const q = query(
        collection(db, 'sales'),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const purchases = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: purchases };
    } catch (error) {
      console.error('Error getting sales by customerId:', error);
      return { success: false, error: error.message };
    }
  },
  // update ya existe en createBaseService
};
export const expenseService = createBaseService('expenses');
export const promotionService = createBaseService('promotions');
export const leadService = createBaseService('leads');

// Servicio de estadísticas y cálculos
export const statsService = {
  calculateStats: (data) => {
    try {
      const totalSales = data.sales?.reduce((sum, sale) => {
        return sum + (parseFloat(sale.total) || 0);
      }, 0) || 0;

      const totalExpenses = data.expenses?.reduce((sum, expense) => {
        return sum + (parseFloat(expense.amount) || 0);
      }, 0) || 0;

      const profit = totalSales - totalExpenses;
      const totalCustomers = data.customers?.length || 0;
      const totalProducts = data.products?.length || 0;

      // Productos con stock bajo
      const lowStockProducts = data.products?.filter(product => 
        product.stock < 10
      ) || [];

      // Ventas del mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlySales = data.sales?.filter(sale => {
        if (!sale.createdAt) return false;
        const saleDate = sale.createdAt.toDate ? sale.createdAt.toDate() : new Date(sale.createdAt);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      }) || [];

      const monthlyRevenue = monthlySales.reduce((sum, sale) => {
        return sum + (parseFloat(sale.total) || 0);
      }, 0);

      return {
        totalSales,
        totalExpenses,
        profit,
        totalCustomers,
        totalProducts,
        lowStockProducts: lowStockProducts.length,
        monthlySales: monthlySales.length,
        monthlyRevenue
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalSales: 0,
        totalExpenses: 0,
        profit: 0,
        totalCustomers: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        monthlySales: 0,
        monthlyRevenue: 0
      };
    }
  }
};

// Servicios especializados adicionales
export const reportService = {
  // Generar reporte de ventas por período
  getSalesReport: async (startDate, endDate) => {
    try {
      // Implementar consulta con filtros de fecha
      const salesData = await salesService.getAll();
      if (!salesData.success) return salesData;

      const filteredSales = salesData.data.filter(sale => {
        if (!sale.createdAt) return false;
        const saleDate = sale.createdAt.toDate ? sale.createdAt.toDate() : new Date(sale.createdAt);
        return saleDate >= startDate && saleDate <= endDate;
      });

      return { success: true, data: filteredSales };
    } catch (error) {
      console.error('Error generating sales report:', error);
      return { success: false, error: error.message };
    }
  },

  // Generar reporte de gastos por categoría
  getExpensesByCategory: async () => {
    try {
      const expensesData = await expenseService.getAll();
      if (!expensesData.success) return expensesData;

      const categorizedExpenses = expensesData.data.reduce((acc, expense) => {
        const category = expense.category || 'Sin categoría';
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0, expenses: [] };
        }
        acc[category].total += parseFloat(expense.amount) || 0;
        acc[category].count += 1;
        acc[category].expenses.push(expense);
        return acc;
      }, {});

      return { success: true, data: categorizedExpenses };
    } catch (error) {
      console.error('Error generating expense report:', error);
      return { success: false, error: error.message };
    }
  }
};

// Servicio para actualizar el estado de un lead
export const updateLeadStatus = async (leadId, newStatus) => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status: newStatus });
    return { success: true };
  } catch (error) {
    console.error('Error updating lead status:', error);
    return { success: false, error: error.message };
  }
};

// O si prefieres mantenerlo dentro de customerService:
export const customerService = {
  ...createBaseService('customers'),
  async create(data) {
    // Asegura que el campo points exista
    const customerData = { ...data, points: data.points ?? 0 };
    return await createBaseService('customers').create(customerData);
  },
  async updatePoints(customerId, points) {
    const customerRef = doc(db, 'customers', customerId);
    await updateDoc(customerRef, { points });
    return { success: true };
  },
  async login(email, password) {
    try {
      const q = query(
        collection(db, 'customers'),
        where('email', '==', email),
        where('password', '==', password)
      );
      const snap = await getDocs(q);
      if (snap.empty) return { success: false, error: 'Credenciales incorrectas' };
      const doc = snap.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};