export default function Badge({ 
  children, 
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-orange-200 text-orange-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    danger: 'bg-red-200 text-red-800'
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
