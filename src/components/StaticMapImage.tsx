/* eslint-disable import/no-unresolved */
import React, { FunctionComponent } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { StaticMap, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import loadable from '@loadable/component';

import { brandPrimary, white } from '@styles/color';
import { borderRadius, doubleSpacer, quarterSpacer, threeQuarterSpacer } from '@styles/size';
import { fontSizeSmall } from '@styles/typography';
import InlineLoader from './InlineLoader';

const mapboxgl = loadable.lib(() => import('mapbox-gl'), { fallback: <InlineLoader /> });

// Mapbox failing on prod builds, fixed by adding `worker-loader` package and the following line
// https://github.com/visgl/react-map-gl/issues/1266
// https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

type StaticMapImageProps = {
  lat: number;
  lng: number;
  height: number | string;
  width: number | string;
  zoom: number;
  label?: string;
};

const StyledMarkerText = styled.span`
  display: block;
  transform: translateX(
    -45%
  ); /* 45 works better to center than 50% for some reason? probably accounting for padding */
  font-size: ${fontSizeSmall};
  font-weight: bold;
  color: ${white};
  background: ${brandPrimary};
  padding: ${quarterSpacer} ${threeQuarterSpacer};
  border-radius: ${borderRadius};
  text-align: center;
  margin-top: ${quarterSpacer};
`;

const StaticMapImage: FunctionComponent<StaticMapImageProps> = ({
  lat,
  lng,
  width,
  height,
  zoom,
  label,
}) => (
  <StaticMap
    latitude={lat}
    longitude={lng}
    height={height}
    width={width}
    zoom={zoom}
    mapStyle="mapbox://styles/getpackup/cknw0bimf0s1q18nxauvs45jj"
    mapboxApiAccessToken={process.env.GATSBY_MAPBOX_API_KEY}
  >
    {label ? (
      <Marker latitude={lat} longitude={lng}>
        <FaMapMarkerAlt size={doubleSpacer} color={white} />
        <StyledMarkerText>{label}</StyledMarkerText>
      </Marker>
    ) : null}
  </StaticMap>
);

export default StaticMapImage;
