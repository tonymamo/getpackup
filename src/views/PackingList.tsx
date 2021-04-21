import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import lodash from 'lodash';
import { RouteComponentProps } from '@reach/router';
import styled from 'styled-components';
import { FaRegCheckSquare, FaUsers } from 'react-icons/fa';

import { brandPrimary, textColor, white } from '@styles/color';
import {
  baseSpacer,
  breakpoints,
  halfSpacer,
  quadrupleSpacer,
  threeQuarterSpacer,
} from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import { Alert, Box, Heading, PackingListCategory, TripCard } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import getSafeAreaInset from '@utils/getSafeAreaInset';
import { fontSizeH5 } from '@styles/typography';

type PackingListProps = {
  trip?: TripType;
  loggedInUser?: UserType;
  tripId: string;
  packingList: PackingListItemType[];
} & RouteComponentProps;

const StickyWrapper = styled.div`
  border-top: ${baseBorderStyle};
  position: relative;
  margin: 0 -${halfSpacer};
  @media only screen and (min-width: ${breakpoints.sm}) {
    /* match values from PageContainer which increase on viewports above breakpoint.sm */
    margin: 0 -${baseSpacer};
  }
`;

const Tabs = styled.div`
  background-color: ${white};
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: ${baseBorderStyle};
  left: 0;
  right: 0;

  ${(props: { isSticky: boolean }) =>
    props.isSticky &&
    `
  position: fixed;
  z-index: 1;
  top: calc(${quadrupleSpacer} + env(safe-area-inset-top));
  `}
`;

const Tab = styled.div`
  transition: all 0.2s ease-in-out;
  flex: 1;
  text-align: center;
  border-bottom: 2px solid;
  border-bottom-color: ${(props: { active: boolean }) =>
    props.active ? brandPrimary : 'transparent'};
  cursor: pointer;
  font-size: ${fontSizeH5};
  color: ${(props) => (props.active ? brandPrimary : textColor)};
  display: block;
  padding: ${threeQuarterSpacer} ${baseSpacer};
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

  const [tabIndex, setTabIndex] = useState(0);

  // TODO: extract all of the sticky header stuff out to its own reusable hook
  const [isSticky, setSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  // 64 is height of navbar, plus grab the safe-area-top (sat) from :root css
  const navbarHeightWithSafeAreaOffset = 64 + getSafeAreaInset('--sat');

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef && stickyRef.current) {
        setSticky(stickyRef.current.getBoundingClientRect().top <= navbarHeightWithSafeAreaOffset);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, [stickyRef, setSticky]);

  // we only need tabs if there are shared items, so hide if not
  const sharedTrip = trip && trip.tripMembers.length > 0;

  return (
    <>
      <TripCard trip={trip} loggedInUser={loggedInUser} showTags />
      <StickyWrapper ref={stickyRef}>
        {sharedTrip && (
          <Tabs isSticky={isSticky}>
            <Tab active={tabIndex === 0} onClick={() => setTabIndex(0)}>
              <FaRegCheckSquare title="Personal Checklist" />
            </Tab>
            <Tab active={tabIndex === 1} onClick={() => setTabIndex(1)}>
              <FaUsers title="Shared Checklist" />
            </Tab>
          </Tabs>
        )}
      </StickyWrapper>
      <div
        style={{ paddingTop: isSticky && sharedTrip ? navbarHeightWithSafeAreaOffset : baseSpacer }}
      >
        {trip ? (
          <>
            {tabIndex === 0 && (
              <>
                {sharedTrip && (
                  <Heading as="h4" altStyle uppercase>
                    Personal Items
                  </Heading>
                )}
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
              </>
            )}
            {tabIndex === 1 && sharedTrip && (
              <>
                <Heading as="h4" altStyle uppercase>
                  Shared Items
                </Heading>
                <Box>
                  <Alert type="info" message="Shared trip items coming soon!" />
                  <p>
                    Here you will be able to divide up items and assign roles to who is bringing
                    what.
                  </p>
                </Box>
              </>
            )}
          </>
        ) : (
          // Loading state
          <PackingListCategory categoryName="categoryLoading" sortedItems={[]} tripId="" />
        )}
      </div>
    </>
  );
};

export default PackingList;
