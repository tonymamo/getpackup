import React, { FunctionComponent, useEffect, useState, useRef, useCallback } from 'react';
import groupBy from 'lodash/groupBy';
import { RouteComponentProps, navigate, useLocation } from '@reach/router';
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
import { Alert, Box, Heading, PackingListCategory, TripHeader } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { TripType } from '@common/trip';
import getSafeAreaInset from '@utils/getSafeAreaInset';
import { fontSizeH5 } from '@styles/typography';
import trackEvent from '@utils/trackEvent';
import { zIndexNavbar } from '@styles/layers';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/ducks';
import { getQueryStringParams, mergeQueryParams } from '@utils/queryStringUtils';

type PackingListProps = {
  trip?: TripType;
  tripId: string;
  packingList: PackingListItemType[];
  tripIsLoaded: boolean;
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
  z-index: ${zIndexNavbar};
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
  packingList,
  tripId,
  tripIsLoaded,
}) => {
  const groupedCategories: [string, PackingListItemType[]][] = [];
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const location = useLocation();

  if (packingList?.length) {
    // Filter out the shared items that arent packedBy the current user. This does keep items that are marked shared, but only if they are that user's
    const usersPackingList = packingList.filter(
      (packingListItem: PackingListItemType) =>
        packingListItem &&
        packingListItem.packedBy &&
        packingListItem.packedBy.length > 0 &&
        packingListItem.packedBy.some((item) => item.uid === auth.uid || item.isShared)
    );
    // Then, organize by category and put the pre-trip category first, if it exists
    const entries = Object.entries(groupBy(usersPackingList, 'category'));
    const preTripEntries = entries.find((item) => item[0] === 'Pre-Trip');
    const allOtherEntries = entries.filter((item) => item[0] !== 'Pre-Trip');
    if (preTripEntries) groupedCategories.push(preTripEntries);
    groupedCategories.push(...allOtherEntries);
  }

  type TabOptions = 'personal' | 'shared';

  const { list } = getQueryStringParams(location);
  // index is 1 or 2, and doesn't start as 0 since we are using query params and 0 is falsy
  const [tabIndex, setTabIndex] = useState<TabOptions>((list as TabOptions) || 'personal');

  // TODO: extract all of the sticky header stuff out to its own reusable hook
  const [isSticky, setSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  // 64 is height of navbar, plus grab the safe-area-top (sat) from :root css
  const navbarHeightWithSafeAreaOffset = 64 + getSafeAreaInset('--sat');

  const handleScroll = useCallback(() => {
    if (stickyRef && stickyRef.current) {
      setSticky(stickyRef.current.getBoundingClientRect().top <= navbarHeightWithSafeAreaOffset);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, [stickyRef, setSticky]);

  // we only need tabs if there are shared items, so hide if not
  const sharedTrip = trip && Object.keys(trip.tripMembers).length > 1;

  if (tripIsLoaded && !trip) {
    return null;
  }

  if (tripIsLoaded && packingList.length === 0) {
    navigate(`${trip?.tripId}/generator`);
  }

  const sharedItems = packingList.filter(
    (packingListItem) =>
      packingListItem &&
      packingListItem.packedBy &&
      packingListItem.packedBy.length > 0 &&
      packingListItem.packedBy.some((item) => item.isShared)
  );

  return (
    <>
      <TripHeader trip={trip} />
      <StickyWrapper ref={stickyRef}>
        {sharedTrip && (
          <Tabs isSticky={isSticky}>
            <Tab
              active={tabIndex === 'personal'}
              onClick={() => {
                setTabIndex('personal');
                trackEvent('Personal Checklist Tab Clicked');
                // cant use 0 since it is falsy
                navigate(mergeQueryParams({ list: 'personal' }, location), {
                  replace: true,
                });
              }}
            >
              <FaRegCheckSquare title="Personal Checklist" />
            </Tab>
            <Tab
              active={tabIndex === 'shared'}
              onClick={() => {
                setTabIndex('shared');
                trackEvent('Shared Checklist Tab Clicked');
                navigate(mergeQueryParams({ list: 'shared' }, location), {
                  replace: true,
                });
              }}
            >
              <FaUsers title="Shared Checklist" />
            </Tab>
          </Tabs>
        )}
      </StickyWrapper>
      <div
        style={{
          paddingTop: isSticky && sharedTrip ? navbarHeightWithSafeAreaOffset : baseSpacer,
        }}
      >
        {trip ? (
          <>
            {tabIndex === 'personal' && (
              <>
                {sharedTrip && (
                  <Heading as="h4" altStyle uppercase>
                    Personal Items
                  </Heading>
                )}
                {groupedCategories.map(
                  ([categoryName, packingListItems]: [string, PackingListItemType[]]) => {
                    const sortedItems = packingListItems.sort((a, b) => {
                      if (a.isPacked === b.isPacked) {
                        // sort by name
                        if (a.created.seconds === b.created.seconds) {
                          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                        }

                        // sort by timestamp
                        return b.created.toDate() > a.created.toDate() ? -1 : 1;
                      }
                      // sort by packed status, with checked items last
                      return a.isPacked > b.isPacked ? 1 : -1;
                    });

                    return (
                      <PackingListCategory
                        trip={trip}
                        key={categoryName}
                        categoryName={categoryName}
                        sortedItems={sortedItems}
                        tripId={tripId}
                        isSharedPackingListCategory={false}
                      />
                    );
                  }
                )}
              </>
            )}
            {tabIndex === 'shared' && sharedTrip && (
              <>
                <Heading as="h4" altStyle uppercase>
                  Shared Items
                </Heading>
                {sharedItems && sharedItems.length > 0 ? (
                  <PackingListCategory
                    trip={trip}
                    key="shared"
                    categoryName="shared"
                    sortedItems={sharedItems}
                    tripId={tripId}
                    isSharedPackingListCategory
                  />
                ) : (
                  <Box>
                    <Alert
                      type="info"
                      message="No shared items yet. Add one now by going to your personal list and marking an item as shared by the group!"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        ) : (
          // Loading state
          <PackingListCategory
            categoryName=""
            sortedItems={[]}
            tripId=""
            isSharedPackingListCategory
          />
        )}
      </div>
    </>
  );
};

export default PackingList;
