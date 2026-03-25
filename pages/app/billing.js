import Upgrade from '../../client/src/pages/Upgrade';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function BillingPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <Upgrade />
      </ProtectedLayout>
    </RequireAuth>
  );
}
