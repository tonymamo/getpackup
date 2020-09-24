import React, { FunctionComponent } from 'react';
import { FluidObject } from 'gatsby-image';
import { FaQuoteRight } from 'react-icons/fa';

import Avatar from './Avatar';
import Heading from './Heading';
import FlexContainer from './FlexContainer';
import Row from './Row';
import Column from './Column';
import { baseSpacer, doubleSpacer, quadrupleSpacer } from '../styles/size';
import { fontSizeH6 } from '../styles/typography';
import { brandPrimary } from '../styles/color';

type TestimonialProps = {
  testimonial: {
    quote: string;
    author: string;
    location: string;
    avatar: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  };
};

const Testimonial: FunctionComponent<TestimonialProps> = ({ testimonial }) => {
  return (
    <div style={{ marginBottom: quadrupleSpacer }}>
      <Row>
        <Column xs={8} xsOffset={2} sm={8} smOffset={2}>
          <div>
            <FlexContainer justifyContent="space-between" flexDirection="column" alignItems="start">
              <FaQuoteRight color={brandPrimary} />
              <p
                style={{
                  fontSize: fontSizeH6,
                  lineHeight: 1.5,
                  margin: `${doubleSpacer} 0`,
                  fontStyle: 'italic',
                }}
              >
                {testimonial.quote}
              </p>
              <div>
                <FlexContainer justifyContent="start">
                  <Avatar src={testimonial.avatar} size="md" gravatarEmail="" />
                  <div style={{ marginLeft: baseSpacer }}>
                    <Heading as="h4" noMargin>
                      {testimonial.author}
                    </Heading>
                    <p style={{ marginBottom: 0 }}>{testimonial.location}</p>
                  </div>
                </FlexContainer>
              </div>
            </FlexContainer>
          </div>
        </Column>
      </Row>
    </div>
  );
};

export default Testimonial;
