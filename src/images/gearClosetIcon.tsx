import React, { FunctionComponent } from 'react';

type GearClosetIconProps = {
  size: number;
};

const GearClosetIcon: FunctionComponent<GearClosetIconProps> = ({ size, ...rest }) => {
  return (
    <>
      <svg
        width={size}
        height={size * 1.1374096}
        viewBox="0 0 76.05 86.5"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        fill="currentColor"
        {...rest}
      >
        <path
          fill="currentColor"
          // d="M13,15V83.38a7,7,0,0,0,7,7H49V8H20A7,7,0,0,0,13,15ZM42,45a1,1,0,0,1,2,0v8a1,1,0,0,1-2,0Z"
          // transform="translate(-13.98 -8.27)"
          d="M12,14.82V83.18a7,7,0,0,0,7,7H48V7.81H19A7,7,0,0,0,12,14.82ZM39.8,43.9a1.6,1.6,0,0,1,3.2,0V56.72a1.6,1.6,0,0,1-3.2,0Z"
          transform="translate(-11.98 -7.81)"
        />
        <path
          fill="currentColor"
          // d="M80,8H51V90.38H80a7,7,0,0,0,7-7V15A7,7,0,0,0,80,8ZM58,53a1,1,0,0,1-2,0V45a1,1,0,0,1,2,0Z"
          // transform="translate(-11.98 -8.27)"
          d="M81,7.81H52V90.19H81a7,7,0,0,0,7-7V14.82A7,7,0,0,0,81,7.81ZM60.2,56.72a1.6,1.6,0,0,1-3.2,0V43.9a1.6,1.6,0,0,1,3.2,0Z"
          transform="translate(-11.98 -7.81)"
        />
        <line
          stroke="currentColor"
          strokeWidth={10}
          strokeMiterlimit={10}
          x1="13.52"
          y1="86.5"
          x2="13.52"
          y2="62.9"
        />
        <line
          stroke="currentColor"
          strokeWidth={10}
          strokeMiterlimit={10}
          x1="62.52"
          y1="86.5"
          x2="62.52"
          y2="62.9"
        />
      </svg>
    </>
  );
};

export default GearClosetIcon;
