import React, { FunctionComponent, useEffect, useState, useRef, useCallback } from 'react';
import { RouteComponentProps, navigate, useLocation } from '@reach/router';
import styled from 'styled-components';
import { FaRegCheckSquare, FaUsers } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { brandPrimary, textColor, white } from '@styles/color';
import {
  baseSpacer,
  breakpoints,
  halfSpacer,
  quadrupleSpacer,
  threeQuarterSpacer,
} from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import { Box, Button, Heading, PackingListCategory, TripHeader } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { TripType } from '@common/trip';
import getSafeAreaInset from '@utils/getSafeAreaInset';
import { fontSizeH5 } from '@styles/typography';
import trackEvent from '@utils/trackEvent';
import { zIndexNavbar } from '@styles/layers';
import { RootState } from '@redux/ducks';
import { getQueryStringParams, mergeQueryParams } from '@utils/queryStringUtils';
import PackingListFilters from '@components/PackingListFilters';
import groupPackingList from '@utils/groupPackingList';
import { PackingListFilterOptions, TabOptions } from '@utils/enums';

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
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const location = useLocation();
  const { list, filter } = getQueryStringParams(location);

  //
  // Filters stuff
  //
  const [activeFilter, setActiveFilter] = useState<PackingListFilterOptions>(
    (filter as PackingListFilterOptions) || PackingListFilterOptions.All
  );

  //
  // Tab stuff
  //
  const [tabIndex, setTabIndex] = useState<TabOptions>((list as TabOptions) || 'Personal');

  // we only need tabs if there are shared items, so hide if not
  const sharedTrip = trip && Object.keys(trip.tripMembers).length > 1;

  const handleTabClick = (tab: TabOptions) => {
    setTabIndex(tab);
    setActiveFilter(PackingListFilterOptions.All);
    trackEvent(`${tab} Checklist Tab Clicked`);
    navigate(mergeQueryParams({ list: tab, filter: PackingListFilterOptions.All }, location), {
      replace: true,
    });
  };

  //
  // Sticky Header stuff
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

  //
  // Personal vs Shared list
  //
  const personalItems = packingList?.sort((a, b) => {
    if (a?.isPacked === b?.isPacked) {
      // sort by name
      if (a?.created?.seconds === b?.created?.seconds) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
      // sort by timestamp
      return b.created.toDate() > a.created.toDate() ? -1 : 1;
    }
    // sort by packed status, with checked items last
    return a.isPacked > b.isPacked ? 1 : -1;
  });

  const sharedItems = packingList?.filter(
    (item) => item.packedBy && item.packedBy.length > 0 && item.packedBy.some((i) => i.isShared)
  );

  // take into account if we are on the personal or shared list
  const items = tabIndex === TabOptions.PERSONAL ? personalItems : sharedItems;

  // take into account if the unpacked or packed filters are selected
  const filteredItems = items.filter((item) =>
    activeFilter === PackingListFilterOptions.Unpacked ? !item.isPacked : item.isPacked
  );
  // if the filter is All, just return all the items
  const finalItems = activeFilter === PackingListFilterOptions.All ? items : filteredItems;

  const getGroupedFinalItems = groupPackingList(finalItems, auth.uid, tabIndex);

  // return out early if trip cant be found
  // todo probably a better loading state thing here?
  if (tripIsLoaded && !trip) {
    return null;
  }

  // navigate to trip gen page if no packing list exists
  if (tripIsLoaded && packingList.length === 0) {
    navigate(`${trip?.tripId}/generator`);
  }

  return (
    <>
      <TripHeader trip={trip} />
      <StickyWrapper ref={stickyRef}>
        {sharedTrip && (
          <Tabs isSticky={isSticky}>
            <Tab
              active={tabIndex === TabOptions.PERSONAL}
              onClick={() => handleTabClick(TabOptions.PERSONAL)}
            >
              <FaRegCheckSquare title="Personal Checklist" />
            </Tab>
            <Tab
              active={tabIndex === TabOptions.SHARED}
              onClick={() => handleTabClick(TabOptions.SHARED)}
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
            <Heading as="h4" altStyle uppercase>
              {tabIndex === TabOptions.PERSONAL ? TabOptions.PERSONAL : TabOptions.SHARED}
            </Heading>
            <PackingListFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              disabled={!trip}
              location={location}
            />

            {getGroupedFinalItems.length > 0 && getGroupedFinalItems[0] !== undefined ? (
              getGroupedFinalItems.map(
                ([categoryName, packingListItems]: [string, PackingListItemType[]]) => {
                  if (categoryName && packingListItems.length > 0) {
                    return (
                      <PackingListCategory
                        trip={trip}
                        key={categoryName}
                        categoryName={categoryName}
                        sortedItems={packingListItems}
                        tripId={tripId}
                        isSharedPackingListCategory={false}
                        auth={auth}
                      />
                    );
                  }
                  return null;
                }
              )
            ) : (
              <Box largePadding>
                <Heading as="h3" align="center">
                  Nothing to see here 👀
                </Heading>
                <p style={{ textAlign: 'center' }}>
                  Try changing your filters from{' '}
                  <strong>
                    {activeFilter === PackingListFilterOptions.Packed
                      ? PackingListFilterOptions.Packed
                      : PackingListFilterOptions.Unpacked}
                  </strong>{' '}
                  to{' '}
                  <Button
                    type="button"
                    color="tertiary"
                    size="small"
                    onClick={() =>
                      setActiveFilter(
                        activeFilter === PackingListFilterOptions.Packed
                          ? PackingListFilterOptions.Unpacked
                          : PackingListFilterOptions.Packed
                      )
                    }
                  >
                    {activeFilter === PackingListFilterOptions.Packed
                      ? PackingListFilterOptions.Unpacked
                      : PackingListFilterOptions.Packed}
                  </Button>{' '}
                  or{' '}
                  <Button
                    type="button"
                    color="tertiary"
                    size="small"
                    onClick={() => setActiveFilter(PackingListFilterOptions.All)}
                  >
                    All
                  </Button>
                </p>
              </Box>
            )}

            {/* {packingListLoaded ? (
              <>
                {// can sometimes get an array of [undefined] while its being set so check for that here
                groupCategories.length === 0 || groupCategories[0] === undefined ? (
                  <Box>
                    <Heading as="h3" align="center">
                      Nothing to see here 👀
                    </Heading>
                    <p style={{ textAlign: 'center' }}>Try changing your filters!</p>
                  </Box>
                ) : (
                  groupCategories &&
                  groupCategories.length > 0 &&
                  // can sometimes get an array of [undefined] while its being set so check for that here
                  groupCategories.map(
                    ([categoryName, packingListItems]: [string, PackingListItemType[]]) => {
                      // const personalItems = packingListItems?.sort((a, b) => {
                      //   if (a?.isPacked === b?.isPacked) {
                      //     // sort by name
                      //     if (a?.created?.seconds === b?.created?.seconds) {
                      //       return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                      //     }
                      //     // sort by timestamp
                      //     return b.created.toDate() > a.created.toDate() ? -1 : 1;
                      //   }
                      //   // sort by packed status, with checked items last
                      //   return a.isPacked > b.isPacked ? 1 : -1;
                      // });
                      // const sharedItems = packingListItems?.filter(
                      //   (item) =>
                      //     item.packedBy &&
                      //     item.packedBy.length > 0 &&
                      //     item.packedBy.some((i) => i.isShared)
                      // );

                      // take into account if we are on the personal or shared list
                      const items = tabIndex === TabOptions.PERSONAL ? personalItems : sharedItems;

                      // take into account if the unpacked or packed filters are selected
                      const filteredItems = items.filter((item) =>
                        activeFilter === PackingListFilterOptions.Unpacked
                          ? !item.isPacked
                          : item.isPacked
                      );
                      // if the filter is All, just return all the items
                      const finalItems =
                        activeFilter === PackingListFilterOptions.All ? items : filteredItems;

                      return finalItems.length > 0 ? (
                        <PackingListCategory
                          trip={trip}
                          key={categoryName}
                          categoryName={categoryName}
                          sortedItems={finalItems}
                          tripId={tripId}
                          isSharedPackingListCategory={false}
                          auth={auth}
                        />
                      ) : null;
                    }
                  )
                )}
              </>
            ) : (
              // Loading state
              <>
                this one?
                <PackingListCategory
                  categoryName=""
                  sortedItems={[]}
                  tripId=""
                  isSharedPackingListCategory
                />
              </>
            )} */}
          </>
        ) : (
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
