import { Link } from 'gatsby';
import React, { FunctionComponent } from 'react';

type RelativeOrExternalLinkProps = {
  to: string;
  onClick?: () => void;
};

const RelativeOrExternalLink: FunctionComponent<RelativeOrExternalLinkProps> = ({
  children,
  to,
  onClick,
  ...other
}) => {
  // This assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = /getpackup.com/.test(to) || /^\/(?!\/)/.test(to);
  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <Link to={to} onClick={onClick} {...other}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to} onClick={onClick} {...other}>
      {children}
    </a>
  );
};
export default RelativeOrExternalLink;
