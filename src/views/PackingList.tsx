import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
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
import { UserType } from '@common/user';
import getSafeAreaInset from '@utils/getSafeAreaInset';
import { fontSizeH5 } from '@styles/typography';
import trackEvent from '@utils/trackEvent';
import { zIndexNavbar } from '@styles/layers';
import PackingListFilters from '@components/PackingListFilters';
import groupPackingList from '@utils/groupPackingList';

type PackingListProps = {
  trip?: TripType;
  loggedInUser?: UserType;
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
  loggedInUser,
  packingList,
  tripId,
  tripIsLoaded,
}) => {

  const [tabIndex, setTabIndex] = useState(0);
  const [groupCategories, setGroupCategories] = useState<[string, PackingListItemType[]][]>([]);

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

  useEffect(() => {
    if (packingList?.length) {
      setGroupCategories(groupPackingList(packingList));
    }
  }, [packingList]);

  // we only need tabs if there are shared items, so hide if not
  const sharedTrip = trip && trip.tripMembers.length > 0;

  if (tripIsLoaded && !trip) {
    return null;
  }

  if (tripIsLoaded && packingList.length === 0) {
    navigate(`${trip?.tripId}/generator`);
  }

  return (
    <>
      <TripHeader trip={trip} loggedInUser={loggedInUser} />
      <StickyWrapper ref={stickyRef}>
        {sharedTrip && (
          <Tabs isSticky={isSticky}>
            <Tab
              active={tabIndex === 0}
              onClick={() => {
                setTabIndex(0);
                trackEvent('Personal Checklist Tab Clicked');
              }}
            >
              <FaRegCheckSquare title="Personal Checklist" />
            </Tab>
            <Tab
              active={tabIndex === 1}
              onClick={() => {
                setTabIndex(1);
                trackEvent('Shared Checklist Tab Clicked');
              }}
            >
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
            <PackingListFilters
              list={packingList}
              sendFilteredList={(list) => setGroupCategories(groupPackingList(list))}
            />
            {tabIndex === 0 && (
              <>
                {sharedTrip && groupCategories.length > 0 && (
                  <Heading as="h4" altStyle uppercase>
                    Personal Items
                  </Heading>
                )}
                {!groupCategories.length ? <p>No results. Please reset filter.</p> : groupCategories.map(
                  ([categoryName, packingListItems]: [string, PackingListItemType[]]) => {
                    const sortedItems = packingListItems?.sort((a, b) => {
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

                    return (
                      <PackingListCategory
                        trip={trip}
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
          <PackingListCategory categoryName="" sortedItems={[]} tripId="" />
        )}
      </div>
    </>
  );
};

export default PackingList;
