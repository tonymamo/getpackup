import React, { FunctionComponent, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';

import { Box, Button, Column, FlexContainer, Heading, PageContainer, Row, Seo } from '@components';
import { halfSpacer } from '@styles/size';
import { textColor, textColorLight } from '@styles/color';

type OnboardingProps = {};

const Onboarding: FunctionComponent<OnboardingProps> = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <PageContainer>
      <Seo title="Let's Get Started" />
      <Row>
        <Column md={8} mdOffset={2}>
          <Box>
            <SwipeableViews index={activeTab} onChangeIndex={(i) => setActiveTab(i)}>
              <div>
                <FlexContainer justifyContent="flex-end">
                  <Button
                    type="button"
                    onClick={() => setActiveTab(1)}
                    color="text"
                    iconRight={<FaChevronRight />}
                  >
                    Next
                  </Button>
                </FlexContainer>
                <Heading align="center">Welcome! 🤝</Heading>
                <p>
                  Looks like it&apos;s your first time here. First, we will ask you what type of
                  activities you like to do, and we will generate your{' '}
                  <strong>personalized Gear Closet</strong> based on your selections.
                </p>
              </div>
              <div>
                <FlexContainer justifyContent="space-between">
                  <Button
                    type="button"
                    onClick={() => setActiveTab(0)}
                    color="text"
                    iconLeft={<FaChevronLeft />}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab(2)}
                    color="text"
                    iconRight={<FaChevronRight />}
                  >
                    Next
                  </Button>
                </FlexContainer>
                <Heading align="center">Customize your Gear Closet</Heading>
                <p>
                  Before you create your first trip, you may want to go in and{' '}
                  <strong>customize your gear to your liking</strong>, adding and removing items
                  until your kit is dialed <em>just right</em> 👌. You can always add more items to
                  your Gear Closet later, too.
                </p>
                <p>
                  Then, when you create trips on packup, we will generate trip-specific packing
                  lists using the gear from your Gear Closet!
                </p>
              </div>
              <div>
                <FlexContainer justifyContent="flex-start">
                  <Button
                    type="button"
                    onClick={() => setActiveTab(1)}
                    color="text"
                    iconLeft={<FaChevronLeft />}
                  >
                    Previous
                  </Button>
                </FlexContainer>
                <Heading align="center">Create your First Trip</Heading>
                <p>
                  The last step will be to create your first trip! After entering some basic trip
                  details, you&apos;ll add what activities you are doing on that trip, and packup
                  will{' '}
                  <strong>
                    <em>auto-magically</em> generate a custom packing list
                  </strong>{' '}
                  for that trip.
                </p>

                <Button
                  type="link"
                  to="/app/gear-closet/setup"
                  color="primary"
                  block
                  iconRight={<FaChevronRight />}
                >
                  🙌 Let&apos;s go!
                </Button>
              </div>
            </SwipeableViews>
            <FlexContainer>
              <FaCircle
                style={{ margin: halfSpacer }}
                color={activeTab === 0 ? textColor : textColorLight}
                onClick={() => setActiveTab(0)}
              />
              <FaCircle
                style={{ margin: halfSpacer }}
                color={activeTab === 1 ? textColor : textColorLight}
                onClick={() => setActiveTab(1)}
              />
              <FaCircle
                style={{ margin: halfSpacer }}
                color={activeTab === 2 ? textColor : textColorLight}
                onClick={() => setActiveTab(2)}
              />
            </FlexContainer>
          </Box>
        </Column>
      </Row>
    </PageContainer>
  );
};

export default Onboarding;
