import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
	const { pathname, search } = useLocation();

	useLayoutEffect(() => {
		const previousRestoration = window.history.scrollRestoration;
		window.history.scrollRestoration = "manual";

		return () => {
			window.history.scrollRestoration = previousRestoration;
		};
	}, []);

	useLayoutEffect(() => {
		window.scrollTo(0, 0);
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	}, [pathname, search]);

	return null;
};

export default ScrollToTop;
