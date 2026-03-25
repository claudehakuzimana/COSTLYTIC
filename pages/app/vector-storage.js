import VectorStorage from '../../client/src/pages/VectorStorage';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function VectorStoragePage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <VectorStorage />
      </ProtectedLayout>
    </RequireAuth>
  );
}
