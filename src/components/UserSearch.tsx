import 'instantsearch.css/themes/satellite.css';

import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import {
  Alert,
  Button,
  FlexContainer,
  HorizontalRule,
  Modal,
  SendInviteForm,
  UserMediaObject,
} from '@components';
import { RootState } from '@redux/ducks';
import { white } from '@styles/color';
import { zIndexDropdown } from '@styles/layers';
import { baseBorderStyle, z1Shadow } from '@styles/mixins';
import { baseSpacer, doubleSpacer, halfSpacer } from '@styles/size';
import alogliaSearch from '@utils/algoliaSearch';
import trackEvent from '@utils/trackEvent';
import React, { Fragment, FunctionComponent, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {
  Configure,
  InstantSearch,
  PoweredBy,
  connectCurrentRefinements,
  connectInfiniteHits,
  connectSearchBox,
  connectStateResults,
} from 'react-instantsearch-dom';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { sharedStyles } from './Input';

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

type UserSearchProps = {
  updateTrip: (uid: string, email: string, greetingName: string) => void;
  activeTrip?: TripType;
  isSearchBarDisabled: boolean;
};

const UserSearch: FunctionComponent<UserSearchProps> = ({
  updateTrip,
  activeTrip,
  isSearchBarDisabled,
}) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const [showManualShareModal, setShowManualShareModal] = useState<boolean>(false);

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
        updateTrip(hit.uid, hit.email, hit.displayName);
        trackEvent('Trip Party Search User Added', {
          hit,
          activeTrip,
        });
      }}
      size="small"
    >
      Add
    </Button>
  );

  const InviteButtonWithClearSearch = connectCurrentRefinements(InviteButton);

  const ClearQueryButton = ({ items, refine }: { items: any; refine: (val: any) => void }) => (
    <p style={{ textAlign: 'center' }}>
      Friend not on Packup yet?{' '}
      <Button
        type="button"
        onClick={() => {
          refine(items);
          setShowManualShareModal(true);
          trackEvent('Send Invite Modal Opened', {
            location: 'Trip Party Search',
            trip: activeTrip || 'new',
          });
        }}
        size="small"
      >
        Send an Invite
      </Button>
    </p>
  );

  const ClearRefinementsButton = connectCurrentRefinements(ClearQueryButton);

  const getActionButton = (hit: UserType) => {
    const matchingUser =
      activeTrip &&
      activeTrip.tripMembers &&
      Object.values(activeTrip.tripMembers).find((member) => member.uid === hit.uid);
    if (matchingUser) {
      return (
        <Button type="button" color="tertiary" size="small" disabled>
          {matchingUser.status}
        </Button>
      );
    }
    return <InviteButtonWithClearSearch clearsQuery hit={hit} />;
  };

  const Hit = ({ hit }: { hit: UserType }) => (
    <UserMediaObject
      user={hit}
      avatarSize="sm"
      showSecondaryContent
      action={getActionButton(hit)}
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
          {true && (
            <>
              {/* 
                toggle display to stop infinite loop caused by hits 
                https://github.com/algolia/react-instantsearch/issues/137#issuecomment-349385276
              */}
              <div style={{ display: searching ? 'none' : 'block' }}>
                {hasResults &&
                  props.hits &&
                  props.hits.length >= 1 &&
                  props.hits[0] !== undefined &&
                  props.hits.map((hit: UserType & { objectID: string }) => (
                    <Fragment key={hit.objectID}>
                      <Hit hit={hit} />
                      <HorizontalRule compact />
                    </Fragment>
                  ))}
              </div>
              {!loading && !props.hasMore && hasResults && (
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
      disabled={isSearchBarDisabled}
    />
  );

  const ConnectedSearchBox = connectSearchBox(SearchBox);

  return (
    <>
      <Modal isOpen={showManualShareModal} toggleModal={() => setShowManualShareModal(false)}>
        <SendInviteForm />
      </Modal>
      <SearchWrapper>
        <InstantSearch
          searchClient={alogliaSearch}
          indexName="Users"
          onSearchStateChange={(searchState) => {
            trackEvent('Trip Party Search', { query: searchState.query });
          }}
        >
          <Configure hitsPerPage={10} filters={`NOT uid:${auth.uid}`} />
          <ConnectedSearchBox />
          <ConnectedResults />

          <FlexContainer justifyContent="flex-end" as="small">
            <PoweredBy />
          </FlexContainer>
        </InstantSearch>
      </SearchWrapper>
    </>
  );
};

export default UserSearch;
