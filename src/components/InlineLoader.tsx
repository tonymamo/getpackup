import React, { FunctionComponent } from 'react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { Heading } from '@components';
import { baseSpacer, quadrupleSpacer } from '@styles/size';
import { brandPrimary } from '@styles/color';

type InlineLoaderProps = {};

const InlineLoader: FunctionComponent<InlineLoaderProps> = () => {
  return (
    <div
      style={{
        margin: baseSpacer,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Loader type="Rings" color={brandPrimary} height={quadrupleSpacer} width={quadrupleSpacer} />
      <Heading as="h6" uppercase>
        Loading...
      </Heading>
    </div>
  );
};

export default InlineLoader;
