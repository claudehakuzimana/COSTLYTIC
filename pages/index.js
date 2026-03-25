import Landing from '../client/src/pages/Landing';
import { PublicOnly } from '../components/RouteGates';

export default function HomePage() {
  return (
    <PublicOnly redirectTo="/app/dashboard">
      <Landing />
    </PublicOnly>
  );
}
