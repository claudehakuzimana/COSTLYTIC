export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/guardrails',
      permanent: false,
    },
  };
}

export default function LegacyGuardrailsRedirect() {
  return null;
}
