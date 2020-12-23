import React, { FunctionComponent } from 'react';
import { graphql, Link } from 'gatsby';
import { FixedObject } from 'gatsby-image';
import styled from 'styled-components';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

import {
  Box,
  PageContainer,
  Seo,
  PreviewCompatibleImage,
  FlexContainer,
  Row,
  Column,
  Avatar,
  RelativeOrExternalLink,
} from '@components';
import { baseSpacer, doubleSpacer, tripleSpacer } from '@styles/size';
import { visuallyHiddenStyle } from '@styles/mixins';
import logo from '@images/maskable_icon.png';

type LinksPageProps = {
  hideFromCms?: boolean;
  linksList: Array<{
    linkUrl: string;
    linkText: string;
    thumbnail: { childImageSharp: { fixed: FixedObject } };
  }>;
};

const AvatarWrapper = styled.div`
  margin: ${baseSpacer} auto;
  display: flex;
  justify-content: center;
`;

const ThumbnailWrapper = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  margin-right: ${baseSpacer};
  flex-shrink: 0;
`;

const Social = styled.a`
  margin: ${doubleSpacer};
  display: block;
`;

const HiddenText = styled.span`
  ${visuallyHiddenStyle};
`;

export const LinksPageTemplate: FunctionComponent<LinksPageProps> = ({
  linksList,
  hideFromCms,
}) => {
  return (
    <>
      <PageContainer>
        {!hideFromCms && <Seo title="Links" />}
        <AvatarWrapper>
          <Link to="/">
            <Avatar src={logo} size="lg" gravatarEmail="" />
          </Link>
        </AvatarWrapper>
        <div>
          {linksList &&
            linksList.length > 0 &&
            linksList.map((link) => (
              <Row key={link.linkUrl}>
                <Column md={8} mdOffset={2}>
                  <Box>
                    <FlexContainer justifyContent="flex-start" flexWrap="nowrap">
                      <ThumbnailWrapper>
                        <RelativeOrExternalLink to={link.linkUrl}>
                          <PreviewCompatibleImage
                            imageInfo={{
                              image: link.thumbnail,
                              alt: '',
                            }}
                          />
                        </RelativeOrExternalLink>
                      </ThumbnailWrapper>
                      <div>
                        <RelativeOrExternalLink to={link.linkUrl}>
                          {link.linkText}
                        </RelativeOrExternalLink>
                      </div>
                    </FlexContainer>
                  </Box>
                </Column>
              </Row>
            ))}
        </div>
        <Row>
          <Column md={8} mdOffset={2}>
            <FlexContainer>
              <Social href="https://www.instagram.com/getpackup/" target="_blank" rel="noopener">
                <FaInstagram size={tripleSpacer} />
                <HiddenText>Instagram</HiddenText>
              </Social>
              <Social href="https://www.facebook.com/getpackup" target="_blank" rel="noopener">
                <FaFacebook size={tripleSpacer} />
                <HiddenText>Facebook</HiddenText>
              </Social>
              <Social href="https://twitter.com/getpackup" target="_blank" rel="noopener">
                <FaTwitter size={tripleSpacer} />
                <HiddenText>Twitter</HiddenText>
              </Social>
            </FlexContainer>
            <p style={{ textAlign: 'center' }}>
              Have a question or a comment? <Link to="/contact">Drop us a note</Link>
            </p>
          </Column>
        </Row>
      </PageContainer>
    </>
  );
};

const LinksPage = ({ data }: { data: { markdownRemark: { frontmatter: LinksPageProps } } }) => {
  const { markdownRemark: post } = data;

  return <LinksPageTemplate linksList={post.frontmatter.linksList} />;
};

export default LinksPage;

export const linksPageQuery = graphql`
  query LinksPage {
    markdownRemark(frontmatter: { templateKey: { eq: "links-page" } }) {
      frontmatter {
        linksList {
          linkUrl
          linkText
          thumbnail {
            childImageSharp {
              fixed(width: 100, height: 100) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`;
