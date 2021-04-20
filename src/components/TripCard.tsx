import React, { FunctionComponent, useState } from 'react';
import {
  FaRegCalendar,
  FaMapMarkerAlt,
  FaTrash,
  FaChevronLeft,
  FaInfoCircle,
  FaRegCheckSquare,
  FaUsers,
} from 'react-icons/fa';
import TextTruncate from 'react-text-truncate';
import { Link, navigate } from 'gatsby';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { useFirebase } from 'react-redux-firebase';

import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import {
  Heading,
  StackedAvatars,
  Avatar,
  Pill,
  PillWrapper,
  HorizontalRule,
  FlexContainer,
  DropdownMenu,
  Button,
  Row,
  Column,
} from '@components';
import { baseAndAHalfSpacer, baseSpacer, doubleSpacer, halfSpacer } from '@styles/size';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import { RootState } from '@redux/ducks';
import useWindowSize from '@utils/useWindowSize';
import { addAlert } from '@redux/ducks/globalAlerts';
import TripDeleteModal from '@views/TripDeleteModal';
import { fontSizeSmall } from '@styles/typography';

type TripCardProps = {
  trip?: TripType;
  loggedInUser?: UserType;
  showDescription?: boolean;
  showTags?: boolean;
  enableNavigation?: boolean;
};

const StyledTripWrapper = styled.div``;

const StyledBackLink = styled(Link)`
  display: inline-block;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: ${halfSpacer};
  font-size: ${fontSizeSmall};
`;

const StyledLineItem = styled.div`
  margin-bottom: ${halfSpacer};
`;

const TripCard: FunctionComponent<TripCardProps> = ({
  trip,
  loggedInUser,
  showDescription,
  showTags,
  enableNavigation,
}) => {
  const users = useSelector((state: RootState) => state.firestore.data.users);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const firebase = useFirebase();
  const dispatch = useDispatch();
  const size = useWindowSize();

  const numberOfAvatarsToShow = 4;

  const deleteTrip = () => {
    if (trip) {
      firebase
        .firestore()
        .collection('trips')
        .doc(trip.tripId)
        .delete()
        .then(() => {
          navigate('/app/trips');
          dispatch(
            addAlert({
              type: 'success',
              message: 'Successfully deleted trip',
            })
          );
        })
        .catch((err) => {
          dispatch(
            addAlert({
              type: 'danger',
              message: err.message,
            })
          );
        });
    }
  };

  return (
    <StyledTripWrapper>
      {!enableNavigation && !size.isSmallScreen ? (
        <StyledBackLink to="../">
          <FaChevronLeft /> All Trips
        </StyledBackLink>
      ) : null}
      <FlexContainer justifyContent="space-between" flexWrap="nowrap" alignItems="flex-start">
        <Heading as="h3" altStyle>
          {trip ? (
            <>
              {enableNavigation ? (
                <Link to={`/app/trips/${trip.tripId}/`}>{trip.name}</Link>
              ) : (
                trip.name
              )}
            </>
          ) : (
            <Skeleton width={200} />
          )}
        </Heading>
        {trip && trip.tripMembers.length > 0 && (
          <StackedAvatars>
            <Avatar
              src={loggedInUser?.photoURL as string}
              gravatarEmail={loggedInUser?.email as string}
              size="sm"
            />
            {users &&
              trip.tripMembers
                .slice(
                  0,
                  trip.tripMembers.length === numberOfAvatarsToShow
                    ? numberOfAvatarsToShow
                    : numberOfAvatarsToShow - 1 // to account for the +N avatar below
                )
                .map((tripMember: any) => {
                  const matchingUser: UserType = users[tripMember] ? users[tripMember] : undefined;
                  if (!matchingUser) return null;
                  return (
                    <Avatar
                      src={matchingUser?.photoURL as string}
                      gravatarEmail={matchingUser?.email as string}
                      size="sm"
                      key={matchingUser.uid}
                    />
                  );
                })}
            {users && trip.tripMembers.length > numberOfAvatarsToShow && (
              <Avatar
                // never want to show +1, because then we could have just rendered the photo.
                // Instead, lets add another so its always at least +2
                staticContent={`+${trip.tripMembers.length - numberOfAvatarsToShow + 1}`}
                size="sm"
              />
            )}
          </StackedAvatars>
        )}
      </FlexContainer>

      <Row>
        <Column md={showDescription ? 12 : 7}>
          <StyledLineItem>
            <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
              <FaRegCalendar style={{ marginRight: halfSpacer }} />
              {trip ? (
                <>
                  {trip.tripLength === 21
                    ? formattedDate(new Date(trip.startDate.seconds * 1000))
                    : formattedDateRange(
                        trip.startDate.seconds * 1000,
                        trip.endDate.seconds * 1000
                      )}
                </>
              ) : (
                <div style={{ flex: 1 }}>
                  <Skeleton count={1} width="50%" />
                </div>
              )}
            </FlexContainer>
          </StyledLineItem>

          <StyledLineItem>
            <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
              <FaMapMarkerAlt style={{ marginRight: halfSpacer }} />
              {trip ? (
                trip.startingPoint
              ) : (
                <div style={{ flex: 1 }}>
                  <Skeleton count={1} width="65%" />
                </div>
              )}
            </FlexContainer>
          </StyledLineItem>
        </Column>
        {!showDescription && (
          <Column md={5}>
            <FlexContainer justifyContent={!size.isSmallScreen ? 'flex-end' : 'flex-start'}>
              {trip ? (
                <>
                  <Button
                    type="link"
                    to={`/app/trips/${trip.tripId}/details`}
                    rightSpacer
                    size="small"
                    color="tertiary"
                  >
                    Details
                  </Button>
                  <Button
                    type="link"
                    to={`/app/trips/${trip.tripId}/party`}
                    rightSpacer
                    size="small"
                    color="tertiary"
                  >
                    Party
                  </Button>
                  <TripDeleteModal
                    setModalIsOpen={setModalIsOpen}
                    modalIsOpen={modalIsOpen}
                    tripId={trip.tripId}
                  />
                  <DropdownMenu>
                    <Link to={`/app/trips/${trip.tripId}`}>
                      <FaRegCheckSquare /> Packing List
                    </Link>
                    <Link to={`/app/trips/${trip.tripId}/details`}>
                      <FaInfoCircle /> Details
                    </Link>
                    <Link to={`/app/trips/${trip.tripId}/party`}>
                      <FaUsers /> Party
                    </Link>
                    <Link to="/" onClick={() => deleteTrip()}>
                      <FaTrash /> Delete
                    </Link>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Skeleton width={100} height={doubleSpacer} style={{ marginRight: baseSpacer }} />
                  <Skeleton width={80} height={doubleSpacer} style={{ marginRight: baseSpacer }} />
                  <Skeleton width={50} height={doubleSpacer} />
                </>
              )}
            </FlexContainer>
          </Column>
        )}
      </Row>

      {showTags && (
        <PillWrapper>
          {trip ? (
            <>
              {trip.tags.map((tag: string) => (
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
            <>
              {/* Generate some tag placeholders and make widths dynamic with Math */}
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  // random widths between 48 and 128
                  width={Math.floor(Math.random() * (128 - 48 + 1) + 48)}
                  height={baseAndAHalfSpacer}
                  style={{ marginRight: halfSpacer, borderRadius: baseAndAHalfSpacer }}
                />
              ))}
            </>
          )}
        </PillWrapper>
      )}

      {showDescription && (
        <>
          {trip ? (
            <>
              <HorizontalRule compact />
              <TextTruncate
                line={1}
                element="p"
                truncateText="…"
                text={trip.description}
                containerClassName="truncatedText"
              />
            </>
          ) : (
            <Skeleton count={1} />
          )}
        </>
      )}
    </StyledTripWrapper>
  );
};

export default TripCard;
