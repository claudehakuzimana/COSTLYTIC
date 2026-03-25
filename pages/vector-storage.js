export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/app/vector-storage',
      permanent: false,
    },
  };
}

export default function LegacyVectorStorageRedirect() {
  return null;
}
