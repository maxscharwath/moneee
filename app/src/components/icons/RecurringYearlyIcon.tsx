import React from "react";

export const RecurringYearlyIcon = React.forwardRef<
	SVGSVGElement,
	React.SVGProps<SVGSVGElement>
>((props, forwardedRef) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		role="graphics-symbol"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="lucide lucide-scroll-text"
		ref={forwardedRef}
		{...props}
	>
		<path d="M21 8L18.74 5.74C16.93 4 14.52 3 12 3C10.22 3 8.47991 3.52784 6.99986 4.51677C5.51982 5.50571 4.36627 6.91131 3.68508 8.55585C3.00389 10.2004 2.82566 12.01 3.17293 13.7558C3.5202 15.5016 4.37736 17.1053 5.63604 18.364C6.89471 19.6226 8.49836 20.4798 10.2442 20.8271C11.409 21.0588 12.6022 21.0565 13.7558 20.8271" />
		<path d="M21 3V8H16" />
		<path d="M15 12L17.5 15M17.5 15L20 12M17.5 15V18" />
	</svg>
));
RecurringYearlyIcon.displayName = "RecurringYearlyIcon";
