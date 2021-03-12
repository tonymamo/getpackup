import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { useLocation } from '@reach/router';

import { brandPrimary, white, textColor } from '@styles/color';
import { baseSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';

const Tabs = styled.div`
  margin-top: calc(-${baseSpacer} - 1px);
  background-color: ${white};
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: ${baseBorderStyle};
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
`;

const Tab = styled.div`
  transition: all 0.2s ease-in-out;
  flex: 1;
  text-align: center;
  border-bottom: 2px solid;
  border-bottom-color: ${(props: { active: boolean }) =>
    props.active ? brandPrimary : 'transparent'};
  color: ${(props) => (props.active ? brandPrimary : textColor)};

  & a {
    display: block;
    padding: ${baseSpacer};
  }
`;

type PackingListNavigationProps = { tripId: string };

const PackingListNavigation = ({ tripId }: PackingListNavigationProps) => {
  const { pathname } = useLocation();
  const summaryActive = pathname.includes('summary') || pathname.includes('edit');
  const checklistActive = !summaryActive || pathname.includes('checklist');

  return (
    <Tabs>
      <Tab active={checklistActive}>
        <Link to={`/app/trips/${tripId}`}>Checklist</Link>
      </Tab>
      <Tab active={summaryActive}>
        <Link to={`/app/trips/${tripId}/summary`}>Summary</Link>
      </Tab>
    </Tabs>
  );
};

export const packingListNavigationHeight = 54;
export default PackingListNavigation;
