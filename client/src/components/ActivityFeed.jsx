import { useState, useEffect } from 'react';
import { Activity, Zap, AlertCircle, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const mockActivities = [
  { id: 1, type: 'usage', message: 'GPT-4o request processed', provider: 'OpenAI', cost: '$0.032', time: 'Just now', icon: Zap, color: 'bg-green-500' },
  { id: 2, type: 'alert', message: 'Budget threshold reached', severity: 'warning', time: '2 min ago', icon: AlertCircle, color: 'bg-yellow-500' },
  { id: 3, type: 'usage', message: 'Claude-3 request completed', provider: 'Anthropic', cost: '$0.015', time: '5 min ago', icon: Zap, color: 'bg-purple-500' },
  { id: 4, type: 'success', message: 'Monthly report generated', time: '12 min ago', icon: CheckCircle, color: 'bg-blue-500' },
  { id: 5, type: 'usage', message: 'Llama-3 request processed', provider: 'Groq', cost: '$0.002', time: '15 min ago', icon: Zap, color: 'bg-orange-500' },
];

export default function ActivityFeed({ maxItems = 5 }) {
  const [activities, setActivities] = useState(mockActivities);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Live Activity</h3>
          <span className="flex items-center gap-1.5 ml-auto">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {activities.slice(0, maxItems).map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {activity.provider && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.provider}</span>
                    )}
                    {activity.cost && (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">{activity.cost}</span>
                    )}
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
