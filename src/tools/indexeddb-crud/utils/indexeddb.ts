import type { DatabaseInfo, ObjectStoreInfo } from "../types";

const DATABASE_VERSION = 1;

export async function getDatabases(): Promise<DatabaseInfo[]> {
  if (!("databases" in indexedDB)) {
    return [];
  }

  try {
    const dbs = await indexedDB.databases();
    return dbs.map((db) => ({
      name: db.name || "",
      version: db.version || DATABASE_VERSION,
      objectStores: [],
    }));
  } catch {
    return [];
  }
}

export async function openDatabase(name: string, version?: number): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // Create default object store if none exist
      if (db.objectStoreNames.length === 0) {
        db.createObjectStore("records", { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

export function getObjectStores(db: IDBDatabase): ObjectStoreInfo[] {
  const stores: ObjectStoreInfo[] = [];

  for (let i = 0; i < db.objectStoreNames.length; i++) {
    const name = db.objectStoreNames[i];
    const transaction = db.transaction(name, "readonly");
    const store = transaction.objectStore(name);

    stores.push({
      name,
      keyPath: store.keyPath as string | null,
      autoIncrement: store.autoIncrement,
    });
  }

  return stores;
}

export async function getAllRecords(db: IDBDatabase, storeName: string): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function addRecord(
  db: IDBDatabase,
  storeName: string,
  data: unknown
): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function updateRecord(
  db: IDBDatabase,
  storeName: string,
  data: unknown
): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function deleteRecord(
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function createDatabase(
  name: string,
  storeConfig: { name: string; keyPath?: string; autoIncrement?: boolean }
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, DATABASE_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(storeConfig.name, {
        keyPath: storeConfig.keyPath || "id",
        autoIncrement: storeConfig.autoIncrement ?? true,
      });
    };
  });
}
