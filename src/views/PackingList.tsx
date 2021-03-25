import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import lodash from 'lodash';
import { RouteComponentProps } from '@reach/router';
import styled from 'styled-components';
import { Link } from 'gatsby';

import { brandPrimary, offWhite, textColor } from '@styles/color';
import { baseSpacer, quadrupleSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import { PackingListCategory, TripCard } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import getSafeAreaInset from '@utils/getSafeAreaInset';

type PackingListProps = {
  trip: TripType;
  loggedInUser?: UserType;
  tripId: string;
  packingList: PackingListItemType[];
} & RouteComponentProps;

const StickyWrapper = styled.div`
  position: relative;
  margin: 0 -${baseSpacer};
`;

const Tabs = styled.div`
  background-color: ${offWhite};
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: ${baseBorderStyle};
  ${(props: { isSticky: boolean }) =>
    props.isSticky &&
    `
  position: fixed;
  z-index: 1;
  top: calc(${quadrupleSpacer} + env(safe-area-inset-top));
  left: 0;
  right: 0;`}
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

const PackingList: FunctionComponent<PackingListProps> = ({
  trip,
  loggedInUser,
  packingList,
  tripId,
}) => {
  const groupedCategories: [string, PackingListItemType[]][] = [];

  if (packingList?.length) {
    // Put the pre-trip category first, if it exists
    const entries = Object.entries(lodash.groupBy(packingList, 'category'));
    const preTripEntries = entries.find((item) => item[0] === 'Pre-Trip');
    const allOtherEntries = entries.filter((item) => item[0] !== 'Pre-Trip');
    if (preTripEntries) groupedCategories.push(preTripEntries);
    groupedCategories.push(...allOtherEntries);
  }

  const [isSticky, setSticky] = useState(false);

  const stickyRef = useRef<HTMLDivElement>(null);

  // 64 is height of navbar, plus grab the safe-area-top (sat) from :root css
  const navbarHeightWithSafeAreaOffset = 64 + getSafeAreaInset('--sat');

  const handleScroll = () => {
    if (stickyRef && stickyRef.current) {
      setSticky(stickyRef.current.getBoundingClientRect().top <= navbarHeightWithSafeAreaOffset);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  return (
    <>
      <TripCard trip={trip} loggedInUser={loggedInUser} showTags />
      <StickyWrapper ref={stickyRef}>
        <Tabs isSticky={isSticky}>
          <Tab active>
            <Link to={`/app/trips/${tripId}`}>Checklist</Link>
          </Tab>
          <Tab active={false}>
            <Link to={`/app/trips/${tripId}/summary`}>Summary</Link>
          </Tab>
        </Tabs>
      </StickyWrapper>
      <div style={{ paddingTop: isSticky ? navbarHeightWithSafeAreaOffset : baseSpacer }}>
        {groupedCategories.map(
          ([categoryName, packingListItems]: [string, PackingListItemType[]]) => {
            const sortedItems = packingListItems.sort((a, b) => {
              // put essentials at the top, and sort by created timestamp (newest goes last)
              if (!a.isEssential && !b.isEssential) {
                if (a.created.seconds === b.created.seconds) {
                  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                }
                return b.created.toDate() > a.created.toDate() ? -1 : 1;
              }
              return a.isEssential > b.isEssential ? -1 : 1;
            });

            return (
              <PackingListCategory
                key={categoryName}
                categoryName={categoryName}
                sortedItems={sortedItems}
                tripId={tripId}
              />
            );
          }
        )}
      </div>
    </>
  );
};

export default PackingList;
