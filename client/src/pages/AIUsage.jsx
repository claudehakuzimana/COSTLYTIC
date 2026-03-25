import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import FeatureGate from '../components/FeatureGate';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AIUsage() {
  const [usageData, setUsageData] = useState(null);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      // Mock data
      setUsageData({
        providers: ['OpenAI', 'Anthropic', 'Google', 'Meta'],
        costs: [8234, 3456, 655, 1200],
        tokens: [2500000, 1800000, 800000, 600000],
      });
    } catch (error) {
      console.error('Error fetching usage data:', error);
    }
  };

  const chartData = {
    labels: usageData?.providers || [],
    datasets: [
      {
        label: 'Cost ($)',
        data: usageData?.costs || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'AI Usage Costs by Provider',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">AI Usage Analytics</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AI</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Cost
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    $13,545
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tokens
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    5,700,000
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Q</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Queries
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    45,230
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">$</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Cost/Query
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    $0.30
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <FeatureGate 
          featureCategory="ai_usage" 
          featureName="provider_breakdown"
          fallback={
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Provider breakdown is a Pro feature</p>
              </div>
            </div>
          }
        >
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Provider Breakdown</h3>
            <div className="space-y-4">
              {[
                { provider: 'OpenAI', cost: 5420, percentage: 40 },
                { provider: 'Anthropic', cost: 3456, percentage: 25 },
                { provider: 'Google', cost: 2340, percentage: 17 },
                { provider: 'Meta', cost: 1329, percentage: 10 },
              ].map((item) => (
                <div key={item.provider} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.provider}</span>
                      <span className="text-sm text-gray-500">${item.cost}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FeatureGate>
      </div>
    </div>
  );
}