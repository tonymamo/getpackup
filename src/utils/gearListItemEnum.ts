import {
  FaBaby,
  FaBed,
  FaBicycle,
  FaBiking,
  FaBusAlt,
  FaCamera,
  FaCampground,
  FaCar,
  FaCaravan,
  FaChild,
  FaExclamationTriangle,
  FaFish,
  FaGlobeAmericas,
  FaHiking,
  FaHome,
  FaHotel,
  FaIcicles,
  FaMountain,
  FaPaw,
  FaPlane,
  FaRegHandRock,
  FaRunning,
  FaShip,
  FaSkiing,
  FaSkiingNordic,
  FaSnowboarding,
  FaSnowflake,
  FaSwimmer,
  FaTshirt,
  FaWarehouse,
  FaWater,
} from 'react-icons/fa';

import { GearListEnumType } from '@common/gearItem';

export const gearListCategories = [
  { value: 'Activity Gear', label: 'Activity Gear' },
  { value: 'Safety & Tools', label: 'Safety & Tools' },
  { value: 'Outerwear', label: 'Outerwear' },
  { value: 'Food & Water', label: 'Food & Water' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Accommodation', label: 'Accommodation' },
  { value: 'Camp Kitchen', label: 'Camp Kitchen' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Casual', label: 'Casual' },
  { value: 'International', label: 'International' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
  { value: '10 Essentials', label: '10 Essentials' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Kids', label: 'Kids' },
  { value: 'Baby', label: 'Baby' },
  { value: 'Pets', label: 'Pets' },
  { value: 'Pre-Trip', label: 'Pre-Trip' },
];

export const gearListTripType = [
  { name: 'dayTrip', label: 'Day Trip' },
  { name: 'multidayTrip', label: 'Multi-Day Trip' },
];

export const gearListActivities: GearListEnumType = [
  { name: 'hiking', label: 'Hiking', icon: FaHiking },
  // { name: 'biking', label: 'Biking', icon: FaBicycle},
  { name: 'paddling', label: 'Paddling', icon: FaWater },
  { name: 'surfing', label: 'Surfing', icon: FaSwimmer },
  { name: 'fishing', label: 'Fishing', icon: FaFish },
  { name: 'mountainBiking', label: 'Mountain Biking', icon: FaBicycle },
  { name: 'bikepacking', label: 'Bikepacking', icon: FaBiking },
  { name: 'trailRunning', label: 'Trail Running', icon: FaRunning },
  { name: 'bouldering', label: 'Bouldering', icon: FaRegHandRock },
  { name: 'sportClimbing', label: 'Sport Climbing', icon: FaMountain },
  { name: 'tradClimbing', label: 'Trad Climbing', icon: FaMountain },
  { name: 'iceClimbing', label: 'Ice Climbing', icon: FaIcicles },
  { name: 'mountaineering', label: 'Mountaineering', icon: FaMountain },
  { name: 'touring', label: 'Touring', icon: FaSkiing },
  { name: 'resort', label: 'Resort', icon: FaSnowboarding },
  { name: 'crossCountrySkiing', label: 'XC Skiing', icon: FaSkiingNordic },
  // { name: 'snowboarding', label: 'Snowboarding', icon: FaSnowboarding},
  { name: 'snowshoeing', label: 'Snowshoeing', icon: FaSnowflake },
];

export const gearListAccommodations: GearListEnumType = [
  { name: 'tent', label: 'Tent', icon: FaCampground },
  // { name: 'bivy', label: 'Bivy', icon: FaBed},
  { name: 'carCamp', label: 'Car Camp/RV', icon: FaCaravan },
  { name: 'basicHut', label: 'Basic Hut', icon: FaHome },
  { name: 'servicedHut', label: 'Serviced Hut', icon: FaWarehouse },
  { name: 'hostel', label: 'Hostel', icon: FaBed },
  { name: 'hotel', label: 'Hotel/Rental', icon: FaHotel },
];

export const gearListCampKitchen: GearListEnumType = [
  { name: 'carCamping', label: 'Car Camping', icon: FaCaravan },
  { name: 'backcountryThreeSeason', label: 'Backcountry 3-Season', icon: FaCampground },
  { name: 'backcountryWinter', label: 'Backcountry Winter', icon: FaSnowflake },
];

export const gearListOtherConsiderations: GearListEnumType = [
  { name: 'casual', label: 'Casual', icon: FaTshirt },
  { name: 'international', label: 'International', icon: FaGlobeAmericas },
  { name: 'photography', label: 'Photography', icon: FaCamera },
  { name: 'kids', label: 'Kids', icon: FaChild },
  { name: 'baby', label: 'Baby', icon: FaBaby },
  { name: 'pets', label: 'Pets', icon: FaPaw },
  { name: 'airplane', label: 'Airplane', icon: FaPlane },
  { name: 'car', label: 'Car', icon: FaCar },
  { name: 'bus', label: 'Bus', icon: FaBusAlt },
  { name: 'boat', label: 'Boat', icon: FaShip },
  // { name: 'train', label: 'Train', icon: FaTrain},
  // { name: 'motorcycle', label: 'Motorcycle', icon: FaMotorcycle},
  { name: 'essential', label: '10 Essentials', icon: FaExclamationTriangle },
];

export const allGearListItems = [
  // ...gearListTripType, // not really doing anything with day vs multiday yet
  ...gearListActivities,
  ...gearListAccommodations,
  ...gearListCampKitchen,
  ...gearListOtherConsiderations,
];

export const gearListKeys = [...allGearListItems].map((item) => item.name);
