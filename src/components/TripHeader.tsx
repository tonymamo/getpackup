import React, { FunctionComponent, useState, useEffect } from 'react';
import { FaRegCalendar, FaMapMarkerAlt, FaTrash, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'gatsby';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { PackingListItemType } from '@common/packingListItem';
import { brandSuccess } from '@styles/color';
import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import {
  Heading,
  StackedAvatars,
  Avatar,
  Pill,
  HorizontalScroller,
  FlexContainer,
  DropdownMenu,
  Button,
  Row,
  Column,
  ProgressBar,
} from '@components';
import {
  baseAndAHalfSpacer,
  baseSpacer,
  doubleSpacer,
  halfSpacer,
  quarterSpacer,
} from '@styles/size';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import { RootState } from '@redux/ducks';
import useWindowSize from '@utils/useWindowSize';
import TripDeleteModal from '@views/TripDeleteModal';
import { fontSizeSmall } from '@styles/typography';
import trackEvent from '@utils/trackEvent';
import { gearListActivities } from '@utils/gearListItemEnum';
import { MAX_TRIP_PARTY_SIZE } from '@common/constants';

type TripHeaderProps = {
  trip?: TripType;
  loggedInUser?: UserType;
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

const TripHeader: FunctionComponent<TripHeaderProps> = ({ trip, loggedInUser }) => {
  const users = useSelector((state: RootState) => state.firestore.data.users);
  const gearList = useSelector((state: RootState) => state.firestore.data.packingList);
  const gearListArray: PackingListItemType[] = gearList ? Object.values(gearList) : [];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [packedPercent, setPackedPercent] = useState(0);

  const packedItemsLength =
    gearListArray.length > 0 ? gearListArray.filter((item) => item?.isPacked === true).length : 0;

  useEffect(() => {
    setPackedPercent(Number(((packedItemsLength / gearListArray.length) * 100).toFixed(0)));
  }, [gearListArray, packedItemsLength]);

  const size = useWindowSize();

  return (
    <StyledTripWrapper>
      {!size.isSmallScreen ? (
        <StyledBackLink
          to="../"
          onClick={() =>
            trackEvent('Trip Header Back To Trips Link Clicked', {
              trip,
            })
          }
        >
          <FaChevronLeft /> All Trips
        </StyledBackLink>
      ) : null}
      <Row>
        <Column md={8}>
          <FlexContainer justifyContent="flex-start" height="100%">
            <Heading as="h3" altStyle noMargin>
              {trip ? trip.name : <Skeleton width={200} />}
            </Heading>
          </FlexContainer>
        </Column>
        <Column md={4}>
          <FlexContainer justifyContent={size.isSmallScreen ? 'flex-start' : 'flex-end'}>
            {trip && trip.tripMembers.length > 0 && (
              <StackedAvatars>
                {users &&
                  trip.tripMembers
                    .slice(
                      0,
                      trip.tripMembers.length === MAX_TRIP_PARTY_SIZE
                        ? MAX_TRIP_PARTY_SIZE
                        : MAX_TRIP_PARTY_SIZE - 1 // to account for the +N avatar below
                    )
                    .map((tripMember: any) => {
                      const matchingUser: UserType = users[tripMember.uid]
                        ? users[tripMember.uid]
                        : undefined;
                      if (!matchingUser) return null;
                      return (
                        <Avatar
                          src={matchingUser?.photoURL as string}
                          gravatarEmail={matchingUser?.email as string}
                          size="sm"
                          key={matchingUser.uid}
                          username={matchingUser.username}
                        />
                      );
                    })}
                {users && trip.tripMembers.length > MAX_TRIP_PARTY_SIZE && (
                  <Avatar
                    // never want to show +1, because then we could have just rendered the photo.
                    // Instead, lets add another so its always at least +2
                    staticContent={`+${trip.tripMembers.length - MAX_TRIP_PARTY_SIZE + 1}`}
                    size="sm"
                    username={`+${trip.tripMembers.length - MAX_TRIP_PARTY_SIZE + 1} more`}
                  />
                )}
              </StackedAvatars>
            )}
          </FlexContainer>
        </Column>
      </Row>

      <Row>
        <Column md={7}>
          <StyledLineItem>
            <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
              <FaRegCalendar
                style={{
                  marginRight: halfSpacer,
                  top: quarterSpacer,
                  flexShrink: 0,
                }}
              />
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
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <Skeleton count={1} width="50%" />
                </div>
              )}
            </FlexContainer>
          </StyledLineItem>

          <StyledLineItem>
            <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
              <FaMapMarkerAlt
                style={{
                  marginRight: halfSpacer,
                  top: quarterSpacer,
                  flexShrink: 0,
                }}
              />
              {trip ? (
                trip.startingPoint
              ) : (
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <Skeleton count={1} width="65%" />
                </div>
              )}
            </FlexContainer>
          </StyledLineItem>
        </Column>

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
                  onClick={() =>
                    trackEvent('Trip Header Details Link Clicked', {
                      trip,
                    })
                  }
                >
                  Details
                </Button>
                <Button
                  type="link"
                  to={`/app/trips/${trip.tripId}/party`}
                  rightSpacer
                  size="small"
                  color="tertiary"
                  onClick={() =>
                    trackEvent('Trip Header Party Link Clicked', {
                      trip,
                    })
                  }
                >
                  Party
                </Button>
                <TripDeleteModal
                  setModalIsOpen={setModalIsOpen}
                  modalIsOpen={modalIsOpen}
                  tripId={trip.tripId}
                />
                <DropdownMenu>
                  <button
                    onClick={() => {
                      setModalIsOpen(true);
                      trackEvent('Trip Header Delete Trip Clicked', {
                        trip,
                      });
                    }}
                    type="button"
                  >
                    <FaTrash /> Delete
                  </button>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Skeleton
                  width={100}
                  height={doubleSpacer}
                  style={{
                    marginRight: baseSpacer,
                  }}
                />
                <Skeleton
                  width={80}
                  height={doubleSpacer}
                  style={{
                    marginRight: baseSpacer,
                  }}
                />
                <Skeleton width={50} height={doubleSpacer} />
              </>
            )}
          </FlexContainer>
        </Column>
      </Row>

      <div
        style={{
          margin: `${halfSpacer} 0`,
        }}
      >
        <HorizontalScroller>
          {trip ? (
            <>
              {// only show Activity tags
              trip.tags
                .filter((item) => gearListActivities.some((activity) => item === activity.label))
                .map((tag: string) => (
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
              {Array.from({
                length: 7,
              }).map((_, i) => (
                <Skeleton
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  // random widths between 48 and 128
                  width={Math.floor(Math.random() * (128 - 48 + 1) + 48)}
                  height={baseAndAHalfSpacer}
                  style={{
                    marginRight: halfSpacer,
                    borderRadius: baseAndAHalfSpacer,
                  }}
                />
              ))}
            </>
          )}
        </HorizontalScroller>
        {trip && gearListArray.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <small style={{ textAlign: 'center' }}>Your Packing Progress ({packedPercent}%)</small>
            <ProgressBar
              height={baseAndAHalfSpacer}
              borderRadius={baseAndAHalfSpacer}
              completed={packedPercent}
              isLabelVisible={false}
              bgColor={brandSuccess}
              transitionDuration="0.25s"
            />
          </div>
        )}
      </div>
    </StyledTripWrapper>
  );
};

export default TripHeader;
