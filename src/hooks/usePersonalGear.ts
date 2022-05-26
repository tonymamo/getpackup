import { ActivityTypes, GearItemType } from '@common/gearItem';
import { RootState } from '@redux/ducks';
import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';

const usePersonalGear = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const fetchedMasterGear = useSelector((state: RootState) => state.firestore.ordered.gear);
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);
  const fetchedGearClosetAdditions = useSelector(
    (state: RootState) => state.firestore.ordered.gearClosetAdditions
  );

  useFirestoreConnect([
    { collection: 'gear' },
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
    {
      collection: 'gear-closet',
      storeAs: 'gearClosetAdditions',
      doc: auth.uid,
      subcollections: [{ collection: 'additions' }],
    },
  ]);

  const masterGear = fetchedMasterGear ?? [];
  const gearClosetCategories: Array<keyof ActivityTypes> = fetchedGearCloset?.[0]?.categories ?? [];
  const gearClosetRemovals = fetchedGearCloset?.[0]?.removals ?? [];
  const gearClosetAdditions = fetchedGearClosetAdditions ?? [];

  // Only regenerate this data if the master gear, gear closet removals, or gear closet additions change
  const personalGear = useMemo(() => {
    // Shallow clone the gear list, so we don't modify the master gear list
    const customizedGear = [...masterGear];

    // Remove any Master Gear items that are in the Removals list
    gearClosetRemovals.forEach((itemToRemove: string) => {
      // Remove in-place, it's okay because customizedGear is a clone
      const removeIndex = customizedGear.findIndex((item) => item.id === itemToRemove);
      customizedGear.splice(removeIndex, 1);
    });

    // Then, filter out master gear items that match the categories a user selected when creating
    // their gear closet
    const matches: Array<GearItemType> = [];
    gearClosetCategories.forEach((matchingCategory: string) => {
      matches.push(
        ...customizedGear.filter((item: GearItemType) => item[matchingCategory] === true)
      );
    });

    return uniqBy(matches, 'name').concat(gearClosetAdditions);
  }, [masterGear, gearClosetRemovals, gearClosetAdditions]);

  if (!isLoaded(fetchedGearCloset)) {
    return 'loading';
  }
  return personalGear;
};

export default usePersonalGear;
