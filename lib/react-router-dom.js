import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

export function Link({ to, replace, scroll, prefetch, children, ...props }) {
  return (
    <NextLink href={to} replace={replace} scroll={scroll} prefetch={prefetch} {...props}>
      {children}
    </NextLink>
  );
}

export function BrowserRouter({ children }) {
  return children;
}

export function Routes({ children }) {
  return children;
}

export function Route({ element }) {
  return element;
}

export function Navigate({ to, replace = false }) {
  const router = useRouter();

  useEffect(() => {
    if (!to) return;
    if (replace) {
      router.replace(to);
      return;
    }
    router.push(to);
  }, [replace, router, to]);

  return null;
}

export function useNavigate() {
  const router = useRouter();
  return (to, options = {}) => {
    if (options.replace) {
      return router.replace(to);
    }
    return router.push(to);
  };
}

export function useLocation() {
  const router = useRouter();
  const asPath = router.asPath || router.pathname || '/';
  const [pathname, search = ''] = asPath.split('?');

  return {
    pathname,
    search: search ? `?${search}` : '',
    hash: '',
    state: null,
    key: asPath,
  };
}

export function useSearchParams() {
  const router = useRouter();
  const search = useMemo(() => {
    const query = router.asPath?.split('?')[1] || '';
    return new URLSearchParams(query);
  }, [router.asPath]);

  return [search, () => {}];
}
