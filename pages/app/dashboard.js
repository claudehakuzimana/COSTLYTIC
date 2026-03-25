import Dashboard from '../../client/src/pages/Dashboard';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function DashboardPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <Dashboard />
      </ProtectedLayout>
    </RequireAuth>
  );
}
