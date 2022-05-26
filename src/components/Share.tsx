import { white } from '@styles/color';
import { zIndexModal } from '@styles/layers';
import { z1Shadow } from '@styles/mixins';
import { baseSpacer, borderRadius, doubleSpacer, halfSpacer, quarterSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import React, { FunctionComponent } from 'react';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import styled from 'styled-components';

type ShareProps = {
  url: string;
  title: string;
  tags: Array<string>;
  vertical?: boolean;
  media: string;
  description: string;
};

const ShareWrapper = styled.div`
  margin-bottom: ${baseSpacer};
  & button,
  & small {
    margin-right: ${halfSpacer};
  }
`;

const VerticalShareWrapper = styled.div`
  position: fixed;
  z-index: ${zIndexModal};
  left: 0;
  height: 270px; /* height of rendered div */
  margin-top: -135px; /* half of above */
  top: 50%;
  width: 40px;
  background: ${white};
  padding: ${quarterSpacer};
  box-shadow: ${z1Shadow};
  border-radius: 0 ${borderRadius} ${borderRadius} 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Share: FunctionComponent<ShareProps> = ({
  url,
  title,
  tags,
  vertical,
  media,
  description,
}) => {
  const shareUrl = `https://getpackup.com${url}`;

  const hashtags = (tags && tags.length > 0 && tags.map((tag) => tag.split(' ').join(''))) || [];

  const buttonStyle = {
    width: doubleSpacer,
    height: doubleSpacer,
  };

  const renderIcons = (location: 'vertical' | 'inline') => {
    return (
      <>
        <FacebookShareButton
          url={shareUrl}
          style={buttonStyle}
          hashtag={tags && tags.length > 0 ? hashtags[0] : undefined}
          onClick={() =>
            trackEvent('Share Icon Clicked', { icon: 'FacebookShareButton', location, shareUrl })
          }
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <FacebookMessengerShareButton
          url={shareUrl}
          style={buttonStyle}
          redirectUri={shareUrl}
          appId="335885727718265"
          onClick={() =>
            trackEvent('Share Icon Clicked', {
              icon: 'FacebookMessengerShareButton',
              location,
              shareUrl,
            })
          }
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
        <TwitterShareButton
          url={shareUrl}
          style={buttonStyle}
          title={title}
          hashtags={tags && tags.length > 0 ? hashtags : undefined}
          onClick={() =>
            trackEvent('Share Icon Clicked', { icon: 'TwitterShareButton', location, shareUrl })
          }
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>{' '}
        <TelegramShareButton
          url={shareUrl}
          style={buttonStyle}
          title={title}
          onClick={() =>
            trackEvent('Share Icon Clicked', { icon: 'TwitterShareButton', location, shareUrl })
          }
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <RedditShareButton
          url={shareUrl}
          style={buttonStyle}
          title={title}
          onClick={() =>
            trackEvent('Share Icon Clicked', { icon: 'RedditShareButton', location, shareUrl })
          }
        >
          <RedditIcon size={32} round bgStyle={{ fill: '#FF4500' }} />
        </RedditShareButton>
        <PinterestShareButton
          url={shareUrl}
          style={buttonStyle}
          media={`https://getpackup.com${media}`}
          description={description}
          onClick={() =>
            trackEvent('Share Icon Clicked', { icon: 'PinterestShareButton', location, shareUrl })
          }
        >
          <PinterestIcon size={32} round />
        </PinterestShareButton>
        <EmailShareButton
          url={shareUrl}
          style={buttonStyle}
          onClick={() =>
            trackEvent('Share Icon Clicked', { icon: 'EmailShareButton', location, shareUrl })
          }
          subject={`Check out this article on Packup: ${title}`}
          body="Hey, I thought you might be interested in this article on Packup that I found!"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </>
    );
  };

  return vertical ? (
    <VerticalShareWrapper>{renderIcons('vertical')}</VerticalShareWrapper>
  ) : (
    <ShareWrapper>{renderIcons('inline')}</ShareWrapper>
  );
};

export default Share;
