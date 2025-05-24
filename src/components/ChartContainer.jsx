import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale, ArcElement } from 'chart.js';
import { Line, Radar, PolarArea } from 'react-chartjs-2';
import './ChartContainer.css';

// Registra los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

const ChartContainer = ({ title, data, type, options }) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'radar':
        return <Radar data={data} options={options} />;
      case 'polarArea':
        return <PolarArea data={data} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <div className="chart-content">{renderChart()}</div>
    </div>
  );
};

const data = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Ventas',
      data: [5000, 7000, 8000, 6000, 9000],
      borderColor: '#ff6b9d',
      backgroundColor: 'rgba(255, 107, 157, 0.2)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
  },
  scales: {
    x: {
      type: 'category', // Asegúrate de que el tipo de escala sea válido
      title: {
        display: true,
        text: 'Meses',
      },
    },
    y: {
      type: 'linear',
      title: {
        display: true,
        text: 'Cantidad ($MXN)',
      },
    },
  },
};

export default ChartContainer;