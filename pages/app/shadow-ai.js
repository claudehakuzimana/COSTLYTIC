import ShadowAI from '../../client/src/pages/ShadowAI';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function ShadowAIPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <ShadowAI />
      </ProtectedLayout>
    </RequireAuth>
  );
}
