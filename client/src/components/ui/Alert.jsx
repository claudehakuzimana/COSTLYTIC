export default function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = ''
}) {
  const types = {
    info: 'bg-orange-100 text-orange-800 border-orange-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <div className={`border-l-4 p-4 rounded ${types[type]} ${className}`}>
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h3 className="font-semibold">{title}</h3>}
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
