import Settings from '../../../client/src/pages/Settings';
import ProtectedLayout from '../../../components/ProtectedLayout';
import { RequireAuth } from '../../../components/RouteGates';

export default function SettingsPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <Settings />
      </ProtectedLayout>
    </RequireAuth>
  );
}
