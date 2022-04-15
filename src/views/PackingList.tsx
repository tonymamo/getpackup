import React, { FunctionComponent, useEffect, useState, useRef, useCallback } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import styled from 'styled-components';
import { FaRegCheckSquare, FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { brandPrimary, textColor, white, brandSuccess } from '@styles/color';
import {
  baseSpacer,
  breakpoints,
  halfSpacer,
  quadrupleSpacer,
  threeQuarterSpacer,
} from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import { Box, Button, Heading, PackingListCategory, TripHeader, ProgressBar } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { TripType } from '@common/trip';
import getSafeAreaInset from '@utils/getSafeAreaInset';
import { fontSizeH5 } from '@styles/typography';
import trackEvent from '@utils/trackEvent';
import { zIndexNavbar } from '@styles/layers';
import { RootState } from '@redux/ducks';
import PackingListFilters from '@components/PackingListFilters';
import groupPackingList from '@utils/groupPackingList';
import { PackingListFilterOptions, TabOptions } from '@utils/enums';
import { setActivePackingListFilter, setActivePackingListTab } from '@redux/ducks/client';

type PackingListProps = {
  trip?: TripType;
  tripId: string;
  packingList: PackingListItemType[];
  tripIsLoaded: boolean;
} & RouteComponentProps;

const StickyWrapper = styled.div`
  position: relative;
  margin: 0 -${halfSpacer};
  @media only screen and (min-width: ${breakpoints.sm}) {
    /* match values from PageContainer which increase on viewports above breakpoint.sm */
    margin: 0 -${baseSpacer};
  }
`;

const StickyInner = styled.div`
  left: 0;
  right: 0;
  max-width: ${breakpoints.xl};
  margin: 0 auto;
  ${(props: { isSticky: boolean }) =>
    props.isSticky &&
    `
  position: fixed;
  z-index: ${zIndexNavbar};
  top: calc(${quadrupleSpacer} + env(safe-area-inset-top));
  `}
`;

const Tabs = styled.div`
  background-color: ${white};
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: ${baseBorderStyle};
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
  const gearList = useSelector((state: RootState) => state.firestore.data.packingList);
  const { activePackingListFilter, activePackingListTab } = useSelector(
    (state: RootState) => state.client
  );
  const dispatch = useDispatch();

  const gearListArray: PackingListItemType[] = gearList ? Object.values(gearList) : [];
  const [packedPercent, setPackedPercent] = useState(0);

  const packedItemsLength =
    gearListArray.length > 0 ? gearListArray.filter((item) => item?.isPacked === true).length : 0;

  useEffect(() => {
    if (gearListArray.length > 0 && packedItemsLength) {
      setPackedPercent(Number(((packedItemsLength / gearListArray.length) * 100).toFixed(0)));
    }
  }, [gearListArray, packedItemsLength]);

  // we only need tabs if there are shared items, so hide if not
  const sharedTrip = trip && Object.keys(trip.tripMembers).length > 1;

  const handleTabClick = (tab: TabOptions) => {
    dispatch(setActivePackingListTab(tab));
    dispatch(setActivePackingListFilter(PackingListFilterOptions.All));
    trackEvent(`${tab} Checklist Tab Clicked`);
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

  const packingListCopy = [...packingList];

  //
  // Personal vs Shared list
  //
  const personalItems =
    packingListCopy &&
    packingListCopy.length > 0 &&
    packingListCopy?.sort((a, b) => {
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

  const sharedItems =
    packingListCopy &&
    packingListCopy.length > 0 &&
    packingListCopy?.filter(
      (item) => item.packedBy && item.packedBy.length > 0 && item.packedBy.some((i) => i.isShared)
    );

  // take into account if we are on the personal or shared list
  const items = activePackingListTab === TabOptions.Personal ? personalItems : sharedItems;

  // take into account if the unpacked or packed filters are selected
  const filteredItems =
    items &&
    items.length > 0 &&
    items.filter((item) =>
      activePackingListFilter === PackingListFilterOptions.Unpacked ? !item.isPacked : item.isPacked
    );
  // if the filter is All, just return all the items
  const finalItems =
    activePackingListFilter === PackingListFilterOptions.All ? items : filteredItems;

  const getGroupedFinalItems =
    finalItems && finalItems.length > 0
      ? groupPackingList(finalItems, auth.uid, activePackingListTab)
      : [];

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
      <small style={{ textAlign: 'center', display: 'block' }}>{packedPercent}% packed</small>
      <StickyWrapper ref={stickyRef}>
        <StickyInner isSticky={isSticky}>
          <ProgressBar
            height={halfSpacer}
            borderRadius={0}
            completed={packedPercent}
            isLabelVisible={false}
            bgColor={brandSuccess}
            transitionDuration="0.25s"
          />

          {sharedTrip && (
            <Tabs>
              <Tab
                active={activePackingListTab === TabOptions.Personal}
                onClick={() => handleTabClick(TabOptions.Personal)}
              >
                <FaRegCheckSquare title="Personal Checklist" />
              </Tab>
              <Tab
                active={activePackingListTab === TabOptions.Shared}
                onClick={() => handleTabClick(TabOptions.Shared)}
              >
                <FaUsers title="Shared Checklist" />
              </Tab>
            </Tabs>
          )}
        </StickyInner>
      </StickyWrapper>
      <div
        style={{
          paddingTop: isSticky && sharedTrip ? navbarHeightWithSafeAreaOffset : baseSpacer,
        }}
      >
        {trip ? (
          <>
            {sharedTrip ? (
              <Heading as="h4" altStyle uppercase>
                {activePackingListTab === TabOptions.Personal
                  ? TabOptions.Personal
                  : TabOptions.Shared}
              </Heading>
            ) : null}

            <PackingListFilters
              activeFilter={activePackingListFilter}
              onFilterChange={setActivePackingListFilter}
              disabled={!trip}
            />

            {getGroupedFinalItems &&
            getGroupedFinalItems.length > 0 &&
            getGroupedFinalItems[0] !== undefined ? (
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
                        isSharedPackingListCategory={activePackingListTab === TabOptions.Shared}
                        auth={auth}
                        isSharedTrip={sharedTrip}
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
                {activePackingListFilter === PackingListFilterOptions.All ? (
                  <p style={{ textAlign: 'center' }}>
                    {activePackingListTab === TabOptions.Shared
                      ? "No items have been marked as a shared group item yet. Didn't you learn to share as a kid!? Sharing is caring ☺️"
                      : 'Something went wrong, please refresh the page to try loading your packing list again.'}
                  </p>
                ) : (
                  <p style={{ textAlign: 'center' }}>
                    Try changing your filters from{' '}
                    <strong>
                      {activePackingListFilter === PackingListFilterOptions.Packed
                        ? PackingListFilterOptions.Packed
                        : PackingListFilterOptions.Unpacked}
                    </strong>{' '}
                    to{' '}
                    <Button
                      type="button"
                      color="tertiary"
                      size="small"
                      onClick={() =>
                        dispatch(
                          setActivePackingListFilter(
                            activePackingListFilter === PackingListFilterOptions.Packed
                              ? PackingListFilterOptions.Unpacked
                              : PackingListFilterOptions.Packed
                          )
                        )
                      }
                    >
                      {activePackingListFilter === PackingListFilterOptions.Packed
                        ? PackingListFilterOptions.Unpacked
                        : PackingListFilterOptions.Packed}
                    </Button>{' '}
                    or{' '}
                    <Button
                      type="button"
                      color="tertiary"
                      size="small"
                      onClick={() =>
                        dispatch(setActivePackingListFilter(PackingListFilterOptions.All))
                      }
                    >
                      All
                    </Button>
                  </p>
                )}
              </Box>
            )}
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
