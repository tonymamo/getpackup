import React, { Fragment, FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Configure,
  PoweredBy,
  connectInfiniteHits,
  connectStateResults,
  connectCurrentRefinements,
  connectSearchBox,
} from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css';
import styled from 'styled-components';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import {
  Alert,
  Box,
  Button,
  FlexContainer,
  HorizontalRule,
  PageContainer,
  Seo,
  UserMediaObject,
  TripNavigation,
} from '@components';
import { TripType } from '@common/trip';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { UserType } from '@common/user';
import { MAX_TRIP_PARTY_SIZE } from '@common/constants';
import { baseSpacer, doubleSpacer, halfSpacer } from '@styles/size';
import Skeleton from 'react-loading-skeleton';
import { baseBorderStyle, z1Shadow } from '@styles/mixins';
import { white } from '@styles/color';
import { sharedStyles } from '@components/Input';
import trackEvent from '@utils/trackEvent';
import { zIndexDropdown } from '@styles/layers';

type TripPartyProps = {
  activeTrip?: TripType;
} & RouteComponentProps;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: ${baseSpacer};
`;

const ScrollableHitsWrapper = styled.div`
  overflow-y: auto;
  max-height: 400px;
  box-shadow: ${z1Shadow};
  position: absolute;
  left: 0;
  right: 0;
  z-index: ${zIndexDropdown};
  padding: ${baseSpacer};
  border: ${baseBorderStyle};
  background-color: ${white};
`;

const StyledSearchBox = styled.input`
  ${sharedStyles};
`;

const TripParty: FunctionComponent<TripPartyProps> = ({ activeTrip }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const users = useSelector((state: RootState) => state.firestore.data.users);

  const firebase = useFirebase();
  const dispatch = useDispatch();

  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID as string,
    process.env.GATSBY_ALGOLIA_SEARCH_API_KEY as string
  );

  const searchClient = {
    search(requests: any) {
      if (requests.every(({ params }: any) => !params.query)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            processingTimeMS: 0,
          })),
        });
      }

      return algoliaClient.search(requests);
    },
  };

  const updateTrip = (memberId: string) => {
    // activeTrip.tripMembers.length + 1 accounts for async data updates
    if (activeTrip?.tripMembers && activeTrip.tripMembers.length + 1 > MAX_TRIP_PARTY_SIZE) {
      dispatch(
        addAlert({
          type: 'danger',
          message: `At this time, Trip Parties are limited to ${MAX_TRIP_PARTY_SIZE} people.`,
        })
      );
      return;
    }
    if (activeTrip) {
      firebase
        .firestore()
        .collection('trips')
        .doc(activeTrip.tripId)
        .update({
          ...activeTrip,
          updated: new Date(),
          tripMembers: [...activeTrip.tripMembers, memberId],
        })
        .then(() => {
          trackEvent('Trip Party Member Added', {
            ...activeTrip,
            updated: new Date(),
            tripMembers: [...activeTrip.tripMembers, memberId],
          });
        })
        .catch((err) => {
          trackEvent('Trip Party Member Add Failure', {
            ...activeTrip,
            userAttemptedToAdd: memberId,
            error: err,
          });
          dispatch(
            addAlert({
              type: 'danger',
              message: err.message,
            })
          );
        });
    }
  };

  const existingTripMember = (uid: string) => activeTrip && activeTrip.tripMembers.includes(uid);

  const InviteButton = ({
    items,
    refine,
    hit,
  }: {
    items: any;
    refine: (val: any) => void;
    hit: UserType;
  }) => (
    <Button
      type="button"
      color="primaryOutline"
      onClick={() => {
        refine(items);
        updateTrip(hit.uid);
      }}
      size="small"
    >
      Add
    </Button>
  );

  const InviteButtonWithClearSearch = connectCurrentRefinements(InviteButton);

  const ClearQueryButton = ({ items, refine }: { items: any; refine: (val: any) => void }) => (
    <p style={{ textAlign: 'center' }}>
      <Button type="button" color="tertiary" onClick={() => refine(items)} size="small">
        Start Over
      </Button>
    </p>
  );

  const ClearRefinementsButton = connectCurrentRefinements(ClearQueryButton);

  const Hit = ({ hit }: { hit: UserType }) => (
    <UserMediaObject
      user={hit}
      avatarSize="sm"
      showSecondaryContent
      action={
        existingTripMember(hit.uid) ? (
          <Button type="button" color="tertiary" size="small" disabled>
            Added
          </Button>
        ) : (
          <InviteButtonWithClearSearch clearsQuery hit={hit} />
        )
      }
    />
  );

  const Results = connectStateResults(
    // extra props are passed in through connectInfiniteHits(Results) down below,
    // but typescript doesnt like it and I can figure out the typing right now :)
    ({ searchResults, isSearchStalled, searching, error, searchState, props }) => {
      const loading = isSearchStalled || searching;
      const hasResults = searchResults && searchResults.nbHits !== 0;
      const hasEmptyQuery =
        !Object.prototype.hasOwnProperty.call(searchState, 'query') || searchState.query === '';

      const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading,
        hasNextPage: props.hasMore,
        onLoadMore() {
          props.refineNext();
        },
      });

      return (
        <ScrollableHitsWrapper ref={rootRef} hidden={hasEmptyQuery}>
          {hasResults && props.hits && props.hits.length >= 1 && props.hits[0] !== undefined && (
            <>
              {props.hits.map((hit: UserType & { objectID: string }) => (
                <Fragment key={hit.objectID}>
                  <Hit hit={hit} />
                  <HorizontalRule compact />
                </Fragment>
              ))}
              {!loading && !props.hasMore && (
                <>
                  <p style={{ textAlign: 'center' }}>
                    No more results found for <strong>{searchState.query}</strong>.
                  </p>
                  <ClearRefinementsButton clearsQuery />
                </>
              )}
              {(loading || props.hasMore) && (
                <div ref={sentryRef}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Fragment key={`loadingListItem${index}`}>
                      <FlexContainer>
                        <Skeleton
                          circle
                          width={doubleSpacer}
                          height={doubleSpacer}
                          style={{ marginRight: halfSpacer }}
                        />
                        <div style={{ flex: 1 }}>
                          <Skeleton height={doubleSpacer} style={{ margin: halfSpacer }} />
                        </div>
                      </FlexContainer>
                      <HorizontalRule compact />
                    </Fragment>
                  ))}
                </div>
              )}
            </>
          )}

          {!loading && error && (
            <Alert type="info" message="Something went wrong, please try again later" />
          )}
          {!loading && !error && !hasResults && !hasEmptyQuery && (
            <>
              <p style={{ textAlign: 'center' }}>
                No results found for <strong>{searchState.query}</strong>.
              </p>
              <ClearRefinementsButton clearsQuery />
            </>
          )}
        </ScrollableHitsWrapper>
      );
    }
  );

  const ConnectedResults = connectInfiniteHits(Results);

  const SearchBox = ({
    currentRefinement,
    refine,
  }: {
    currentRefinement: string;
    refine: (val: string) => void;
  }) => (
    <StyledSearchBox
      type="search"
      value={currentRefinement}
      onChange={(event) => refine(event.currentTarget.value)}
      placeholder="Search by username, email, or real name..."
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  );

  const ConnectedSearchBox = connectSearchBox(SearchBox);

  return (
    <>
      <Seo title="Trip Party" />
      <PageContainer>
        {typeof activeTrip !== 'undefined' && (
          <>
            <TripNavigation activeTrip={activeTrip} />
            <SearchWrapper>
              <InstantSearch
                searchClient={searchClient}
                indexName="Users"
                onSearchStateChange={(searchState) => {
                  trackEvent('Trip Party Search', { query: searchState.query });
                }}
              >
                <Configure hitsPerPage={10} filters={`NOT uid:${auth.uid}`} />
                <ConnectedSearchBox />
                <ConnectedResults />

                <FlexContainer justifyContent="flex-end">
                  <PoweredBy />
                </FlexContainer>
              </InstantSearch>
            </SearchWrapper>

            {activeTrip.tripMembers.length > 0 ? (
              <Box>
                <p>
                  <strong>Trip Party</strong>
                </p>
                <Alert
                  type="info"
                  message="Note: Collaborative trips are coming soon, so Trip Party members will not be notified or see this trip yet on their list of trips."
                />
                <div
                  style={{
                    margin: `${halfSpacer} 0 ${baseSpacer}`,
                  }}
                >
                  {activeTrip.tripMembers.map((tripMember, index) => {
                    const matchingUser: UserType =
                      users && users[tripMember] ? users[tripMember] : undefined;
                    if (!matchingUser) return null;
                    return (
                      <div key={matchingUser.uid}>
                        <UserMediaObject user={matchingUser} showSecondaryContent />
                        {index !== activeTrip.tripMembers.length - 1 && <HorizontalRule compact />}
                      </div>
                    );
                  })}
                </div>
              </Box>
            ) : (
              <Box textAlign="center">
                <p>
                  <strong>No trip party members yet!</strong>
                </p>
                <p>
                  While going alone is definitely rad, if you are going with others, find them above
                  and add them to your trip.
                </p>
              </Box>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
};

export default TripParty;
