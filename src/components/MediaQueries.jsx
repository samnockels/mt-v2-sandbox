import { useMediaQuery } from 'react-responsive';

export const Responsive = ({ desktop, tablet, mobile }) => {
	const isDesktop = useMediaQuery({ minWidth: 992 });
	const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
	if (isDesktop) {
		return desktop;
	} else if (isTablet) {
		return tablet;
	} else {
		return mobile;
	}
};
