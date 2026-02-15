import { Button, Column, Heading, HorizontalRule, PageContainer, Row, Seo } from '@components';
import { RouteComponentProps } from '@reach/router';
import { doubleSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const Polaroid = styled.div`
  background: #fff;
  padding: 1rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    transition: all 0.35s;
  }
`;

const Caption = styled.div`
  font-size: 1.125rem;
  text-align: center;
  line-height: 2em;
`;

const Item = styled.div`
  margin-top: ${doubleSpacer};
`;

const Support: FunctionComponent<RouteComponentProps> = () => {
  return (
    <PageContainer withVerticalPadding>
      <Seo title="Support" />
      <Row>
        <Column sm={8} smOffset={2}>
          <div style={{ textAlign: 'center', marginBottom: doubleSpacer }}>
            <Heading>Help Us Keep Building</Heading>
            <p style={{ fontSize: '1.5rem', lineHeight: 1.5 }}>
              Your support helps us create better tools for adventurers like you
            </p>
            <HorizontalRule />
            <p>
              We&apos;re a small team building Packup on nights and weekends, entirely self-funded.
              Every dollar you contribute goes directly into making the app better, whether
              that&apos;s adding new functionality, improving core features, or keeping everything
              running smoothly.{' '}
            </p>
            <HorizontalRule />
            <Button
              type="link"
              to="https://buy.stripe.com/4gM4gseX04H76gR9IK3ZK00"
              color="primary"
              onClick={() => trackEvent('Support Button Clicked')}
            >
              Buy Us a Coffee
            </Button>
          </div>
        </Column>
      </Row>
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

export default Support;
