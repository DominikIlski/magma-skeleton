export const pickObjectKeys = <T extends object, K extends keyof T>(
  value: T,
  keys: Array<K>,
): Pick<T, K> => {
  const keysSet = new Set(keys);
  const filteredEntries = Object.entries(value).filter(([key]) =>
    keysSet.has(key as K),
  );

  return Object.fromEntries(filteredEntries) as Pick<T, K>;
};

export const omitObjectKeys = <T extends object, K extends keyof T>(
  value: T,
  keys: Array<K>,
): Pick<T, K> => {
  const keysSet = new Set(keys);
  const filteredEntries = Object.entries(value).filter(
    ([key]) => !keysSet.has(key as K),
  );

  return Object.fromEntries(filteredEntries) as Pick<T, K>;
};

export type ExcludePropsByClass<T, C> = Omit<T, keyof C>;
