export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/dashboard',
      permanent: false,
    },
  };
}

export default function LegacyDashboardRedirect() {
  return null;
}
