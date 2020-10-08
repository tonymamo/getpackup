import React, { Children, FunctionComponent, memo } from 'react';
import { Router, RouteComponentProps } from '@reach/router';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { FaChevronRight } from 'react-icons/fa';

import { halfSpacer } from '../styles/size';

type BreadCrumbsProps = {
  url: string;
  text: string;
  style?: any;
};

const Bread: FunctionComponent<RouteComponentProps & BreadCrumbsProps> = memo((props) => {
  const shouldRenderCrumb = !props.location?.pathname.endsWith(props.path || '');
  const hasChildren = Children.count(props.children) > 0;

  return (
    <>
      {hasChildren && (
        <div style={{ float: 'left' }}>
          <Link to={props.url}>{props.text}</Link>
        </div>
      )}
      {shouldRenderCrumb && hasChildren && (
        <div style={{ float: 'left' }}>
          <div style={{ float: 'left', padding: `0 ${halfSpacer}` }}>
            <FaChevronRight />
          </div>
          <div style={{ float: 'left' }}>{props.children}</div>
        </div>
      )}
      {!hasChildren && props.text}
    </>
  );
});

Bread.displayName = 'Bread';

const BreadCrumbsWrapper = styled.div`
  margin: ${halfSpacer} 0;
`;

const BreadCrumbs: FunctionComponent<{}> = memo(() => {
  return (
    <BreadCrumbsWrapper>
      <Router primary={false} basepath="/app">
        <Bread path="/trips" url="/app/trips" text="Trips">
          <Bread path="/new" url="../" text="New" />
          <Bread path="/:id" url="../" text="Trip">
            <Bread path="/edit" url="../" text="Edit" />
          </Bread>
        </Bread>
        <Bread path="/profile/*" url="/app/profile" text="Profile" />
      </Router>
      <div style={{ clear: 'both' }} />
    </BreadCrumbsWrapper>
  );
});

BreadCrumbs.displayName = 'BreadCrumbs';

export default BreadCrumbs;
