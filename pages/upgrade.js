export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/billing',
      permanent: false,
    },
  };
}

export default function LegacyUpgradeRedirect() {
  return null;
}
