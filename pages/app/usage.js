import AIUsage from '../../client/src/pages/AIUsage';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function UsagePage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <AIUsage />
      </ProtectedLayout>
    </RequireAuth>
  );
}
