import React, { FunctionComponent } from 'react';
import { FluidObject } from 'gatsby-image';
import { FaQuoteRight } from 'react-icons/fa';

import Avatar from './Avatar';
import Heading from './Heading';
import FlexContainer from './FlexContainer';
import Box from './Box';
import { baseSpacer, doubleSpacer } from '../styles/size';
import { fontSizeH6 } from '../styles/typography';

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
    <Box>
      <FlexContainer
        justifyContent="space-between"
        flexDirection="column"
        alignItems="start"
        height="100%"
      >
        <FaQuoteRight />
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
            <Avatar src={testimonial.avatar.childImageSharp.fluid.src} size="md" />
            <div style={{ marginLeft: baseSpacer }}>
              <Heading as="h6" noMargin>
                {testimonial.author}
              </Heading>
              <p style={{ marginBottom: 0 }}>{testimonial.location}</p>
            </div>
          </FlexContainer>
        </div>
      </FlexContainer>
    </Box>
  );
};

export default Testimonial;
