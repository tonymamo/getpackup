import { TripMemberStatus, TripType } from '@common/trip';

const acceptedTripMembersOnly = (trip: TripType) => {
  return (
    trip &&
    trip.tripMembers &&
    Object.values(trip.tripMembers).filter(
      (member) =>
        member.status === TripMemberStatus.Accepted || member.status === TripMemberStatus.Owner
    )
  );
};

export default acceptedTripMembersOnly;
