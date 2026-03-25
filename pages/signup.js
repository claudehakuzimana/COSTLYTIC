import Signup from '../client/src/pages/Signup';
import { PublicOnly } from '../components/RouteGates';

export default function SignupPage() {
  return (
    <PublicOnly redirectTo="/onboarding">
      <Signup />
    </PublicOnly>
  );
}
