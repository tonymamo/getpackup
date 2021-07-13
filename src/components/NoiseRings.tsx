/* eslint-disable no-plusplus */
import React, { FunctionComponent } from 'react';
import Random from 'canvas-sketch-util/random';
import { pathsToSVGPaths } from 'canvas-sketch-util/penplot';
import { mapRange, linspace } from 'canvas-sketch-util/math';
import { isoBands } from 'marchingsquares';

type NoiseRingsProps = {
  width: number;
  height: number;
  strokeWidth: number;
  seed: string;
};

function drawIsolines([xMin, xMax]: any, [yMin, yMax]: any) {
  const sizeX = xMax - xMin;
  const sizeY = yMax - yMin;
  const offset = [xMin, yMin];
  const intervals = linspace(12);
  const gridSize = 100;
  const lines: any[] = [];
  const data: any[] = [];

  // On a 100x100 grid get noise data
  for (let y = 0; y < gridSize; y++) {
    data[y] = [];
    for (let x = 0; x < gridSize; x++) {
      const scale = gridSize;
      const n = Random.noise2D(x / scale, y / scale);
      // noise data has a range of -1 to 1, we remap it to 0 to 1
      data[y].push(mapRange(n, -1, 1, 0, 1));
    }
  }

  // At Equally spaced intervals, generate isoBands
  intervals.forEach((_: any, idx: number) => {
    if (idx > 0) {
      const lowerBand = intervals[idx - 1];
      const upperBand = intervals[idx];

      isoBands(data, lowerBand, upperBand - lowerBand, {
        successCallback(bands: any) {
          bands.forEach((band: any) => {
            // The isoBand is generate in x: 0-100 and y: 0-100
            // Map that to the actual width and height of the image
            const scaledBand = band.map(([x, y]: any) => [
              offset[0] + mapRange(x, 0, 99, 0, sizeX),
              offset[1] + mapRange(y, 0, 99, 0, sizeY),
            ]);

            lines.push(scaledBand);
          });
        },
      });
    }
  });

  return lines;
}

const NoiseRings: FunctionComponent<NoiseRingsProps> = ({ width, height, strokeWidth, seed }) => {
  Random.setSeed(seed);

  const isoLines = drawIsolines([0, width], [0, height]);

  const paths = pathsToSVGPaths(isoLines, {
    width,
    height,
    units: 'px',
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={`${strokeWidth} ${strokeWidth} ${width - 2 * strokeWidth} ${height - strokeWidth}`}
    >
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="1502.42"
          y1="-337.797"
          x2="-544.778"
          y2="13.5806"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fafafa" />
          <stop offset="1" stopColor="#dbdbdb" />
        </linearGradient>
      </defs>
      <g
        strokeLinecap="round"
        strokeWidth={`${strokeWidth}px`}
        fill="none"
        stroke="url(#paint0_linear)"
        strokeOpacity="0.1"
      >
        {paths.map((d: any, idx: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <path key={idx} d={d} />
        ))}
      </g>
    </svg>
  );
};

export default NoiseRings;
