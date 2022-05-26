import { TripType } from '@common/trip';
import axios from 'axios';
import { stringify } from 'query-string';

import trackEvent from './trackEvent';

const sendTripInvitationEmail = ({
  tripId,
  invitedBy,
  email,
}: {
  tripId: TripType['tripId'];
  invitedBy: string;
  email: string;
}) => {
  const queryParams = stringify({
    to: email,
    subject: `${invitedBy} has invited you on a trip`,
    username: invitedBy,
    tripId,
    isTestEnv: String(process.env.GATSBY_SITE_URL !== 'https://getpackup.com'),
  });
  const invitationUrl =
    process.env.GATSBY_SITE_URL === 'https://getpackup.com'
      ? `https://us-central1-getpackup.cloudfunctions.net/sendTripInvitationEmail?${queryParams}`
      : `https://us-central1-packup-test-fc0c2.cloudfunctions.net/sendTripInvitationEmail?${queryParams}`;

  axios.post(invitationUrl);

  trackEvent('Trip Party Invitation Email Sent', {
    tripId,
    updated: new Date(),
    invitedMember: email,
  });
};

export default sendTripInvitationEmail;
