import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KpiCard from '../components/KpiCard';
import OrdersKanban from '../components/OrdersKanban';
import CustomerCard from '../components/CustomerCard';
import ChartContainer from '../components/ChartContainer';
import ImageUploader from '../components/ImageUploader';
import { useAuth } from '../contexts/AuthContext';
import './dashboard-layout.css';


const AdminDashboard = () => {
  const { user, logout } = useAuth(); // Obtén `user` y `logout` del contexto

  const [activeSection, setActiveSection] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Estados para datos
  const [siteData, setSiteData] = useState({
    general: {
      siteName: 'Maitademi',
      tagline: 'Endulzando momentos especiales',
      phone: '+52 33 2682 7809',
      email: 'info@maitademi.com',
      address: 'Guadalajara, Jalisco'
    },
    hero: {
      title: 'Bienvenidos a Maitademi',
      subtitle: 'Los mejores pasteles y postres artesanales',
      buttonText: 'Ver Productos',
      backgroundImage: '/images/hero-bg.jpg'
    },
    products: {
      featured: [],
      categories: ['Pasteles', 'Cupcakes', 'Galletas', 'Postres']
    },
    promotions: {
      bannerText: '¡Oferta especial! 20% de descuento en pasteles personalizados',
      isActive: true
    },
    social: {
      facebook: 'https://facebook.com/maitademi',
      instagram: 'https://instagram.com/maitademi',
      whatsapp: '+523326827809'
    }
  });

  const [financialData, setFinancialData] = useState({
    sales: [
      // Datos de ejemplo para mostrar
      {
        id: 1,
        date: '2024-05-20',
        description: 'Pastel de chocolate 3 pisos',
        category: 'Pasteles',
        amount: 850,
        paymentMethod: 'transferencia',
        customer: 'María González',
        status: 'completado'
      },
      {
        id: 2,
        date: '2024-05-19',
        description: 'Cupcakes personalizados x24',
        category: 'Cupcakes',
        amount: 480,
        paymentMethod: 'efectivo',
        customer: 'Carlos Ruiz',
        status: 'completado'
      }
    ],
    expenses: [
      {
        id: 1,
        date: '2024-05-20',
        description: 'Ingredientes: harina, azúcar, huevos',
        category: 'Ingredientes',
        amount: 320,
        paymentMethod: 'tarjeta',
        supplier: 'Costco'
      }
    ],
    targets: {
      monthly: 15000,
      quarterly: 45000,
      annual: 180000
    },
    customers: [
      { name: 'María González', totalSpent: 2400, orders: 5, lastOrder: '2024-05-20' },
      { name: 'Carlos Ruiz', totalSpent: 1800, orders: 3, lastOrder: '2024-05-19' }
    ]
  });

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Harina de trigo', stock: 25, unit: 'kg', minStock: 10, cost: 15 },
    { id: 2, name: 'Azúcar refinada', stock: 8, unit: 'kg', minStock: 15, cost: 18 },
    { id: 3, name: 'Huevos', stock: 48, unit: 'piezas', minStock: 24, cost: 4 },
    { id: 4, name: 'Mantequilla', stock: 12, unit: 'kg', minStock: 8, cost: 45 }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: 'Ana Martínez',
      product: 'Pastel de bodas 5 pisos',
      deliveryDate: '2024-05-25',
      status: 'en_proceso',
      priority: 'alta',
      amount: 2500,
      notes: 'Decoración con rosas rojas y blancas'
    },
    {
      id: 2,
      customer: 'Pedro López',
      product: 'Cheesecake de frutos rojos',
      deliveryDate: '2024-05-22',
      status: 'pendiente',
      priority: 'media',
      amount: 450,
      notes: 'Sin azúcar adicional'
    }
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Pastel de Chocolate',
      description: 'Delicioso pastel de chocolate con relleno cremoso',
      price: 350,
      category: 'Pasteles',
      image: '/images/product1.jpg'
    },
    {
      id: 2,
      name: 'Cupcake de Vainilla',
      description: 'Esponjoso cupcake de vainilla con chispas de chocolate',
      price: 120,
      category: 'Cupcakes',
      image: '/images/product2.jpg'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'sale',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'efectivo',
    customer: '',
    status: 'completado'
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Agregar estado para filtro
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    // Cargar datos guardados
    const savedData = localStorage.getItem('maitademiDashboardData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSiteData(parsedData.siteData || siteData);
      setFinancialData(parsedData.financialData || financialData);
      setInventory(parsedData.inventory || inventory);
      setOrders(parsedData.orders || orders);
      setProducts(parsedData.products || products);
    }

    // Generar notificaciones
    generateNotifications();
  }, []);

  const generateNotifications = () => {
    const newNotifications = [];
    
    // Verificar stock bajo
    inventory.forEach(item => {
      if (item.stock <= item.minStock) {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: 'warning',
          title: 'Stock Bajo',
          message: `${item.name}: ${item.stock} ${item.unit} restantes`,
          time: 'Ahora'
        });
      }
    });

    // Verificar pedidos urgentes
    orders.forEach(order => {
      const deliveryDate = new Date(order.deliveryDate);
      const today = new Date();
      const daysUntilDelivery = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDelivery <= 2 && order.status !== 'completado') {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: 'urgent',
          title: 'Pedido Urgente',
          message: `${order.product} - Entrega en ${daysUntilDelivery} días`,
          time: 'Urgente'
        });
      }
    });

    // Verificar metas mensuales
    const monthlyProgress = (calculateTotalSales() / financialData.targets.monthly) * 100;
    if (monthlyProgress > 90) {
      newNotifications.push({
        id: Date.now() + Math.random(),
        type: 'success',
        title: '¡Meta Casi Alcanzada!',
        message: `${monthlyProgress.toFixed(1)}% de la meta mensual completada`,
        time: 'Hoy'
      });
    }

    setNotifications(newNotifications);
  };

  // Funciones de cálculo
  const calculateTotalSales = (period = 'month') => {
    const now = new Date();
    const sales = financialData.sales.filter(sale => {
      const saleDate = new Date(sale.date);
      switch (period) {
        case 'month':
          return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          const saleQuarter = Math.floor(saleDate.getMonth() / 3);
          return saleQuarter === quarter && saleDate.getFullYear() === now.getFullYear();
        case 'year':
          return saleDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    return sales.reduce((total, sale) => total + parseFloat(sale.amount), 0);
  };

  const calculateTotalExpenses = (period = 'month') => {
    const now = new Date();
    const expenses = financialData.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (period) {
        case 'month':
          return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          const expenseQuarter = Math.floor(expenseDate.getMonth() / 3);
          return expenseQuarter === quarter && expenseDate.getFullYear() === now.getFullYear();
        case 'year':
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const calculateProfit = (period = 'month') => {
    return calculateTotalSales(period) - calculateTotalExpenses(period);
  };

  const calculateGrowthRate = () => {
    const currentMonth = calculateTotalSales('month');
    const lastMonth = 12500; // Datos del mes anterior (simulado)
    return ((currentMonth - lastMonth) / lastMonth) * 100;
  };

  // Datos para gráficos avanzados
  const getAdvancedMonthlyData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();
    
    // Datos simulados más realistas
    const salesData = [8500, 9200, 11800, 10500, 13200, 14800, 16500, 15200, 12800, 14200, 18500, 22000];
    const expensesData = [3200, 3800, 4200, 3900, 4800, 5200, 5800, 5400, 4600, 5000, 6200, 7500];
    const profitData = salesData.map((sale, index) => sale - expensesData[index]);

    return {
      labels: months,
      datasets: [
        {
          label: 'Ventas',
          data: salesData,
          borderColor: '#ff6b9d',
          backgroundColor: 'rgba(255, 107, 157, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Gastos',
          data: expensesData,
          borderColor: '#ff4757',
          backgroundColor: 'rgba(255, 71, 87, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Ganancia',
          data: profitData,
          borderColor: '#2ed573',
          backgroundColor: 'rgba(46, 213, 115, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const getPerformanceRadarData = () => {
    return {
      labels: ['Ventas', 'Calidad', 'Tiempo', 'Satisfacción', 'Innovación', 'Rentabilidad'],
      datasets: [
        {
          label: 'Este Mes',
          data: [85, 92, 78, 95, 88, 82],
          backgroundColor: 'rgba(255, 107, 157, 0.2)',
          borderColor: '#ff6b9d',
          pointBackgroundColor: '#ff6b9d',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ff6b9d'
        },
        {
          label: 'Mes Anterior',
          data: [75, 88, 82, 89, 85, 78],
          backgroundColor: 'rgba(116, 185, 255, 0.2)',
          borderColor: '#74b9ff',
          pointBackgroundColor: '#74b9ff',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#74b9ff'
        }
      ]
    };
  };

  const getTopProductsData = () => {
    const productSales = {
      'Pasteles Personalizados': 45,
      'Cupcakes': 32,
      'Cheesecakes': 28,
      'Galletas Decoradas': 18,
      'Postres Especiales': 15
    };

    return {
      labels: Object.keys(productSales),
      datasets: [
        {
          data: Object.values(productSales),
          backgroundColor: [
            '#ff6b9d',
            '#74b9ff',
            '#2ed573',
            '#ffa502',
            '#ff4757'
          ],
          borderWidth: 0,
          hoverBorderWidth: 3,
          hoverBorderColor: '#fff'
        }
      ]
    };
  };

  // Componentes de renderizado
  const renderAdvancedOverview = () => (
    <div className="overview-section">
      {/* KPIs Principales */}
      <div className="kpi-grid">
        <KpiCard
          icon="💰"
          trend={calculateGrowthRate()}
          title="Ventas del Mes"
          value={`$${calculateTotalSales(dateRange).toLocaleString()}`}
          progress={(calculateTotalSales(dateRange) / financialData.targets.monthly) * 100}
          color="#27ae60"
        />
        <KpiCard
          icon="💸"
          trend={-5.3}
          title="Gastos del Mes"
          value={`$${calculateTotalExpenses().toLocaleString()}`}
          progress={(calculateTotalExpenses() / (financialData.targets.monthly * 0.4)) * 100}
          color="#e74c3c"
        />
        <KpiCard
          icon="📈"
          trend={28.5}
          title="Ganancia Neta"
          value={`$${calculateProfit().toLocaleString()}`}
          progress={((calculateProfit() / calculateTotalSales()) * 100)}
          color="#2ed573"
        />
        <KpiCard
          icon="🎂"
          trend={15.2}
          title="Pedidos Activos"
          value={orders.filter(order => order.status !== 'completado').length}
          progress={0}
          color="#ffa502"
        />
      </div>

      {/* Controles de Período */}
      <div className="period-controls">
        <div className="control-group">
          <label>Período de análisis:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Año</option>
          </select>
        </div>
        <button className="export-btn" onClick={() => exportReport()}>
          📊 Exportar Reporte
        </button>
      </div>

      {/* Gráficos Avanzados */}
      <div className="advanced-charts-grid">
        <ChartContainer 
          title="📈 Tendencia Financiera 2024"
          data={getAdvancedMonthlyData()}
          type="line"
          options={{
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#ff6b9d',
                borderWidth: 1,
              }
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Meses'
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Cantidad ($MXN)'
                }
              }
            }
          }}
        />
        
        <ChartContainer 
          title="🎯 Análisis de Rendimiento"
          data={getPerformanceRadarData()}
          type="radar"
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              }
            },
            scales: {
              r: {
                beginAtZero: true,
                max: 100
              }
            }
          }}
        />
        
        <ChartContainer 
          title="🏆 Productos Más Vendidos"
          data={getTopProductsData()}
          type="polarArea"
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              }
            }
          }}
        />
      </div>

      {/* Métricas Rápidas */}
      <div className="quick-metrics">
        <div className="metric-item">
          <span className="metric-label">Ticket Promedio</span>
          <span className="metric-value">${(calculateTotalSales() / financialData.sales.length).toFixed(0)}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Clientes Activos</span>
          <span className="metric-value">{financialData.customers.length}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">ROI Mensual</span>
          <span className="metric-value">{((calculateProfit() / calculateTotalExpenses()) * 100).toFixed(1)}%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Días hasta Meta</span>
          <span className="metric-value">
            {Math.ceil((financialData.targets.monthly - calculateTotalSales()) / (calculateTotalSales() / new Date().getDate()))}
          </span>
        </div>
      </div>
    </div>
  );

  const renderInventoryManagement = () => (
    <div className="section-content">
      <div className="section-header">
        <h3>📦 Gestión de Inventario</h3>
        <button className="add-btn" onClick={() => openModal('inventory')}>
          + Agregar Producto
        </button>
      </div>
      
      <div className="inventory-grid">
        {inventory.map(item => (
          <div 
            key={item.id} 
            className={`inventory-card ${item.stock <= item.minStock ? 'low-stock' : ''}`}
          >
            <div className="inventory-header">
              <h4>{item.name}</h4>
              {item.stock <= item.minStock && <span className="alert-badge">⚠️ Stock Bajo</span>}
            </div>
            <div className="inventory-details">
              <div className="stock-info">
                <span className="current-stock">{item.stock} {item.unit}</span>
                <span className="min-stock">Mín: {item.minStock} {item.unit}</span>
              </div>
              <div className="stock-bar">
                <div 
                  className="stock-fill"
                  style={{ width: `${(item.stock / (item.minStock * 2)) * 100}%` }}
                />
              </div>
              <div className="cost-info">
                <span>Costo: ${item.cost} / {item.unit}</span>
              </div>
            </div>
            <div className="inventory-actions">
              <button className="stock-btn">+ Stock</button>
              <button className="edit-btn">✏️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrdersManagement = () => (
    <div className="section-content">
      <div className="section-header">
        <h3>📋 Gestión de Pedidos</h3>
        <button className="add-btn" onClick={() => openModal('order')}>
          + Nuevo Pedido
        </button>
      </div>
      
      <OrdersKanban 
        orders={orders}
        onUpdateStatus={updateOrderStatus}
      />
    </div>
  );

  const renderCustomersManagement = () => (
    <div className="section-content">
      <div className="section-header">
        <h3>👥 Gestión de Clientes</h3>
        <div className="header-actions">
          <input 
            type="search" 
            placeholder="Buscar clientes..." 
            className="search-input"
          />
          <button className="add-btn">+ Nuevo Cliente</button>
        </div>
      </div>
      
      <div className="customers-grid">
        {financialData.customers.map((customer, index) => (
          <CustomerCard 
            key={index} 
            customer={customer}
            index={index}
          />
        ))}
      </div>
    </div>
  );

  const renderProductsSection = () => {
    const filteredProducts = categoryFilter 
      ? products.filter(product => product.category === categoryFilter)
      : products;

    return (
      <div className="section-content">
        <div className="section-header">
          <h3>🎂 Galería de Creaciones Maitademi</h3>
          <div className="header-controls">
            <select 
              className="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="Pasteles de Cumpleaños">🎂 Pasteles de Cumpleaños</option>
              <option value="Pasteles de Bodas">💒 Pasteles de Bodas</option>
              <option value="Cupcakes">🧁 Cupcakes</option>
              <option value="Cheesecakes">🍰 Cheesecakes</option>
              <option value="Galletas Decoradas">🍪 Galletas Decoradas</option>
              <option value="Creaciones Personalizadas">✨ Personalizados</option>
              {/* Agregar más según necesites */}
            </select>
            <button className="add-btn" onClick={() => openProductModal()}>
              + Agregar Creación
            </button>
          </div>
        </div>
        
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="no-image">
                    <span>📸</span>
                    <p>Sin imagen</p>
                  </div>
                )}
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <div className="product-meta">
                  <span className="price">${product.price}</span>
                  <span 
                    className="category" 
                    data-category={product.category}
                    title={product.category}
                  >
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="product-actions">
                <button 
                  className="edit-btn"
                  onClick={() => openProductModal(product)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteProduct(product.id)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎂</div>
              <h4>¡Comienza a mostrar tus creaciones!</h4>
              <p>Agrega fotos de tus pasteles y postres para crear una galería increíble</p>
              <button className="add-btn" onClick={() => openProductModal()}>
                + Agregar Primera Creación
              </button>
            </div>
          )}
        </div>

        {/* Modal para agregar/editar productos */}
        {showProductModal && (
          <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingProduct ? '✏️ Editar' : '➕ Nueva'} Creación</h3>
                <button className="close-btn" onClick={() => setShowProductModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleProductSubmit} className="product-form">
                <div className="form-group">
                  <label>📸 Imagen de la Creación</label>
                  <ImageUploader 
                    onImageUpload={(result) => {
                      // result puede ser un objeto con url o solo la url
                      const imageUrl = result?.url || result;
                      setNewProduct(prev => ({...prev, image: imageUrl}));
                    }}
                    currentImage={newProduct.image}
                    category="pasteles"
                  />
                </div>

                <div className="form-group">
                  <label>🎂 Nombre del Producto</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))}
                    placeholder="Ej: Pastel de Chocolate 3 Pisos"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>📝 Descripción</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe tu creación, ingredientes especiales, ocasión..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>💰 Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({...prev, price: e.target.value}))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>🏷️ Categoría</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({...prev, category: e.target.value}))}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="Pasteles de Cumpleaños">🎂 Pasteles de Cumpleaños</option>
                      <option value="Pasteles de Bodas">💒 Pasteles de Bodas</option>
                      <option value="Pasteles Temáticos">🎭 Pasteles Temáticos</option>
                      <option value="Cupcakes">🧁 Cupcakes</option>
                      <option value="Mini Cupcakes">🧁 Mini Cupcakes</option>
                      <option value="Cake Pops">🍭 Cake Pops</option>
                      <option value="Cheesecakes">🍰 Cheesecakes</option>
                      <option value="Tartas">🥧 Tartas</option>
                      <option value="Galletas Decoradas">🍪 Galletas Decoradas</option>
                      <option value="Macarons">🌈 Macarons</option>
                      <option value="Postres en Copa">🥄 Postres en Copa</option>
                      <option value="Brownies">🍫 Brownies</option>
                      <option value="Muffins">🧁 Muffins</option>
                      <option value="Donuts">🍩 Donuts</option>
                      <option value="Pasteles Sin Gluten">🌾 Sin Gluten</option>
                      <option value="Pasteles Veganos">🌱 Veganos</option>
                      <option value="Postres Navideños">🎄 Navideños</option>
                      <option value="Postres de San Valentín">💝 San Valentín</option>
                      <option value="Baby Shower">👶 Baby Shower</option>
                      <option value="Graduaciones">🎓 Graduaciones</option>
                      <option value="Aniversarios">💕 Aniversarios</option>
                      <option value="Eventos Corporativos">🏢 Corporativos</option>
                      <option value="Creaciones Personalizadas">✨ Personalizados</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowProductModal(false)} 
                    className="cancel-btn"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="save-btn">
                    {editingProduct ? 'Actualizar' : 'Guardar'} Creación
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // En tu función renderContent, actualiza para incluir 'products'
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderAdvancedOverview();
      case 'sales':
        return renderSalesSection();
      case 'expenses':
        return renderExpensesSection();
      case 'products':
        return renderProductsSection();
      case 'analytics':
        return renderAnalyticsSection();
      case 'site-config':
        return renderSiteConfigSection();
      default:
        return renderAdvancedOverview();
    }
  };

  // En tu navegación, agrega el botón para productos
  const navItems = [
    { key: 'overview', label: '📊 Dashboard', icon: '📊' },
    { key: 'sales', label: '💰 Ventas', icon: '💰' },
    { key: 'expenses', label: '💸 Gastos', icon: '💸' },
    { key: 'products', label: '🎂 Productos', icon: '🎂' }, // ← Agregar esta línea
    { key: 'analytics', label: '📈 Analytics', icon: '📈' },
    { key: 'site-config', label: '⚙️ Sitio Web', icon: '⚙️' }
  ];

  // Header con notificaciones
  const renderHeader = () => (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Panel de Control - Maitademi
          </motion.h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span>/</span>
            <span>{activeSection}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <div className="notifications-container">
              <button 
                className="notifications-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {notifications.length > 0 && (
                  <span className="notification-count">{notifications.length}</span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    className="notifications-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="notifications-header">
                      <h4>Notificaciones</h4>
                      <button onClick={() => setNotifications([])}>
                        Limpiar todas
                      </button>
                    </div>
                    <div className="notifications-list">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">
                          No hay notificaciones nuevas
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div key={notification.id} className={`notification-item ${notification.type}`}>
                            <div className="notification-content">
                              <h5>{notification.title}</h5>
                              <p>{notification.message}</p>
                            </div>
                            <div className="notification-time">
                              {notification.time}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="user-info">
            <div className="user-avatar">
              <span>{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-details">
              <span className="user-name">{user.username}</span>
              <span className="user-role">Administrador</span>
            </div>
            <button onClick={logout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Funciones auxiliares
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const exportReport = () => {
    const reportData = {
      period: dateRange,
      sales: calculateTotalSales(dateRange),
      expenses: calculateTotalExpenses(dateRange),
      profit: calculateProfit(dateRange),
      date: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-maitademi-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleSave = () => {
    const dashboardData = {
      siteData,
      financialData,
      inventory,
      orders
    };
    localStorage.setItem('maitademiDashboardData', JSON.stringify(dashboardData));
    
    // Mostrar notificación de éxito
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'success',
      title: 'Datos Guardados',
      message: 'Todos los cambios han sido guardados exitosamente',
      time: 'Ahora'
    }]);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setEditingItem(null);
    setNewTransaction({
      type,
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'efectivo',
      customer: '',
      status: 'completado'
    });
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setNewProduct(product);
    } else {
      setEditingProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null
      });
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Actualizar producto existente
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...newProduct, id: editingProduct.id }
          : p
      ));
    } else {
      // Agregar nuevo producto
      const product = {
        ...newProduct,
        id: Date.now(), // ID temporal
        price: parseFloat(newProduct.price)
      };
      setProducts(prev => [...prev, product]);
    }
    
    setShowProductModal(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      image: null
    });
  };

  const deleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de eliminar esta creación?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const renderProductModal = () => {
    if (!showProductModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
        <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{editingProduct ? '✏️ Editar' : '➕ Nueva'} Creación</h3>
            <button className="close-btn" onClick={() => setShowProductModal(false)}>×</button>
          </div>
          
          <form onSubmit={handleProductSubmit} className="product-form">
            <div className="form-group">
              <label>📸 Imagen de la Creación</label>
              <ImageUploader 
                onImageUpload={(result) => {
                  // result puede ser un objeto con url o solo la url
                  const imageUrl = result?.url || result;
                  setNewProduct(prev => ({...prev, image: imageUrl}));
                }}
                currentImage={newProduct.image}
                category="pasteles"
              />
            </div>

            <div className="form-group">
              <label>🎂 Nombre del Producto</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))}
                placeholder="Ej: Pastel de Chocolate 3 Pisos"
                required
              />
            </div>

            <div className="form-group">
              <label>📝 Descripción</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe tu creación, ingredientes especiales, ocasión..."
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>💰 Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({...prev, price: e.target.value}))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>🏷️ Categoría</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({...prev, category: e.target.value}))}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Pasteles de Cumpleaños">🎂 Pasteles de Cumpleaños</option>
                  <option value="Pasteles de Bodas">💒 Pasteles de Bodas</option>
                  <option value="Pasteles Temáticos">🎭 Pasteles Temáticos</option>
                  <option value="Cupcakes">🧁 Cupcakes</option>
                  <option value="Mini Cupcakes">🧁 Mini Cupcakes</option>
                  <option value="Cake Pops">🍭 Cake Pops</option>
                  <option value="Cheesecakes">🍰 Cheesecakes</option>
                  <option value="Tartas">🥧 Tartas</option>
                  <option value="Galletas Decoradas">🍪 Galletas Decoradas</option>
                  <option value="Macarons">🌈 Macarons</option>
                  <option value="Postres en Copa">🥄 Postres en Copa</option>
                  <option value="Brownies">🍫 Brownies</option>
                  <option value="Muffins">🧁 Muffins</option>
                  <option value="Donuts">🍩 Donuts</option>
                  <option value="Pasteles Sin Gluten">🌾 Sin Gluten</option>
                  <option value="Pasteles Veganos">🌱 Veganos</option>
                  <option value="Postres Navideños">🎄 Navideños</option>
                  <option value="Postres de San Valentín">💝 San Valentín</option>
                  <option value="Baby Shower">👶 Baby Shower</option>
                  <option value="Graduaciones">🎓 Graduaciones</option>
                  <option value="Aniversarios">💕 Aniversarios</option>
                  <option value="Eventos Corporativos">🏢 Corporativos</option>
                  <option value="Creaciones Personalizadas">✨ Personalizados</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                onClick={() => setShowProductModal(false)} 
                className="cancel-btn"
              >
                Cancelar
              </button>
              <button type="submit" className="save-btn">
                {editingProduct ? 'Actualizar' : 'Guardar'} Creación
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!user) {
    return <div>Acceso denegado</div>; // Manejo de usuarios no autenticados
  }

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {renderHeader()}

      <div className="dashboard-content">
        <motion.nav 
          className="dashboard-nav"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ul>
            {[
              { key: 'overview', label: '📊 Dashboard', icon: '📊' },
              { key: 'sales', label: '💰 Ventas', icon: '💰' },
              { key: 'expenses', label: '💸 Gastos', icon: '💸' },
              { key: 'products', label: '🎂 Productos', icon: '🎂' }, // ← Agregar esta línea
              { key: 'analytics', label: '📈 Analytics', icon: '📈' },
              { key: 'site-config', label: '⚙️ Sitio Web', icon: '⚙️' }
            ].map(item => (
              <li key={item.key}>
                <motion.button
                  className={activeSection === item.key ? 'active' : ''}
                  onClick={() => setActiveSection(item.key)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.nav>

        <main className="dashboard-main">
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && renderAdvancedOverview()}
            {activeSection === 'inventory' && renderInventoryManagement()}
            {activeSection === 'orders' && renderOrdersManagement()}
            {activeSection === 'customers' && renderCustomersManagement()}
            {activeSection === 'products' && renderProductsSection()}
            {/* Renderizar otras secciones existentes... */}
          </AnimatePresence>

          <motion.div 
            className="save-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button onClick={handleSave} className="save-btn">
              💾 Guardar Cambios
            </button>
          </motion.div>
        </main>
      </div>

      {renderProductModal()}
    </div>
  );
};

export default AdminDashboard;