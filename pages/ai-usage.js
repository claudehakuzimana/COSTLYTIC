export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/usage',
      permanent: false,
    },
  };
}

export default function LegacyAIUsageRedirect() {
  return null;
}
