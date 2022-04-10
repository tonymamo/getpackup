import { TRIP_PARTY_AVATARS_TO_SHOW } from '@common/constants';
import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import { Avatar, StackedAvatars } from '@components';
import acceptedTripMembersOnly from '@utils/getAcceptedTripMembersOnly';
import React from 'react';

type TripMemberAvatarsProps = {
  trip: TripType;
  users: UserType[];
};

const TripMemberAvatars = ({ trip, users }: TripMemberAvatarsProps): JSX.Element | null => {
  const tripMembers = trip && trip.tripMembers ? acceptedTripMembersOnly(trip) : [];

  if (tripMembers.length === 1) {
    return null;
  }
  return (
    <>
      {tripMembers.length > 1 && (
        <StackedAvatars>
          {users &&
            tripMembers
              .slice(
                0,
                tripMembers.length === TRIP_PARTY_AVATARS_TO_SHOW
                  ? TRIP_PARTY_AVATARS_TO_SHOW
                  : TRIP_PARTY_AVATARS_TO_SHOW - 1 // to account for the +N avatar below
              )
              .map((tripMember: any) => {
                const matchingUser: UserType | undefined = users[tripMember.uid]
                  ? users[tripMember.uid]
                  : undefined;
                if (!matchingUser) return null;
                return (
                  <Avatar
                    src={matchingUser?.photoURL as string}
                    gravatarEmail={matchingUser?.email as string}
                    size="sm"
                    key={matchingUser.uid}
                    username={matchingUser.username.toLocaleLowerCase()}
                  />
                );
              })}
          {users && tripMembers.length > TRIP_PARTY_AVATARS_TO_SHOW && (
            <Avatar
              // never want to show +1, because then we could have just rendered the photo.
              // Instead, lets add another so its always at least +2
              staticContent={`+${tripMembers.length - TRIP_PARTY_AVATARS_TO_SHOW + 1}`}
              size="sm"
              username={`+${tripMembers.length - TRIP_PARTY_AVATARS_TO_SHOW + 1} more`}
            />
          )}
        </StackedAvatars>
      )}
    </>
  );
};

export default TripMemberAvatars;
