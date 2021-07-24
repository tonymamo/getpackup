import React, { FunctionComponent, useState, useRef } from 'react';
import styled from 'styled-components';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import format from 'date-fns/format';

import { brandPrimary, textColor, white, brandPrimaryRGB } from '@styles/color';
import { baseSpacer, borderRadius, doubleSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import { Button, Alert } from '@components';
import { StyledLabel } from '@components/Input';

type DayPickerInputProps = {
  initialValues: any;
  values: any;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string) => void;
  label: string;
  hiddenLabel?: boolean;
};

const DayPickerInputWrapper = styled.div`
  margin-bottom: ${baseSpacer};
  background-color: ${white};
  border: ${baseBorderStyle};
  border-radius: ${borderRadius};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${baseSpacer};

  & .DayPicker {
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  & .DayPicker-Day {
    border-radius: 0;
  }
  & .DayPicker-Day--today {
    color: ${textColor};
    font-weight: 700;
  }
  & .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    position: relative;
    background-color: ${brandPrimary};
    color: ${white};
  }
  &
    .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background-color: rgba(${brandPrimaryRGB}, 0.25);
    border-radius: ${doubleSpacer};
  }
  &
    .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: ${brandPrimary};
    color: ${white};
  }
  & .DayPicker-Day--start {
    border-top-left-radius: ${doubleSpacer} !important;
    border-bottom-left-radius: ${doubleSpacer} !important;
  }
  & .DayPicker-Day--end {
    border-top-right-radius: ${doubleSpacer} !important;
    border-bottom-right-radius: ${doubleSpacer} !important;
  }
`;

const DayPickerInput: FunctionComponent<DayPickerInputProps> = ({
  initialValues,
  values,
  setFieldTouched,
  setFieldValue,
  label,
  hiddenLabel,
}) => {
  const dateFormat = 'MM/dd/yyyy';

  const [fromDate, setFromDate] = useState<Date | undefined>(initialValues.startDate as Date);
  const [toDate, setToDate] = useState<Date | undefined>(initialValues.endDate as Date);
  const [enteredTo, setEnteredTo] = useState<Date | undefined>(initialValues.endDate as Date);

  const isSelectingFirstDay = (from: Date | undefined, to: Date | undefined, day: Date) => {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  };

  const inputRef = useRef<DayPicker>();

  const handleDayClick = (day: Date) => {
    const newRange = DateUtils.addDayToRange(day, {
      from: day,
      to: toDate as Date,
    });

    if (inputRef && inputRef.current) {
      inputRef.current.setState({ month: day });
    }

    setFieldTouched('startDate');
    setFieldTouched('endDate');

    if (fromDate && toDate && day >= fromDate && day <= toDate) {
      setFromDate(undefined);
      setToDate(undefined);
      setEnteredTo(undefined);
      return;
    }
    if (isSelectingFirstDay(fromDate, toDate, day)) {
      setFromDate(day);
      setToDate(undefined);
      setEnteredTo(undefined);
      setFieldValue('startDate', newRange.from ? format(newRange.from, dateFormat) : undefined);
    } else {
      setToDate(newRange.to);
      setEnteredTo(newRange.to);
      setFieldValue('endDate', newRange.to ? format(newRange.to, dateFormat) : undefined);
    }
  };

  const handleDayMouseEnter = (day: Date) => {
    if (!isSelectingFirstDay(fromDate, toDate, day)) {
      setEnteredTo(day);
    }
  };
  return (
    <>
      {!hiddenLabel && <StyledLabel required>{label}</StyledLabel>}
      <DayPickerInputWrapper>
        <DayPicker
          showOutsideDays
          initialMonth={initialValues.startDate ? new Date(initialValues.startDate) : new Date()}
          numberOfMonths={2}
          modifiers={{ start: fromDate, end: toDate }}
          disabledDays={{ before: new Date() }}
          selectedDays={[fromDate, { from: fromDate as Date, to: enteredTo as Date }]}
          onDayClick={(day: Date) => handleDayClick(day)}
          onDayMouseEnter={handleDayMouseEnter}
          ref={inputRef}
        />
        {!fromDate && !toDate && (
          <Alert type="info" message="Please select the first day of the trip." />
        )}
        {fromDate && !toDate && (
          <Alert
            type="info"
            message="Please select the last day of the trip, or same day again for a Day Trip."
          />
        )}
        {fromDate && toDate && initialValues.startDate !== values.startDate && (
          <Button
            type="button"
            color="tertiary"
            size="small"
            onClick={() => {
              setFromDate(initialValues.startDate as Date);
              setToDate(initialValues.endDate as Date);
              setEnteredTo(initialValues.endDate as Date);
              setFieldValue('startDate', initialValues.startDate);
              setFieldValue('endDate', initialValues.endDate);
              if (inputRef && inputRef.current && initialValues.startDate instanceof Date) {
                inputRef.current.showMonth(initialValues.startDate as Date);
              }
            }}
          >
            Reset
          </Button>
        )}
      </DayPickerInputWrapper>
    </>
  );
};

export default DayPickerInput;
