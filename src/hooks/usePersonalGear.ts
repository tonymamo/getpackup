import { useMemo } from 'react';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import { RootState } from '@redux/ducks';

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
  const gearClosetRemovals = fetchedGearCloset?.[0]?.removals ?? [];
  const gearClosetAdditions = fetchedGearClosetAdditions ?? [];

  // Only regenerate this data if the master gear, gear closet removals, or gear closet additions change
  const personalGear = useMemo(() => {
    // Shallow clone the gear list, so we don't modify the master gear list
    const customizedGear = [...masterGear];
    gearClosetRemovals.forEach((itemToRemove: string) => {
      // Remove in-place, it's okay because customizedGear is a clone
      const removeIndex = customizedGear.findIndex((item) => item.id === itemToRemove);
      customizedGear.splice(removeIndex, 1);
    });

    return customizedGear.concat(gearClosetAdditions);
  }, [masterGear, gearClosetRemovals, gearClosetAdditions]);

  if (!isLoaded(fetchedGearCloset)) {
    return 'loading';
  }
  return personalGear;
};

export default usePersonalGear;
