import { Box, Button, Column, Heading, HorizontalRule, PageContainer, Row, Seo } from '@components';
import { RouteComponentProps } from '@reach/router';
import {
  brandPrimary,
  brandSecondary,
  brandSuccess,
  lightestGray,
  offWhite,
  white,
} from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer, borderRadius, doubleSpacer, tripleSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import React, { FunctionComponent, useState } from 'react';
import { FaGlobeAmericas, FaMoneyBillWave, FaMugHot, FaRegHeart, FaServer } from 'react-icons/fa';
import styled from 'styled-components';

const ListItem = styled.div`
  display: flex;
  gap: ${baseSpacer};
  padding: ${baseSpacer};
  background-color: ${offWhite};
  border-radius: ${borderRadius};
  border: ${baseBorderStyle};
  margin-bottom: ${baseSpacer};
`;

const IconWrapper = styled.div`
  width: ${tripleSpacer};
  height: ${tripleSpacer};
  background-color: ${brandSecondary};
  border-radius: ${borderRadius};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: ${white};
`;

const AmountButton = styled.button<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? brandPrimary : white)};
  color: ${(props) => (props.isActive ? white : brandSecondary)};
  border-radius: ${borderRadius};
  border: ${baseBorderStyle};
  padding: ${baseSpacer};
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: ${(props) => (props.isActive ? 'default' : 'pointer')};
  transition: all 0.2s ease-in-out;
  margin-bottom: ${baseSpacer};
  &:hover,
  &:focus {
    background-color: ${(props) => (props.isActive ? brandPrimary : lightestGray)};
    color: ${(props) => (props.isActive ? white : brandSecondary)};
  }
`;

const Polaroid = styled.div`
  background: #fff;
  padding: 1rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
`;

const Caption = styled.div`
  font-size: 1.125rem;
  text-align: center;
  line-height: 2em;
`;

const Item = styled.div`
  margin-top: ${doubleSpacer};
`;

const paymentLinks = {
  '5': 'https://buy.stripe.com/4gM4gseX04H76gR9IK3ZK00',
  '10': 'https://buy.stripe.com/3cI4gs5mq0qR9t31ce3ZK01',
  '20': 'https://buy.stripe.com/00w4gsbKOehHcFfbQS3ZK03',
  '50': 'https://buy.stripe.com/28E5kwaGKc9zax74oq3ZK02',
};

const Support: FunctionComponent<RouteComponentProps> = () => {
  const [amount, setAmount] = useState<keyof typeof paymentLinks>('5');

  return (
    <PageContainer withVerticalPadding>
      <Seo title="Support" />
      <Box>
        <Row>
          <Column sm={8} smOffset={2}>
            <div
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: doubleSpacer,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: brandPrimary,
                  borderRadius: '50%',
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto',
                  color: white,
                }}
              >
                <FaRegHeart />
              </div>
              <Heading noMargin>Support Packup</Heading>
              <p style={{ fontSize: '1.5rem', lineHeight: 1.5 }}>
                Help us keep the outdoor adventure community safe and connected. Every contribution
                makes a difference.
              </p>
            </div>
          </Column>
        </Row>
        <HorizontalRule />
        <Row>
          <Column md={5}>
            <Heading as="h2">Where Your Support Goes</Heading>
            <p style={{ lineHeight: 1.4 }}>
              Packup is a passion project built for the community by a small team working on nights
              and weekends. So far, there are no ads, no subscriptions, and no corporate investors.
              Your donations help cover:
            </p>
            <div className="space-y-4">
              <ListItem>
                <IconWrapper>
                  <FaServer />
                </IconWrapper>
                <div>
                  <Heading as="h6" noMargin>
                    Server &amp; Hosting Costs
                  </Heading>
                  <p style={{ fontSize: '1rem', lineHeight: 1.4, margin: 0 }}>
                    Database hosting, email delivery, and keeping the site fast and reliable.
                  </p>
                </div>
              </ListItem>
              <ListItem>
                <IconWrapper>
                  <FaMoneyBillWave />
                </IconWrapper>
                <div>
                  <Heading as="h6" noMargin>
                    Miscellaneous Costs
                  </Heading>
                  <p style={{ fontSize: '1rem', lineHeight: 1.4, margin: 0 }}>
                    From legal and accounting fees, to domain registration, to software licenses, it
                    all adds up.
                  </p>
                </div>
              </ListItem>
              <ListItem>
                <IconWrapper>
                  <FaMugHot />
                </IconWrapper>
                <div>
                  <Heading as="h6" noMargin>
                    New Features
                  </Heading>
                  <p style={{ fontSize: '1rem', lineHeight: 1.4, margin: 0 }}>
                    Development time for new features and improvements, fueled by copious amounts of
                    coffee.
                  </p>
                </div>
              </ListItem>
            </div>
          </Column>
          <Column md={6} mdOffset={1}>
            <ListItem>
              <div style={{ width: '100%', padding: baseSpacer }}>
                <Heading as="h5" noMargin>
                  Make a Donation
                </Heading>
                <p>Choose an amount</p>
                <Row>
                  {Object.keys(paymentLinks).map((amountKey) => (
                    <Column key={amountKey} sm={3}>
                      <AmountButton
                        isActive={amountKey === amount}
                        onClick={() => setAmount(amountKey as keyof typeof paymentLinks)}
                      >
                        ${amountKey}
                      </AmountButton>
                    </Column>
                  ))}
                </Row>
                <p style={{ lineHeight: 1.4, margin: 0 }}>
                  <strong>100% voluntary.</strong> Packup will continue to offer a 100% free
                  experience, even when we later add in premium, paid features. Donations are purely
                  to help with running costs and are greatly appreciated, but never required.
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: baseSpacer,
                    border: `1px solid ${brandSuccess}`,
                    backgroundColor: `${brandSuccess}20`,
                    padding: baseSpacer,
                    borderRadius,
                    marginTop: doubleSpacer,
                    marginBottom: doubleSpacer,
                  }}
                >
                  <FaGlobeAmericas size="2rem" />
                  <span style={{ fontSize: '1rem', lineHeight: 1.4, margin: 0 }}>
                    Packup will contribute <strong>1% of your donation</strong> to remove CO₂ from
                    the atmosphere.
                  </span>
                </div>
                <Button
                  type="link"
                  to={paymentLinks[amount]}
                  color="primary"
                  block
                  onClick={() => trackEvent('Support Button Clicked', { amount })}
                >
                  <FaRegHeart /> <span style={{ marginLeft: baseSpacer }}>Donate ${amount}</span>
                </Button>
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                    margin: `${baseSpacer} 0 0`,
                    textAlign: 'center',
                  }}
                >
                  Secure payment powered by Stripe. You&apos;ll be redirected to complete your
                  payment.
                </p>
              </div>
            </ListItem>
          </Column>
        </Row>
      </Box>
      <ListItem>
        <Row>
          <Column sm={8} smOffset={2}>
            <div style={{ width: '100%', padding: baseSpacer }}>
              <Heading as="h2">Thank you</Heading>
              <p>
                Whether you donate or not, thank you for being part of the Packup community. We are
                grateful for your support over the years helping us achieve our mission of
                increasing the safety and enjoyment of outdoor adventures by improving competency
                and preparedness.
              </p>
              <Button type="link" to="/about" color="tertiary" size="small">
                Learn more about us
              </Button>
              <Row>
                <Column sm={4}>
                  <Item>
                    <Polaroid>
                      <img
                        src="https://res.cloudinary.com/getpackup/image/upload/v1617244554/getpackup/j_kelsey_20191023_0625-2.jpg"
                        alt="Taylor"
                      />
                      <Caption>Taylor</Caption>
                    </Polaroid>
                  </Item>
                </Column>
                <Column sm={4}>
                  <Item>
                    <Polaroid>
                      <img
                        src="https://res.cloudinary.com/getpackup/image/upload/v1617244556/getpackup/mackheadshot.jpg"
                        alt="Mack"
                      />
                      <Caption>Mack</Caption>
                    </Polaroid>
                  </Item>
                </Column>
                <Column sm={4}>
                  <Item>
                    <Polaroid>
                      <img
                        src="https://res.cloudinary.com/getpackup/image/upload/v1617244534/getpackup/tony.jpg"
                        alt="Tony"
                      />
                      <Caption>Tony</Caption>
                    </Polaroid>
                  </Item>
                </Column>
              </Row>
            </div>
          </Column>
        </Row>
      </ListItem>
    </PageContainer>
  );
};

export default Support;
