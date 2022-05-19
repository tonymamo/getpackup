import {
  Avatar,
  Box,
  Column,
  FlexContainer,
  PageContainer,
  PreviewCompatibleImage,
  RelativeOrExternalLink,
  Row,
  Seo,
} from '@components';
import logo from '@images/maskable_icon.png';
import { visuallyHiddenStyle } from '@styles/mixins';
import { baseSpacer, doubleSpacer, tripleSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import { Link, graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import styled from 'styled-components';

type LinksPageProps = {
  hideFromCms?: boolean;
  linksList: Array<{
    linkUrl: string;
    linkText: string;
    thumbnail: string;
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
            linksList.map((link) => {
              const parts = link.thumbnail.split('upload/');
              const transformedThumbnail = [parts[0], 'upload/w_200,h_200,c_fill/', parts[1]].join(
                ''
              );
              return (
                <Row key={link.linkUrl}>
                  <Column md={8} mdOffset={2}>
                    <Box>
                      <FlexContainer justifyContent="flex-start" flexWrap="nowrap">
                        <ThumbnailWrapper>
                          <RelativeOrExternalLink
                            to={link.linkUrl}
                            onClick={() =>
                              trackEvent('Links Page Image Link Clicked', { link: link.linkUrl })
                            }
                          >
                            <PreviewCompatibleImage
                              imageInfo={{
                                image: !hideFromCms ? transformedThumbnail : link.thumbnail,
                                alt: '',
                              }}
                            />
                          </RelativeOrExternalLink>
                        </ThumbnailWrapper>
                        <div>
                          <RelativeOrExternalLink
                            to={link.linkUrl}
                            onClick={() =>
                              trackEvent('Links Page Link Clicked', { link: link.linkUrl })
                            }
                          >
                            {link.linkText}
                          </RelativeOrExternalLink>
                        </div>
                      </FlexContainer>
                    </Box>
                  </Column>
                </Row>
              );
            })}
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
          thumbnail
        }
      }
    }
  }
`;
