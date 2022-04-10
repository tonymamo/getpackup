import React, { FunctionComponent } from 'react';

import { lightestGray } from '@styles/color';

type ProgressBarProps = {
  completed: string | number;
  bgColor?: string;
  baseBgColor?: string;
  height?: string;
  width?: string;
  borderRadius?: string | number;
  margin?: string;
  padding?: string;
  labelAlignment?: 'left' | 'center' | 'right' | 'outside';
  labelColor?: string;
  labelSize?: string;
  isLabelVisible?: boolean;
  transitionDuration?: string;
  transitionTimingFunction?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  className?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  ariaValuemin?: number;
  ariaValuemax?: number;
  ariaValuetext?: number | null;
  maxCompleted?: number;
  customLabel?: string;
};

const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  bgColor,
  completed,
  baseBgColor,
  height,
  width,
  margin,
  padding,
  borderRadius,
  labelAlignment,
  labelColor,
  labelSize,
  isLabelVisible,
  transitionDuration,
  transitionTimingFunction,
  className,
  dir,
  ariaValuemin,
  ariaValuemax,
  ariaValuetext,
  maxCompleted,
  customLabel,
}) => {
  const getAlignment = (alignmentOption: ProgressBarProps['labelAlignment']) => {
    if (alignmentOption === 'left') {
      return 'flex-start';
    }
    if (alignmentOption === 'center') {
      return 'center';
    }
    if (alignmentOption === 'right') {
      return 'flex-end';
    }

    return null;
  };

  const alignment = getAlignment(labelAlignment);

  const getFillerWidth = (
    maxCompletedValue: ProgressBarProps['maxCompleted'],
    completedValue: ProgressBarProps['completed']
  ) => {
    if (maxCompletedValue) {
      const ratio = Number(completedValue) / maxCompletedValue;
      return ratio > 1 ? '100%' : `${ratio * 100}%`;
    }
    return 0;
  };

  const fillerWidth = getFillerWidth(maxCompleted || 100, completed);

  const containerStyles: React.CSSProperties = {
    height,
    backgroundColor: baseBgColor || lightestGray,
    borderRadius,
    padding,
    width,
    margin,
    overflow: 'hidden',
  };

  const fillerStyles: React.CSSProperties = {
    height,
    width: fillerWidth,
    backgroundColor: bgColor,
    transition: `width ${transitionDuration || '1s'} ${transitionTimingFunction || 'ease-in-out'}`,
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: labelAlignment !== 'outside' && alignment ? alignment : 'normal',
  };

  const labelStyles: React.CSSProperties = {
    padding: labelAlignment === 'outside' ? '0 0 0 5px' : '5px',
    color: labelColor,
    fontWeight: 'bold',
    fontSize: labelSize,
    display: !isLabelVisible ? 'none' : 'initial',
  };

  const outsideStyles = {
    display: labelAlignment === 'outside' ? 'flex' : 'initial',
    alignItems: labelAlignment === 'outside' ? 'center' : 'initial',
  };

  const completedStr = typeof completed === 'number' ? `${completed}%` : `${completed}`;

  const labelStr = customLabel || completedStr;

  return (
    <div
      style={outsideStyles}
      className={className}
      dir={dir}
      role="progressbar"
      aria-valuenow={parseFloat(labelStr)}
      aria-valuemin={ariaValuemin}
      aria-valuemax={ariaValuemax}
      aria-valuetext={`${ariaValuetext === null ? labelStr : ariaValuetext}`}
    >
      <div style={containerStyles}>
        <div style={fillerStyles}>
          {labelAlignment !== 'outside' && <span style={labelStyles}>{labelStr}</span>}
        </div>
      </div>
      {labelAlignment === 'outside' && <span style={labelStyles}>{labelStr}</span>}
    </div>
  );
};

export default ProgressBar;
