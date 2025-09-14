export interface DatabaseInfo {
  name: string;
  version: number;
  objectStores: ObjectStoreInfo[];
}

export interface ObjectStoreInfo {
  name: string;
  keyPath: string | null;
  autoIncrement: boolean;
}

export interface RecordData {
  id?: unknown;
  data: Record<string, unknown>;
}

export interface IndexedDbState extends Record<string, unknown> {
  selectedDatabase: string;
  selectedStore: string;
  databases: DatabaseInfo[];
  records: RecordData[];
  newRecord: Record<string, unknown>;
  filterText: string;
  editingRecordId: unknown;
}
