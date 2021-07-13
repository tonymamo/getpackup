import React, { Children, FunctionComponent, memo } from 'react';
import { Router, RouteComponentProps } from '@reach/router';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { FaChevronRight } from 'react-icons/fa';

import { halfSpacer } from '@styles/size';
import { fontSizeSmall } from '@styles/typography';

type CrumbProps = {
  url: string;
  text: string;
  style?: any;
};

const Crumb: FunctionComponent<RouteComponentProps & CrumbProps> = memo((props) => {
  const shouldRenderCrumb = !props.location?.pathname.endsWith(props.path || '');
  const hasChildren = Children.count(props.children) > 0;

  return (
    <>
      {hasChildren && <Link to={props.url}>{props.text}</Link>}
      {shouldRenderCrumb && hasChildren && (
        <>
          <FaChevronRight style={{ margin: `0 ${halfSpacer}` }} />
          {props.children}
        </>
      )}
      {!hasChildren && <span>{props.text}</span>}
    </>
  );
});

Crumb.displayName = 'Crumb';

const BreadcrumbsWrapper = styled.div`
  margin-right: ${halfSpacer};
  text-transform: uppercase;
  font-size: ${fontSizeSmall};
  & a,
  & span {
    font-weight: bold;
  }

  & div {
    display: inline;
  }
`;

type BreadcrumbsProps = {
  tripName?: string;
};

const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = memo((props) => {
  return (
    <BreadcrumbsWrapper>
      <Router primary={false} basepath="/app">
        <Crumb path="/trips" url="/app/trips" text="All Trips">
          <Crumb path="/new" url="../" text="New" />
          <Crumb path="/:id" url="../" text={props.tripName || 'Trip'}>
            <Crumb path="/details" url="../" text="Details" />
            <Crumb path="/party" url="../" text="party" />
          </Crumb>
        </Crumb>
        <Crumb path="/profile/*" url="/app/profile" text="Profile" />
      </Router>
      <div style={{ clear: 'both' }} />
    </BreadcrumbsWrapper>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
