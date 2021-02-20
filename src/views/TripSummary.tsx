/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, { FunctionComponent, Fragment, useState, useEffect } from 'react';
import lodash from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { FaMapMarkerAlt, FaCalendar, FaEllipsisH } from 'react-icons/fa';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { RouteComponentProps } from '@reach/router';

import { formattedDateRange } from '@utils/dateUtils';
import { Heading, FlexContainer, HorizontalRule, Avatar, Box, Pill, Button } from '@components';
import { halfSpacer } from '@styles/size';
import { UserType } from '@common/user';
import { TripType } from '@common/trip';

type TripSummaryProps = {
  activeTrip?: TripType;
} & RouteComponentProps;

const TripSummary: FunctionComponent<TripSummaryProps> = ({ activeTrip }) => {
  const firebase = useFirebase();

  const [tripMembers, setTripMembers] = useState<UserType[]>([]);
  const [tripMembersLoading, setTripMembersLoading] = useState(true);

  const getMatchingUsers = async () => {
    if (activeTrip !== undefined && isLoaded(activeTrip) && activeTrip.tripMembers?.length > 0) {
      return firebase
        .firestore()
        .collection('users')
        .where('uid', 'in', activeTrip.tripMembers)
        .get();
    }
    return null;
  };

  // In the useEffect we want to get matching users, but an error about cancelling asynchronous
  // tasks was appearing because we are async/awaiting in getMatchingUsers, so instead we
  // set a variable (isFetchingTripMembers) and then use the return in useEffect as a cleanup
  // https://juliangaramendy.dev/blog/use-promise-subscription
  useEffect(() => {
    let isFetchingTripMembers = true;
    getMatchingUsers().then((matchingUsers) => {
      if (isFetchingTripMembers) {
        if (!matchingUsers?.empty) {
          matchingUsers?.forEach((doc) => {
            setTripMembers((arr) => lodash.uniqBy([...arr, doc.data() as UserType], 'uid'));
            setTripMembersLoading(false);
          });
        }
        if (matchingUsers?.empty) {
          setTripMembersLoading(false);
        }
      }
    });
    return () => (isFetchingTripMembers = false);
  }, []);

  return (
    <>
      <Box>
        <FlexContainer justifyContent="space-between" alignItems="flex-start" flexWrap="nowrap">
          {activeTrip ? (
            <Heading as="h3" altStyle noMargin>
              {activeTrip.name}
            </Heading>
          ) : (
            <Skeleton width={200} />
          )}
          {activeTrip && (
            <div>
              <Button type="link" color="text" to={`/app/trips/${activeTrip.tripId}/edit`}>
                {/* TODO: better styling for this */}
                <FaEllipsisH />
              </Button>
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
        <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
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
        <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
          <FaMapMarkerAlt style={{ marginRight: halfSpacer }} />{' '}
          {activeTrip ? activeTrip.startingPoint : <Skeleton width={225} />}
        </FlexContainer>
        <HorizontalRule compact />
        {activeTrip && activeTrip.tags && activeTrip.tags.length ? (
          <>
            {activeTrip.tags.map((tag: string) => (
              <Pill
                key={`${tag}tag`}
                // TODO: link to tags
                // to={`/search/tags/${tag.replace(' ', '-')}`}
                text={tag}
                color="primary"
              />
            ))}
          </>
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
    </>
  );
};

export default TripSummary;
