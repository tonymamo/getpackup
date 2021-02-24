import React, { FunctionComponent, Fragment } from 'react';
import Skeleton from 'react-loading-skeleton';
import { FaMapMarkerAlt, FaCalendar, FaPencilAlt } from 'react-icons/fa';
import { RouteComponentProps } from '@reach/router';
import { useSelector } from 'react-redux';

import { formattedDateRange } from '@utils/dateUtils';
import {
  Heading,
  FlexContainer,
  HorizontalRule,
  Avatar,
  Box,
  Pill,
  Button,
  DropdownMenu,
} from '@components';
import { halfSpacer } from '@styles/size';
import { TripType } from '@common/trip';
import { RootState } from '@redux/ducks';
import { UserType } from '@common/user';

type TripSummaryProps = {
  activeTrip?: TripType;
} & RouteComponentProps;

const TripSummary: FunctionComponent<TripSummaryProps> = ({ activeTrip }) => {
  const users = useSelector((state: RootState) => state.firestore.data.users);

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
            <DropdownMenu>
              <Button
                type="link"
                color="text"
                to={`/app/trips/${activeTrip.tripId}/edit`}
                iconLeft={<FaPencilAlt />}
                block
              >
                Edit
              </Button>
            </DropdownMenu>
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

      {activeTrip && activeTrip.tripMembers.length > 0 && (
        <Box>
          <Heading as="h4" altStyle>
            Trip Party
          </Heading>

          {activeTrip &&
            activeTrip.tripMembers.length > 0 &&
            activeTrip.tripMembers.map((tripMember, index) => {
              const matchingUser: UserType =
                users && users[tripMember] ? users[tripMember] : undefined;
              if (!matchingUser) return null;
              return (
                <Fragment key={matchingUser.uid}>
                  <FlexContainer justifyContent="flex-start">
                    <Avatar
                      src={matchingUser.photoURL}
                      gravatarEmail={matchingUser.email}
                      rightMargin
                    />
                    <span>{matchingUser.displayName}</span>
                  </FlexContainer>
                  {index !== activeTrip.tripMembers.length - 1 && <HorizontalRule compact />}
                </Fragment>
              );
            })}
        </Box>
      )}
    </>
  );
};

export default TripSummary;
