import React, { FunctionComponent } from 'react';

type WaveProps = {
  fill: string;
};

const Wave: FunctionComponent<WaveProps> = (props) => {
  return (
    <>
      <svg height="198" width="1600" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m1625 95c-311 0-445.9-34.3-847-34-400 0-514 34-803 34v77h1650s0-48 0-77z"
          fill={props.fill}
        />
      </svg>
    </>
  );
};

export default Wave;
