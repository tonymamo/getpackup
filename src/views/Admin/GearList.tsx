import React, { FunctionComponent, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { RootState } from '@redux/ducks';
import { EditableTable } from '@components';

type GearListProps = {};

const GearList: FunctionComponent<GearListProps> = () => {
  const gear = useSelector((state: RootState) => state.firestore.ordered.gear);
  useFirestoreConnect([{ collection: 'gear' }]);

  const [skipPageReset, setSkipPageReset] = useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    console.log(rowIndex, columnId, value);

    // setData((old) =>
    //   old.map((row, index) => {
    //     if (index === rowIndex) {
    //       return {
    //         ...old[rowIndex],
    //         [columnId]: value,
    //       };
    //     }
    //     return row;
    //   })
    // );
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    setSkipPageReset(false);
  }, [gear]);

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name',
      },
      {
        header: 'Category',
        accessor: 'category',
      },
      {
        header: 'Day Trip',
        accessor: 'dayTrip',
      },
      {
        header: 'Multi-Day Trip',
        accessor: 'multidayTrip',
      },
      {
        header: 'Hiking',
        accessor: 'hiking',
      },
    ],
    []
  );

  const data =
    gear &&
    gear.length > 0 &&
    gear.map((item) => {
      return {
        ...item,
        dayTrip: item.dayTrip.toString(),
        multidayTrip: item.multidayTrip.toString(),
        hiking: item.multidayTrip.toString(),
      };
    });

  return (
    <div>
      {gear && (
        <EditableTable
          columns={columns}
          data={data}
          hasPagination
          hasSorting
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
        />
      )}
    </div>
  );
};

export default GearList;
