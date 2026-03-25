export default function Grid({ children, cols = 4, gap = 8 }) {
  const colsClassName = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapClassName = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div className={`grid ${colsClassName[cols]} ${gapClassName[gap]}`}>
      {children}
    </div>
  );
}
