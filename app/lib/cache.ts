export const createSingleton = <TValue>(
  retrieveValue: () => Promise<TValue>,
) => {
  let cachedValue: TValue | null = null;

  return {
    getValue: async () => {
      if (!cachedValue) {
        cachedValue = await retrieveValue();
      }

      return cachedValue!;
    },
    clearCache: () => {
      cachedValue = null;
    },
  };
};
