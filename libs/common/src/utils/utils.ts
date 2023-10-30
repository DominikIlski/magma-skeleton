export type ExcludePropsByClass<T, C> = Omit<T, keyof C>;
