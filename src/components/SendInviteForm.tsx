import { addAlert } from '@redux/ducks/globalAlerts';
import trackEvent from '@utils/trackEvent';
import React from 'react';
import { useDispatch } from 'react-redux';
import Button from './Button';
import Heading from './Heading';

const SendInviteForm = (): JSX.Element => {
  const dispatch = useDispatch();

  const title = 'Create an account on Packup so we can collaborate on trips!';
  const text = `Hey, sign up for an account on Packup so we can coordinate trip details together 😎 ${process
    .env.GATSBY_SITE_URL ||
    'https://getpackup.com'} Let me know when you have signed up so I can invite you to our trip!`;

  const sendInvite = async () => {
    try {
      if (navigator.share) {
        navigator
          .share({
            title,
            text,
            url: process.env.GATSBY_SITE_URL,
          })
          .then(() => {
            dispatch(
              addAlert({
                message: 'Hopefully they join soon so you can collaborate on your trip 👍',
                type: 'success',
              })
            );
            trackEvent('Send Invite to New User Successful');
          })
          .catch((err) => {
            trackEvent('Send Invite to New User Cancelled Or Errored', err);
          });
      }
    } catch (err) {
      dispatch(
        addAlert({
          message: 'Sorry, something went wrong. Please try again later.',
          type: 'danger',
        })
      );
      trackEvent('Send Invite to New User Failed', {
        canShareEnabled: typeof navigator.share === 'function',
      });
    }
  };
  return (
    <div>
      <Heading as="h2">Invite a Friend</Heading>
      <p>Friend not on Packup yet? Send them a text or an email so they can get started ✅</p>
      {typeof navigator.share === 'function' ? (
        <Button type="button" onClick={sendInvite}>
          Send Text/Email
        </Button>
      ) : (
        <>
          <Button type="link" to={`sms://?&body=${encodeURI(text)}`} rightSpacer>
            Send a text
          </Button>
          <Button
            type="link"
            to={`mailto:?subject=${title}&body=${text}`}
            rightSpacer
            color="secondary"
          >
            Send an email
          </Button>
        </>
      )}
    </div>
  );
};

export default SendInviteForm;
