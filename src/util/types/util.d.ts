type DataFunction<Id, Type> = (intl: IntlShape) => Partial<Record<Id, Type>>;

type Omega<T> = { expansion: Expansion } & Partial<T>;
