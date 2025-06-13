export interface ModelDB<T> {
  connection: unknown;

  getAll: ({
    name,
    page,
    limit,
  }: {
    name?: string;
    page?: number;
    limit?: number;
  }) => Promise<T[] | null>;

  getName: ({
    name,
    page,
    limit,
  }: {
    name: string;
    page?: number;
    limit?: number;
  }) => Promise<T[] | null>;

  getByDni: ({ dni }: { dni: string }) => Promise<T | null | undefined>;

  getByEmail: ({ email }: { email: string }) => Promise<T | null | undefined>;

  getById: ({ id }: { id: string }) => Promise<T | null | undefined>;

  add: ({ input }: { input: T }) => Promise<T>;

  update: ({ id, input }: { id: string; input: T }) => Promise<T>;

  delete: ({ id }: { id: string }) => Promise<boolean>;

  searchByField<K extends keyof T>({
    field,
    value,
  }: {
    field: K;
    value: T[K];
  }): Promise<T[]>;
}
