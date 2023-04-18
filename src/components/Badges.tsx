import appleBadge from '@images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg';
import googleBadge from '@images/Google_Play_Store_badge_EN.svg';
import websiteBadge from '@images/website-badge.svg';
import { baseSpacer } from '@styles/size';
import React from 'react';
import styled from 'styled-components';

const BadgeWrapper = styled.div`
  display: flex;
  gap: ${baseSpacer};
  justify-content: center;
  flex-wrap: wrap;
`;

export const Badges = () => (
  <BadgeWrapper>
    <a href="https://apps.apple.com/us/app/packup-trip-planning/id6446636448">
      <img src={appleBadge} alt="Apple App Store" height={53} width={160} />
    </a>
    <a href="https://play.google.com/store/apps/details?id=com.packupapp.twa">
      <img src={googleBadge} alt="Google Play Store" height={53} width={180} />
    </a>
    <a href="https://packupapp.com">
      <img src={websiteBadge} alt="Get started on web" height={53} width={180} />
    </a>
  </BadgeWrapper>
);

export default Badges;
