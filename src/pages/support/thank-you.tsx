import { Box, Button, Column, Heading, HorizontalRule, PageContainer, Row, Seo } from '@components';
import { RouteComponentProps } from '@reach/router';
import { brandPrimary, white } from '@styles/color';
import { baseSpacer, doubleSpacer } from '@styles/size';
import React, { FunctionComponent } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import styled from 'styled-components';

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

const SupportThankYou: FunctionComponent<RouteComponentProps> = () => {
  return (
    <PageContainer withVerticalPadding>
      <Seo title="Thank you" />
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
              <Heading noMargin>Thank you for supporting Packup</Heading>
              <p style={{ fontSize: '1.5rem', lineHeight: 1.5 }}>
                Your donation has been received. You&apos;re helping to keep the outdoor adventure
                community safe and connected by keeping Packup free and open for everyone.
              </p>
              <HorizontalRule compact />
              <p style={{ lineHeight: 1.4 }}>
                You should receive an email confirmation from Stripe shortly. If you have any
                questions, please contact us at{' '}
                <a href="mailto:hello@getpackup.com">hello@getpackup.com</a>.
              </p>
              <div style={{ display: 'flex', gap: baseSpacer }}>
                <Button type="link" to="/" color="primary">
                  Back to home
                </Button>
                <Button type="link" to="https://packupapp.com/" color="tertiary">
                  Log in
                </Button>
              </div>
            </div>
          </Column>
        </Row>
      </Box>
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
    </PageContainer>
  );
};

export default SupportThankYou;
