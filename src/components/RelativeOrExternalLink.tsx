import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

type RelativeOrExternalLinkProps = {
  to: string;
};

const RelativeOrExternalLink: FunctionComponent<RelativeOrExternalLinkProps> = ({
  children,
  to,
  ...other
}) => {
  // This assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = /getpackup.com/.test(to) || /^\/(?!\/)/.test(to);
  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <Link to={to} {...other}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to} {...other}>
      {children}
    </a>
  );
};
export default RelativeOrExternalLink;
