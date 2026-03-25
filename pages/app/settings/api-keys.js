import ApiKeys from '../../../client/src/pages/ApiKeys';
import ProtectedLayout from '../../../components/ProtectedLayout';
import { RequireAuth } from '../../../components/RouteGates';

export default function ApiKeysPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <ApiKeys />
      </ProtectedLayout>
    </RequireAuth>
  );
}
