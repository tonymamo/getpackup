import React from 'react';
import styled from 'styled-components';

import { TripType } from '@common/trip';
import { HeroImage, StaticMapImage, NegativeMarginContainer, NoiseRings } from '@components';
import { baseSpacerUnit } from '@styles/size';
import { brandSecondary, lightestGray } from '@styles/color';

type TripHeaderImageProps = {
  trip: TripType | undefined;
};

const PlaceholderImageWrapper = styled.div`
  height: calc(100vw / 4.5);
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  & svg {
    width: 100%;
  }
`;

const TripHeaderImage = ({ trip }: TripHeaderImageProps): JSX.Element => {
  return (
    <NegativeMarginContainer
      top={baseSpacerUnit}
      left={baseSpacerUnit}
      right={baseSpacerUnit}
      bottom={0}
      aspectRatio={4}
    >
      {trip ? (
        <>
          {/* Aspect ratio is 16/4 or these images, but 5 works better because it isnt 100% full width, it's in a PageContainer with a max width */}
          {trip.headerImage && <HeroImage staticImgSrc={trip.headerImage} aspectRatio={5} />}
          {!trip.headerImage && !!trip.lat && !!trip.lng && (
            <StaticMapImage
              lat={trip.lat}
              lng={trip.lng}
              height="100%"
              width="100%"
              zoom={10}
              label={trip.startingPoint}
            />
          )}
          {!trip.headerImage && !trip.lat && !trip.lng && (
            <PlaceholderImageWrapper backgroundColor={brandSecondary}>
              <NoiseRings height={512} width={2048} seed={trip.name} strokeWidth={4} />
            </PlaceholderImageWrapper>
          )}
        </>
      ) : (
        <PlaceholderImageWrapper backgroundColor={lightestGray} />
      )}
    </NegativeMarginContainer>
  );
};

export default TripHeaderImage;
