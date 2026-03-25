import Guardrails from '../../client/src/pages/Guardrails';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function GuardrailsPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <Guardrails />
      </ProtectedLayout>
    </RequireAuth>
  );
}
