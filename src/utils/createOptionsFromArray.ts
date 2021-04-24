// Takes an array of objects and spits out a value/label object that react-select needs
// like { value: 'key', label: 'key' },
export const createOptionsFromArrayOfObjects = (arr: Array<any>, key: string) =>
  arr.map((item) => {
    const obj = { value: '', label: '' };
    obj.value = item[key];
    obj.label = item[key];
    return obj;
  });

// Takes an array of strings and spits out a value/label object that react-select needs
// like { value: 'key', label: 'key' },
export const createOptionsFromArrayOfStrings = (arr: Array<string>) =>
  arr.map((item) => {
    const obj = { value: '', label: '' };
    obj.value = item;
    obj.label = item;
    return obj;
  });
