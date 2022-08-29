import { FixedImageType, FluidImageType } from '@common/image';
import Img from 'gatsby-image';
/* eslint-disable react/require-default-props */
import React from 'react';

const PreviewCompatibleImage = ({
  imageInfo,
  height,
  ...rest
}: {
  imageInfo: {
    image: FluidImageType | FixedImageType | string;
    alt?: string;
  };

  style?: React.CSSProperties;
  width?: string;
  height?: string;
}) => {
  const imageStyle = {
    width: '100%',
    height: height || 'auto',
  };
  const { alt = '', image } = imageInfo;

  const isFluidImage =
    !!image && typeof image !== 'string' && Object.prototype.hasOwnProperty.call(image, 'fluid');
  const isFixedImage =
    !!image && typeof image !== 'string' && Object.prototype.hasOwnProperty.call(image, 'fixed');

  if (typeof image !== 'string' && isFluidImage) {
    return <Img style={imageStyle} fluid={(image as FluidImageType).fluid} alt={alt} {...rest} />;
  }

  if (typeof image !== 'string' && isFixedImage) {
    return <Img style={imageStyle} fixed={(image as FixedImageType).fixed} alt={alt} {...rest} />;
  }

  if (!isFluidImage && !isFixedImage && typeof image === 'string') {
    return <img style={imageStyle} src={image} alt={alt} {...rest} />;
  }

  return null;
};

export default PreviewCompatibleImage;
