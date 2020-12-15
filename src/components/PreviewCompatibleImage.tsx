import React from 'react';
import Img, { FluidObject } from 'gatsby-image';

const PreviewCompatibleImage = ({
  imageInfo,
  ...rest
}: {
  imageInfo: {
    childImageSharp?: { fluid: FluidObject };
    image: { childImageSharp: { fluid: FluidObject } } | string;
    alt?: string;
  };
  // eslint-disable-next-line react/require-default-props
  style?: React.CSSProperties;
}) => {
  const imageStyle = { width: '100%' };
  const { alt = '', childImageSharp, image } = imageInfo;

  if (!!image && typeof image !== 'string' && !!image.childImageSharp) {
    return <Img style={imageStyle} fluid={image.childImageSharp.fluid} alt={alt} {...rest} />;
  }

  if (childImageSharp) {
    return <Img style={imageStyle} fluid={childImageSharp.fluid} alt={alt} {...rest} />;
  }

  if (!!image && typeof image === 'string') {
    return <img style={imageStyle} src={image} alt={alt} {...rest} />;
  }

  return null;
};

export default PreviewCompatibleImage;
