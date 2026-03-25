import TokenAttribution from '../../client/src/pages/TokenAttribution';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function TokenAttributionPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <TokenAttribution />
      </ProtectedLayout>
    </RequireAuth>
  );
}
