import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // This hook gets the current URL path
  const { pathname } = useLocation();

  useEffect(() => {
    // Every time the path changes, scroll the window to the very top
    // $y = 0$
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;