export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/infrastructure',
      permanent: false,
    },
  };
}

export default function LegacyInfrastructureRedirect() {
  return null;
}
