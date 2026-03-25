export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/shadow-ai',
      permanent: false,
    },
  };
}

export default function LegacyShadowAIRedirect() {
  return null;
}
