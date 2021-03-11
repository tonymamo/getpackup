// import React, { FunctionComponent } from 'react';
// import { graphql } from 'gatsby';
// import styled from 'styled-components';
// import { FluidObject } from 'gatsby-image';

// import { HeroImage, PageContainer, Box, Heading, Avatar, FlexContainer } from '@components';
// import {
//   quarterSpacer,
//   baseSpacer,
//   sextupleSpacer,
//   borderRadiusCircle,
//   decupleSpacer,
// } from '@styles/size';
// import { white } from '@styles/color';
// import { z1Shadow } from '@styles/mixins';
// import { UserType } from '@common/user';

// const BioWrapper = styled.div`
//   margin: -${decupleSpacer} 0 ${baseSpacer};
// `;

// const PublicProfileAvatarWrapper = styled.div`
//   border: ${quarterSpacer} solid ${white};
//   border-radius: ${borderRadiusCircle};
//   margin: -${sextupleSpacer} 0 ${baseSpacer};
//   box-shadow: ${z1Shadow};
// `;

// type PublicProfileProps = {
//   user: UserType;
//   heroImage: { childImageSharp: { fluid: FluidObject } };
// };

// const withHttp = (url: string) =>
//   url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schema, nonSchemaUrl) =>
//     schema ? match : `https://${nonSchemaUrl}`
//   );

// export const PublicProfileTemplate: FunctionComponent<PublicProfileProps> = ({
//   heroImage,
//   user: { displayName, photoURL, website, bio, location },
// }) => {
//   return (
//     <>
//       <HeroImage imgSrc={heroImage} />

//       <PageContainer withVerticalPadding>
//         <BioWrapper>
//           <Box>
//             <FlexContainer flexDirection="column">
//               <PublicProfileAvatarWrapper>
//                 <Avatar size="xl" src={photoURL} gravatarEmail="" />
//               </PublicProfileAvatarWrapper>
//               <Heading as="h1">{displayName}</Heading>
//               <p>{location}</p>
//               {website && (
//                 <div>
//                   <a href={withHttp(website)} target="_blank" rel="noreferrer noopener">
//                     {withHttp(website)}
//                   </a>
//                 </div>
//               )}
//               <br />
//               <p>{bio}</p>
//             </FlexContainer>
//           </Box>
//         </BioWrapper>
//         <Box>trips and stuff</Box>
//       </PageContainer>
//     </>
//   );
// };

// const PublicProfile = ({ data: { users, markdownRemark } }: { data: any }) => (
//   <PublicProfileTemplate user={users} heroImage={markdownRemark.frontmatter.heroImage} />
// );

// export default PublicProfile;

// export const pageQuery = graphql`
//   query PublicProfileById($username: String!) {
//     users(username: { eq: $username }) {
//       username
//       bio
//       website
//       displayName
//       photoURL
//       location
//     }
//     markdownRemark(frontmatter: { templateKey: { eq: "contact-page" } }) {
//       frontmatter {
//         heroImage {
//           childImageSharp {
//             fluid(maxWidth: 2048, quality: 60) {
//               ...GatsbyImageSharpFluid_withWebp
//             }
//           }
//         }
//       }
//     }
//   }
// `;
