import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { FaMapMarkerAlt, FaCalendar, FaPencilAlt } from 'react-icons/fa';
import { useFirestoreConnect, useFirebase, isLoaded } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from 'redux-firestore';
import { Link } from 'gatsby';
import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';
import lodash, { isEmpty } from 'lodash';
import Skeleton from 'react-loading-skeleton';

import {
  Heading,
  Seo,
  FlexContainer,
  HorizontalRule,
  PageContainer,
  Avatar,
  Box,
  PackingListItem,
  Pill,
} from '@components';
import { RootState } from '@redux/ducks';
import { TripType, TripMember } from '@common/trip';
import { formattedDateRange, isBeforeToday } from '@utils/dateUtils';
import { brandPrimary, white, textColor } from '@styles/color';
import { baseSpacer, halfSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';

type TripByIdProps = {
  id?: string;
} & RouteComponentProps;

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
  padding: ${baseSpacer};
  border-bottom: 2px solid;
  border-bottom-color: ${(props: { active: boolean; onClick: () => void }) =>
    props.active ? brandPrimary : 'transparent'};
  color: ${(props) => (props.active ? brandPrimary : textColor)};
`;

const SwipeableViewInner = styled.div`
  padding-top: 54px;
`;

const TripById: FunctionComponent<TripByIdProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const activeTripById: Array<TripType> = useSelector(
    (state: RootState) => state.firestore.ordered.activeTripById
  );
  const packingList = useSelector((state: RootState) => state.firestore.ordered.packingList);

  useFirestoreConnect([
    {
      collection: 'trips',
      doc: props.id,
      storeAs: 'activeTripById',
    },
    {
      collection: 'trips',
      doc: props.id,
      subcollections: [{ collection: 'packing-list' }],
      storeAs: 'packingList',
      orderBy: ['category', 'asc'],
    },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [tripMembers, setTripMembers] = useState<TripType['tripMembers']>([]);
  const [tripMembersLoading, setTripMembersLoading] = useState(true);

  const activeTrip: TripType | undefined =
    activeTripById && activeTripById.length > 0 ? activeTripById[0] : undefined;

  const getMatchingUsers = async () => {
    if (activeTrip !== undefined && isLoaded(activeTrip) && activeTrip.tripMembers?.length > 0) {
      const matchingUsers = await firebase
        .firestore()
        .collection('users')
        .where('uid', 'in', activeTrip.tripMembers)
        .get();
      if (!matchingUsers.empty) {
        matchingUsers.forEach((doc) => {
          setTripMembers((arr) => lodash.uniqBy([...arr, doc.data() as TripMember], 'uid'));
          setTripMembersLoading(false);
        });
      }
      if (matchingUsers.empty) {
        setTripMembersLoading(false);
      }
    } else {
      setTripMembersLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded(activeTripById)) {
      getMatchingUsers();
    }
  }, [activeTripById]);

  useEffect(() => {
    return () => {
      dispatch({
        type: actionTypes.CLEAR_DATA,
        preserve: { data: ['loggedInUser', 'trips'], ordered: ['loggedInUser', 'trips'] },
      });
    };
  }, []);

  return (
    <>
      <Seo title={activeTrip?.name || 'Trip Summary'} />

      <Tabs>
        <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Summary
        </Tab>
        <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Pre-Trip
        </Tab>
        <Tab active={activeTab === 2} onClick={() => setActiveTab(2)}>
          Checklist
        </Tab>
      </Tabs>

      {/* {isLoaded(activeTripById) && activeTrip ? ( */}
      <SwipeableViews index={activeTab} onChangeIndex={(i) => setActiveTab(i)} animateHeight>
        <SwipeableViewInner>
          <PageContainer>
            <Box>
              <FlexContainer
                justifyContent="space-between"
                alignItems="flex-start"
                flexWrap="nowrap"
              >
                {activeTrip ? (
                  <Heading as="h3" altStyle>
                    {activeTrip.name}
                  </Heading>
                ) : (
                  <Skeleton width={200} />
                )}
                {activeTrip && !isBeforeToday(activeTrip.endDate.seconds * 1000) && (
                  <div>
                    <Link to={`/app/trips/${activeTrip.tripId}/edit`}>
                      <FaPencilAlt /> Edit
                    </Link>
                  </div>
                )}
              </FlexContainer>
              <HorizontalRule compact />
              {activeTrip ? (
                <p style={{ whiteSpace: 'pre-line' }}>{activeTrip.description}</p>
              ) : (
                <Skeleton count={5} />
              )}
            </Box>
            <Box>
              <FlexContainer justifyContent="flex-start">
                <FaMapMarkerAlt style={{ marginRight: halfSpacer }} />{' '}
                {activeTrip ? activeTrip.startingPoint : <Skeleton width={225} />}
              </FlexContainer>
              <HorizontalRule compact />
              <FlexContainer justifyContent="flex-start">
                <FaCalendar style={{ marginRight: halfSpacer }} />{' '}
                {activeTrip ? (
                  formattedDateRange(
                    activeTrip.startDate.seconds * 1000,
                    activeTrip.endDate.seconds * 1000
                  )
                ) : (
                  <Skeleton width={200} />
                )}
              </FlexContainer>
              <HorizontalRule compact />
              {activeTrip && activeTrip.tags && activeTrip.tags.length ? (
                <ul style={{ margin: '0 0 0 -4px', padding: 0 }}>
                  {activeTrip.tags.map((tag: string) => (
                    <Pill
                      key={`${tag}tag`}
                      // TODO: link to tags
                      // to={`/search/tags/${tag.replace(' ', '-')}`}
                      text={tag}
                    />
                  ))}
                </ul>
              ) : (
                <FlexContainer justifyContent="flex-start">
                  {/* Generate some tag placeholders and make widths dynamic with Math */}
                  {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((i) => (
                    <Skeleton
                      key={i}
                      // random widths between 48 and 128
                      width={Math.floor(Math.random() * (128 - 48 + 1) + 48)}
                      style={{ marginRight: halfSpacer }}
                    />
                  ))}
                </FlexContainer>
              )}
            </Box>

            <Box>
              <Heading as="h4" altStyle>
                Trip Party
              </Heading>
              {!tripMembersLoading ? (
                <>
                  {activeTrip && tripMembers.length === 0 && 'no party members'}
                  {activeTrip &&
                    tripMembers.length > 0 &&
                    tripMembers.map((member, index) => (
                      <Fragment key={member.uid}>
                        <FlexContainer justifyContent="flex-start">
                          <Avatar src={member.photoURL} gravatarEmail={member.email} rightMargin />
                          <span>{member.displayName}</span>
                        </FlexContainer>
                        {index !== tripMembers.length - 1 && <HorizontalRule compact />}
                      </Fragment>
                    ))}
                </>
              ) : (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Fragment key={i}>
                      <FlexContainer justifyContent="flex-start">
                        <Skeleton circle height={32} width={32} />
                        <Skeleton count={1} width={200} style={{ marginLeft: 16 }} />
                      </FlexContainer>
                      <HorizontalRule compact />
                    </Fragment>
                  ))}
                </>
              )}
            </Box>
          </PageContainer>
        </SwipeableViewInner>

        <SwipeableViewInner>
          {/* TODO: refactor section to new file */}
          <PageContainer>
            <Heading as="h2" altStyle>
              Coming Soon!
            </Heading>
            <p>
              Create a checklist of to-do items to reminder yourself to get permits, camp site
              reservations, charge your batteries, and more...
            </p>
          </PageContainer>
        </SwipeableViewInner>
        <SwipeableViewInner>
          {/* TODO: refactor section to new file */}
          <PageContainer>
            {packingList &&
              packingList.length > 0 &&
              Object.entries(lodash.groupBy(packingList, 'category')).map((category) => (
                <Box key={category[0]}>
                  <Heading as="h3" altStyle>
                    {category[0]}
                  </Heading>
                  <ul style={{ padding: 0, listStyle: 'none' }}>
                    {category[1]
                      .sort((a, b) => {
                        // put essentials at the top, and sort alphabetical
                        if (a.isEssential === b.isEssential) {
                          return a.name.localeCompare(b.name);
                        }
                        return a.isEssential > b.isEssential ? -1 : 1;
                      })
                      .map(
                        (item: {
                          id: string;
                          name: string;
                          isPacked: boolean;
                          category: string;
                          isEssential: boolean;
                        }) => (
                          <PackingListItem key={item.name} tripId={props.id as string} {...item} />
                        )
                      )}
                  </ul>
                </Box>
              ))}
          </PageContainer>
        </SwipeableViewInner>
      </SwipeableViews>

      {isLoaded(activeTripById) && isEmpty(activeTripById) && <p>No trip found</p>}
    </>
  );
};

export default TripById;
