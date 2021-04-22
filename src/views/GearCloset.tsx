import React, { FunctionComponent } from 'react';

import { Seo, Heading, PageContainer, Box } from '@components';
import usePersonalGear from '@hooks/usePersonalGear';

type GearClosetProps = {};

const GearCloset: FunctionComponent<GearClosetProps> = () => {
  usePersonalGear();

  return (
    <PageContainer>
      <Seo title="Gear Closet" />
      <Heading as="h2" altStyle>
        Gear Closet
      </Heading>
      <Box>Coming Soon!</Box>
    </PageContainer>
  );
};

export default GearCloset;
