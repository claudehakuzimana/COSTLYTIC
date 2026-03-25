import Login from '../client/src/pages/Login';
import { PublicOnly } from '../components/RouteGates';

export default function LoginPage() {
  return (
    <PublicOnly redirectTo="/app/dashboard">
      <Login />
    </PublicOnly>
  );
}
