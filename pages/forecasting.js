export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/forecasting',
      permanent: false,
    },
  };
}

export default function LegacyForecastingRedirect() {
  return null;
}
