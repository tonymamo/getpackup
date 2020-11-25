import React, { FunctionComponent } from 'react';
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
  TelegramShareButton,
  EmailShareButton,
  RedditShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  TwitterIcon,
  TelegramIcon,
  EmailIcon,
  RedditIcon,
} from 'react-share';
import styled from 'styled-components';

import { z1Shadow } from '../styles/mixins';
import { white } from '../styles/color';
import { baseSpacer, borderRadius, halfSpacer, quarterSpacer } from '../styles/size';

type ShareProps = {
  url: string;
  title: string;
  tags: Array<string>;
  vertical?: boolean;
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
  z-index: 1;
  left: 0;
  height: 232px; /* height of rendered div */
  margin-top: -116px; /* half of above */
  top: 50%;
  width: 40px;
  background: ${white};
  padding: ${quarterSpacer};
  box-shadow: ${z1Shadow};
  border-radius: 0 ${borderRadius} ${borderRadius} 0;

  & button {
    margin-bottom: ${quarterSpacer};
  }
`;

const Share: FunctionComponent<ShareProps> = ({ url, title, tags, vertical }) => {
  const shareUrl = `https://getpackup.com${url}`;

  const renderIcons = () => {
    return (
      <>
        <FacebookShareButton url={shareUrl} hashtag={tags[0]}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <FacebookMessengerShareButton url={shareUrl} redirectUri={shareUrl} appId="335885727718265">
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
        <TwitterShareButton url={shareUrl} title={title} hashtags={tags}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>{' '}
        <TelegramShareButton url={shareUrl} title={title}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <RedditShareButton url={shareUrl} title={title}>
          <RedditIcon size={32} round />
        </RedditShareButton>
        <EmailShareButton
          url={shareUrl}
          subject={`Check out this article on Packup: ${title}`}
          body="Hey, I thought you might be interested in this article on Packup that I found!"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </>
    );
  };

  if (vertical) {
    return <VerticalShareWrapper>{renderIcons()}</VerticalShareWrapper>;
  }

  return (
    <ShareWrapper>
      <small>Share This Post:</small>
      {renderIcons()}
    </ShareWrapper>
  );
};

export default Share;
