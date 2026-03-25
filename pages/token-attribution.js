export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/token-attribution',
      permanent: false,
    },
  };
}

export default function LegacyTokenAttributionRedirect() {
  return null;
}
