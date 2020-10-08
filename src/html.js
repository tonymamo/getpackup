import React from 'react';

export default function HTML(props) {
	return (
		// eslint-disable-next-line jsx-a11y/html-has-lang
		<html {...props.htmlAttributes}>
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="x-ua-compatible" content="ie=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				{props.headComponents}
				<script
					type="text/javascript"
					src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_MAPS_API_KEY}&libraries=places`}
				/>
			</head>
			<body {...props.bodyAttributes}>
				{props.preBodyComponents}
				{/* eslint-disable-next-line react/no-danger */}
				<div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: props.body }} />
				{props.postBodyComponents}
			</body>
		</html>
	);
}
