export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/settings',
      permanent: false,
    },
  };
}

export default function LegacySettingsRedirect() {
  return null;
}
