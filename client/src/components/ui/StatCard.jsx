export default function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  className = ''
}) {
  const changeColor = {
    increase: 'text-red-600',
    decrease: 'text-green-600',
    neutral: 'text-gray-600'
  };

  const changeIcon = {
    increase: '↑',
    decrease: '↓',
    neutral: '→'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-2 ${changeColor[changeType]}`}>
              <span>{changeIcon[changeType]} {change}</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-orange-100 rounded-lg">
            <Icon className="w-6 h-6 text-orange-600" />
          </div>
        )}
      </div>
    </div>
  );
}
