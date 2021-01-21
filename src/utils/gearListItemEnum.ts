export const gearListCategories = [
  { value: 'Activity Gear', label: 'Activity Gear' },
  { value: 'Safety & Tools', label: 'Safety & Tools' },
  { value: 'Outerwear', label: 'Outerwear' },
  { value: 'Food & Water', label: 'Food & Water' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Accomodation', label: 'Accomodation' },
  { value: 'Camp Kitchen', label: 'Camp Kitchen' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Casual', label: 'Casual' },
  { value: 'International', label: 'International' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
  { value: '10 Essentials', label: '10 Essentials' },
];

export const gearListTripType = [
  { name: 'dayTrip', label: 'Day Trip' },
  { name: 'multidayTrip', label: 'Multi-Day Trip' },
];

export const gearListActivities = [
  { name: 'hiking', label: 'Hiking', icon: 'fa/FaHiking' },
  // { name: 'biking', label: 'Biking', icon: 'fa/FaBicycle' },
  { name: 'paddling', label: 'Paddling', icon: 'fa/FaWater' },
  { name: 'bouldering', label: 'Bouldering', icon: 'fa/FaRegHandRock' },
  { name: 'sportClimbing', label: 'Sport Climbing', icon: 'fa/FaMountain' },
  { name: 'tradClimbing', label: 'Trad Climbing', icon: 'fa/FaMountain' },
  { name: 'iceClimbing', label: 'Ice Climbing', icon: 'fa/FaIcicles' },
  { name: 'touring', label: 'Touring', icon: 'fa/FaSkiing' },
  { name: 'resort', label: 'Resort', icon: 'fa/FaSkiing' },
  // { name: 'snowboarding', label: 'Snowboarding', icon: 'fa/FaSnowboarding' },
  { name: 'snowshoeing', label: 'Snowshoeing', icon: 'fa/FaSnowflake' },
];

export const gearListAccommodations = [
  { name: 'hotel', label: 'Hotel', icon: 'fa/FaHotel' },
  { name: 'hostel', label: 'Hostel', icon: 'fa/FaBed' },
  { name: 'servicedHut', label: 'Serviced Hut', icon: 'fa/FaWarehouse' },
  { name: 'basicHut', label: 'Basic Hut', icon: 'fa/FaHome' },
  { name: 'carCamp', label: 'Car Camp/RV', icon: 'fa/FaCaravan' },
  { name: 'tent', label: 'Tent', icon: 'fa/FaCampground' },
  { name: 'bivy', label: 'Bivy', icon: 'fa/FaBed' },
];

export const gearListCampKitchen = [
  { name: 'backcountryThreeSeason', label: 'Backcountry 3-Season', icon: 'fa/FaCampground' },
  { name: 'backcountryWinter', label: 'Backcountry Winter', icon: 'fa/FaSnowflake' },
  { name: 'carCamping', label: 'Car Camping', icon: 'fa/FaCaravan' },
];

export const gearListOtherConsiderations = [
  { name: 'casual', label: 'Casual', icon: 'fa/FaTshirt' },
  { name: 'international', label: 'International', icon: 'fa/FaGlobeAmericas' },
  { name: 'photography', label: 'Photography', icon: 'fa/FaCamera' },
  { name: 'kids', label: 'Kids', icon: 'fa/FaChild' },
  { name: 'baby', label: 'Baby', icon: 'fa/FaBaby' },
  { name: 'pets', label: 'Pets', icon: 'fa/FaPaw' },
  { name: 'airplane', label: 'Airplane', icon: 'fa/FaPlane' },
  { name: 'car', label: 'Car', icon: 'fa/FaCar' },
  { name: 'bus', label: 'Bus', icon: 'fa/FaBusAlt' },
  // { name: 'boat', label: 'Boat', icon: 'fa/FaShip' },
  // { name: 'train', label: 'Train', icon: 'fa/FaTrain' },
  { name: 'motorcycle', label: 'Motorcycle', icon: 'fa/FaMotorcycle' },
  { name: 'essential', label: '10 Essentials', icon: 'fa/FaExclamationTriangle' },
];

export const allGearListItems = [
  ...gearListTripType,
  ...gearListActivities,
  ...gearListAccommodations,
  ...gearListCampKitchen,
  ...gearListOtherConsiderations,
];

export const gearListKeys = [...allGearListItems].map((item) => item.name);
