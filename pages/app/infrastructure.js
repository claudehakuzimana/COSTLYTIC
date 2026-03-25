import Infrastructure from '../../client/src/pages/Infrastructure';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function InfrastructurePage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <Infrastructure />
      </ProtectedLayout>
    </RequireAuth>
  );
}
