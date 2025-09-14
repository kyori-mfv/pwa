import type { IndexableType } from "dexie";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  type DynamicDatabase,
  type ObjectStoreDefinition,
  addRecord as addDbRecord,
  createDatabase as createDb,
  createObjectStore,
  deleteDatabase,
  deleteRecord as deleteDbRecord,
  deleteObjectStore,
  getAllRecords,
  getDatabases,
  openDatabase as openDb,
  updateRecord as updateDbRecord,
} from "../utils/dexie-db";

export const useIndexedDb = () => {
  const loadDatabases = useCallback(async () => {
    try {
      return await getDatabases();
    } catch (error) {
      toast.error("Failed to load databases");
      return [];
    }
  }, []);

  const openDatabase = useCallback(async (name: string) => {
    try {
      const result = await openDb(name);
      return result;
    } catch (error) {
      toast.error("Failed to open database");
      return null;
    }
  }, []);

  const loadRecords = useCallback(async (db: DynamicDatabase, storeName: string) => {
    try {
      const records = await getAllRecords(db, storeName);
      return records.map((data) => ({
        id: (data as Record<string, unknown>).id || crypto.randomUUID(),
        data: data as Record<string, unknown>,
      }));
    } catch (error) {
      toast.error("Failed to load records");
      return [];
    }
  }, []);

  const createDatabase = useCallback(async (data: { name: string; version: number }) => {
    try {
      await createDb(data.name, data.version);
      toast.success("Database created successfully");
      return data.name;
    } catch (error) {
      toast.error("Failed to create database");
      return null;
    }
  }, []);

  const createObjectStoreInDatabase = useCallback(
    async (databaseName: string, storeConfig: ObjectStoreDefinition) => {
      try {
        console.log("Creating object store in database:", databaseName);

        // Create the object store (this function will handle database connections internally)
        await createObjectStore(databaseName, storeConfig);
        toast.success("Object store created successfully");
        return true;
      } catch (error) {
        console.error("Error creating object store:", error);
        toast.error(`Failed to create object store: ${error}`);
        return false;
      }
    },
    []
  );

  const deleteDatabaseByName = useCallback(async (name: string) => {
    try {
      await deleteDatabase(name);
      toast.success("Database deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete database");
      return false;
    }
  }, []);

  const deleteObjectStoreFromDatabase = useCallback(
    async (databaseName: string, storeName: string) => {
      try {
        await deleteObjectStore(databaseName, storeName);
        toast.success("Object store deleted successfully");
        return true;
      } catch (error) {
        toast.error("Failed to delete object store");
        return false;
      }
    },
    []
  );

  const addRecord = useCallback(
    async (db: DynamicDatabase, storeName: string, jsonInput: string) => {
      if (!db || !storeName || !jsonInput.trim()) return false;

      try {
        // Parse JSON when adding record
        const recordData = JSON.parse(jsonInput);
        await addDbRecord(db, storeName, recordData);
        toast.success("Record added successfully");
        return true;
      } catch (error) {
        if (error instanceof SyntaxError) {
          toast.error("Invalid JSON format");
        } else {
          toast.error("Failed to add record");
        }
        return false;
      }
    },
    []
  );

  const updateRecord = useCallback(
    async (db: DynamicDatabase, storeName: string, recordData: Record<string, unknown>) => {
      if (!db || !storeName) return false;

      try {
        await updateDbRecord(db, storeName, recordData);
        toast.success("Record updated successfully");
        return true;
      } catch (error) {
        toast.error("Failed to update record");
        return false;
      }
    },
    []
  );

  const deleteRecord = useCallback(
    async (db: DynamicDatabase, storeName: string, recordData: unknown) => {
      if (!db || !storeName) return false;

      try {
        const record = recordData as Record<string, unknown>;
        const key = record.id || record.key;
        if (key) {
          await deleteDbRecord(db, storeName, key as IndexableType);
          toast.success("Record deleted successfully");
          return true;
        }
        return false;
      } catch (error) {
        toast.error("Failed to delete record");
        return false;
      }
    },
    []
  );

  return {
    loadDatabases,
    openDatabase,
    loadRecords,
    createDatabase,
    createObjectStoreInDatabase,
    deleteDatabaseByName,
    deleteObjectStoreFromDatabase,
    addRecord,
    updateRecord,
    deleteRecord,
  };
};
