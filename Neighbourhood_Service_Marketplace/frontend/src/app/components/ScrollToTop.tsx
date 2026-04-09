import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - Scrolls to the top of the page on every route change.
 * Watches pathname + search so it fires even when only query params change.
 * Skips scroll when navigating to a hash anchor (lets the browser jump to it).
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If the link has a hash anchor (e.g. /#how-it-works), let browser handle it
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, hash]);

  return null;
}

