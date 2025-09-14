import Dexie, { type IndexableType } from "dexie";
import type { DatabaseInfo, ObjectStoreInfo } from "../types";

export interface IndexDefinition {
  name: string;
  keyPath: string;
  unique?: boolean;
  multiEntry?: boolean;
}

export interface ObjectStoreDefinition {
  name: string;
  keyPath: string;
  autoIncrement?: boolean; // defaults to true
  indexes?: IndexDefinition[];
}

export interface DatabaseDefinition {
  name: string;
  version?: number;
  objectStores?: ObjectStoreDefinition[];
}

// Dynamic database class that can be configured at runtime
export class DynamicDatabase extends Dexie {
  [key: string]: unknown; // Allow dynamic table access

  constructor(name: string, version?: number) {
    super(name);

    // If version is provided, set up with empty schema
    if (version) {
      this.version(version).stores({});
    }
    // For existing databases, we'll use Dexie's auto-detection
    // by not defining any schema initially
  }

  // Get current schema as a record
  getCurrentSchema(): Record<string, string> {
    const schema: Record<string, string> = {};

    for (const table of this.tables) {
      // Convert table schema back to Dexie schema string
      let schemaString = "";

      if (table.schema.primKey.auto) {
        schemaString = `++${table.schema.primKey.keyPath || "id"}`;
      } else if (table.schema.primKey.keyPath) {
        schemaString = table.schema.primKey.keyPath as string;
      } else {
        schemaString = "++id"; // fallback
      }

      // Add indexes
      const indexes = table.schema.indexes.map((index) => index.keyPath).join(", ");
      if (indexes) {
        schemaString += `, ${indexes}`;
      }

      schema[table.name] = schemaString;
    }

    return schema;
  }

  // Dynamically add object store using raw IndexedDB for reliability
  async addObjectStore(storeConfig: ObjectStoreDefinition): Promise<void> {
    const dbName = this.name;

    // Get the actual current version from IndexedDB, not from Dexie
    const currentVersion = await new Promise<number>((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onsuccess = () => {
        const version = request.result.version;
        request.result.close();
        resolve(version);
      };
      request.onerror = () => reject(request.error);
    });

    const newVersion = currentVersion + 1;

    // Create schema string for logging
    let schemaString = "";
    if (storeConfig.autoIncrement) {
      schemaString = `++${storeConfig.keyPath}`;
    } else {
      schemaString = storeConfig.keyPath;
    }

    if (storeConfig.indexes && storeConfig.indexes.length > 0) {
      const indexPaths = storeConfig.indexes.map((index) => {
        let path = index.keyPath;
        if (index.unique) path = `&${path}`;
        if (index.multiEntry) path = `*${path}`;
        return path;
      });
      schemaString += `, ${indexPaths.join(", ")}`;
    }

    // Close current Dexie connection completely
    this.close();

    // Wait for connection to close
    await new Promise((resolve) => setTimeout(resolve, 100));

    return new Promise((resolve, reject) => {
      // Use raw IndexedDB for more reliable schema updates
      const request = indexedDB.open(dbName, newVersion);

      request.onerror = () => {
        reject(request.error || new Error("Database open failed"));
      };

      request.onblocked = () => {
        reject(new Error("Database upgrade blocked"));
      };

      request.onsuccess = () => {
        const db = request.result;

        // Verify the object store was created
        if (db.objectStoreNames.contains(storeConfig.name)) {
          db.close();
          resolve();
        } else {
          db.close();
          reject(new Error(`Object store '${storeConfig.name}' was not created`));
        }
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        try {
          // Check if object store already exists
          if (db.objectStoreNames.contains(storeConfig.name)) {
            return;
          }

          // Prepare object store options
          const options: IDBObjectStoreParameters = {
            keyPath: storeConfig.keyPath.trim(),
            autoIncrement: storeConfig.autoIncrement ?? true,
          };

          // Create the object store
          const objectStore = db.createObjectStore(storeConfig.name, options);

          // Create indexes if specified
          if (storeConfig.indexes && storeConfig.indexes.length > 0) {
            for (const indexDef of storeConfig.indexes) {
              if (!indexDef.name.trim() || !indexDef.keyPath.trim()) {
                continue;
              }

              try {
                objectStore.createIndex(indexDef.name.trim(), indexDef.keyPath.trim(), {
                  unique: indexDef.unique || false,
                  multiEntry: indexDef.multiEntry || false,
                });
              } catch (indexError) {
                // Index creation failed, continue with other indexes
              }
            }
          }
        } catch (error) {
          reject(error);
        }
      };
    });
  }

  // Remove object store
  async removeObjectStore(storeName: string): Promise<void> {
    const currentSchema = this.getCurrentSchema();

    if (!currentSchema[storeName]) {
      throw new Error(`Object store '${storeName}' does not exist`);
    }

    delete currentSchema[storeName];

    // Close current connection and wait for it to close completely
    this.close();

    // Wait a brief moment to ensure the connection is fully closed
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Define the new schema with the new version
    this.version(this.verno + 1).stores(currentSchema);

    // Open the database with the new schema and wait for the upgrade to complete
    await this.open();

    // Verify the object store was removed
    if (this.tables.some((table) => table.name === storeName)) {
      throw new Error(`Object store '${storeName}' was not removed properly`);
    }
  }

  // Get object store information
  getObjectStoreInfo(storeName: string): ObjectStoreInfo | null {
    const table = this.table(storeName);
    if (!table) return null;

    return {
      name: storeName,
      keyPath: table.schema.primKey.keyPath as string | null,
      autoIncrement: table.schema.primKey.auto || false,
    };
  }

  // Get all object stores
  getObjectStores(): ObjectStoreInfo[] {
    return this.tables.map((table) => ({
      name: table.name,
      keyPath: table.schema.primKey.keyPath as string | null,
      autoIncrement: table.schema.primKey.auto || false,
    }));
  }
}

// Global registry of databases
const databaseRegistry = new Map<string, DynamicDatabase>();

// Get all available databases
export async function getDatabases(): Promise<DatabaseInfo[]> {
  try {
    // Use the browser's indexedDB.databases() if available
    if ("databases" in indexedDB) {
      const dbs = await indexedDB.databases();
      return dbs
        .filter((db) => db.name)
        .map((db) => ({
          name: db.name || "",
          version: db.version || 1,
          objectStores: [], // Will be populated when database is opened
        }));
    }

    // Fallback: return databases from our registry
    const databases: DatabaseInfo[] = [];
    for (const [name, db] of databaseRegistry.entries()) {
      databases.push({
        name,
        version: db.verno,
        objectStores: db.getObjectStores(),
      });
    }
    return databases;
  } catch (error) {
    return [];
  }
}

// Open a database and return connection info
export async function openDatabase(
  name: string,
  version?: number
): Promise<{ db: DynamicDatabase; stores: ObjectStoreInfo[] } | null> {
  try {
    let db = databaseRegistry.get(name);
    let wasNewConnection = false;

    if (!db) {
      db = new DynamicDatabase(name, version);
      await db.open();
      databaseRegistry.set(name, db);
      wasNewConnection = true;
    } else {
      // Always check if the database version matches what's actually in IndexedDB
      const actualVersion = await new Promise<number>((resolve, reject) => {
        const request = indexedDB.open(name);
        request.onsuccess = () => {
          const ver = request.result.version;
          request.result.close();
          resolve(ver);
        };
        request.onerror = () => reject(request.error);
      });

      if (actualVersion !== db.verno || (version && version > actualVersion)) {
        db.close();
        db = new DynamicDatabase(name);
        await db.open();
        databaseRegistry.set(name, db);
        wasNewConnection = true;
      }
    }

    const stores = db.getObjectStores();

    if (wasNewConnection) {
    }

    return { db, stores };
  } catch (error) {
    return null;
  }
}

// Create a new database
export async function createDatabase(name: string, version = 1): Promise<DynamicDatabase> {
  const db = new DynamicDatabase(name, version);
  await db.open();
  databaseRegistry.set(name, db);

  return db;
}

// Create object store in existing database
export async function createObjectStore(
  databaseName: string,
  storeConfig: ObjectStoreDefinition
): Promise<DynamicDatabase> {
  const db = databaseRegistry.get(databaseName);

  if (!db) {
    throw new Error(`Database ${databaseName} not found`);
  }

  await db.addObjectStore(storeConfig);

  // After the raw IndexedDB upgrade, we need to recreate the Dexie instance
  // with the proper schema so it recognizes the new object store
  db.close();
  databaseRegistry.delete(databaseName);

  // Create a new Dexie instance and open without specifying version (let it auto-detect)
  const newDb = new DynamicDatabase(databaseName);
  await newDb.open();
  databaseRegistry.set(databaseName, newDb);

  // Verify the object store is accessible
  const table = newDb.table(storeConfig.name);
  if (!table) {
    throw new Error(`Object store '${storeConfig.name}' is not accessible after creation`);
  }

  return newDb;
}

// Get all records from an object store
export async function getAllRecords(db: DynamicDatabase, storeName: string): Promise<unknown[]> {
  return await db.table(storeName).toArray();
}

// Add a record to an object store
export async function addRecord(
  db: DynamicDatabase,
  storeName: string,
  data: unknown
): Promise<unknown> {
  return await db.table(storeName).add(data);
}

// Update a record in an object store
export async function updateRecord(
  db: DynamicDatabase,
  storeName: string,
  data: unknown
): Promise<unknown> {
  return await db.table(storeName).put(data);
}

// Delete a record from an object store
export async function deleteRecord(
  db: DynamicDatabase,
  storeName: string,
  key: IndexableType
): Promise<void> {
  await db.table(storeName).delete(key);
}

// Delete a database
export async function deleteDatabase(name: string): Promise<void> {
  const db = databaseRegistry.get(name);
  if (db) {
    db.close();
    databaseRegistry.delete(name);
  }

  await Dexie.delete(name);
}

// Delete object store from database
export async function deleteObjectStore(
  databaseName: string,
  objectStoreName: string
): Promise<DynamicDatabase> {
  const db = databaseRegistry.get(databaseName);
  if (!db) {
    throw new Error(`Database ${databaseName} not found`);
  }

  await db.removeObjectStore(objectStoreName);
  return db;
}
