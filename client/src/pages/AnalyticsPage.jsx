import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useFetch } from '../hooks/useFetch';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const STATUS_COLORS = {
  scheduled: '#1d4ed8',
  completed: '#16a34a',
  cancelled: '#dc2626',
};

const CHART_OPTIONS = { maintainAspectRatio: false };

export default function AnalyticsPage() {
  const { data, loading, error } = useFetch('/analytics');

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!data) return null;

  const { summary, monthlyBookings, monthlyRevenue, statusBreakdown, topServices } = data;

  const bookingsChart = {
    labels: monthlyBookings.map((r) => r.month),
    datasets: [{
      label: 'Bookings',
      data: monthlyBookings.map((r) => Number(r.count)),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79,70,229,0.1)',
      tension: 0.3,
      fill: true,
    }],
  };

  const revenueChart = {
    labels: monthlyRevenue.map((r) => r.month),
    datasets: [{
      label: 'Revenue ($)',
      data: monthlyRevenue.map((r) => Number(r.revenue)),
      backgroundColor: '#4f46e5',
      borderRadius: 4,
    }],
  };

  const statusChart = {
    labels: statusBreakdown.map((r) => r.status),
    datasets: [{
      data: statusBreakdown.map((r) => Number(r.count)),
      backgroundColor: statusBreakdown.map((r) => STATUS_COLORS[r.status] || '#6b7280'),
    }],
  };

  const topServicesChart = {
    labels: topServices.map((r) => r.name),
    datasets: [{
      label: 'Bookings',
      data: topServices.map((r) => Number(r.booking_count)),
      backgroundColor: '#4f46e5',
      borderRadius: 4,
    }],
  };

  return (
    <div className="analytics-page">
      <h2>Analytics</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <span className="stat-number">{Number(summary.total_clients)}</span>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <span className="stat-number">{Number(summary.total_bookings)}</span>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <span className="stat-number">${Number(summary.total_revenue).toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <span className="stat-number">{Number(summary.bookings_this_month)}</span>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-container">
          <h3>Monthly Bookings</h3>
          {monthlyBookings.length > 0 ? (
            <Line data={bookingsChart} options={CHART_OPTIONS} />
          ) : (
            <p className="chart-empty">No booking data yet</p>
          )}
        </div>

        <div className="chart-container">
          <h3>Monthly Revenue</h3>
          {monthlyRevenue.length > 0 ? (
            <Bar data={revenueChart} options={CHART_OPTIONS} />
          ) : (
            <p className="chart-empty">No revenue data yet</p>
          )}
        </div>

        <div className="chart-container chart-container--doughnut">
          <h3>Appointment Status</h3>
          {statusBreakdown.length > 0 ? (
            <Doughnut data={statusChart} options={CHART_OPTIONS} />
          ) : (
            <p className="chart-empty">No appointments yet</p>
          )}
        </div>

        <div className="chart-container">
          <h3>Top Services by Bookings</h3>
          {topServices.length > 0 ? (
            <Bar
              data={topServicesChart}
              options={{ ...CHART_OPTIONS, indexAxis: 'y' }}
            />
          ) : (
            <p className="chart-empty">No booking data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
