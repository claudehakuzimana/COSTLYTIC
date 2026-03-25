import Forecasting from '../../client/src/pages/Forecasting';
import ProtectedLayout from '../../components/ProtectedLayout';
import { RequireAuth } from '../../components/RouteGates';

export default function ForecastingPage() {
  return (
    <RequireAuth redirectTo="/login">
      <ProtectedLayout>
        <Forecasting />
      </ProtectedLayout>
    </RequireAuth>
  );
}
