import React, { FunctionComponent, useState, useEffect } from 'react';

// used to help prevent Flash of Unstyled Content (FOUC) by not rendering anything initially
// when compiled in a Gatsby build, but immediately trigger a re-render with useEffect
// to return the children that are dependent on Javascript or state to render something dynamically
const ClientOnly: FunctionComponent<{}> = (props) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{props.children}</>;
};

export default ClientOnly;
