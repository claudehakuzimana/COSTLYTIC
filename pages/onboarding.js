import Onboarding from '../client/src/pages/Onboarding';
import ProtectedLayout from '../components/ProtectedLayout';
import { RequireAuth } from '../components/RouteGates';

export default function OnboardingPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <Onboarding />
      </ProtectedLayout>
    </RequireAuth>
  );
}
