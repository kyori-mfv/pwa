import { useCallback } from "react";
import { toast } from "sonner";
import {
  addRecord as addDbRecord,
  createDatabase as createDb,
  deleteRecord as deleteDbRecord,
  getAllRecords,
  getDatabases,
  getObjectStores,
  openDatabase as openDb,
  updateRecord as updateDbRecord,
} from "../utils";

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
      const db = await openDb(name);
      const stores = getObjectStores(db);
      return { db, stores };
    } catch (error) {
      toast.error("Failed to open database");
      return null;
    }
  }, []);

  const loadRecords = useCallback(async (db: IDBDatabase, storeName: string) => {
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

  const createDatabase = useCallback(async () => {
    const name = prompt("Database name:");
    const storeName = prompt("Object store name:") || "records";

    if (!name) return null;

    try {
      await createDb(name, { name: storeName });
      toast.success("Database created successfully");
      return name;
    } catch (error) {
      toast.error("Failed to create database");
      return null;
    }
  }, []);

  const addRecord = useCallback(async (db: IDBDatabase, storeName: string, jsonInput: string) => {
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
  }, []);

  const updateRecord = useCallback(
    async (db: IDBDatabase, storeName: string, recordData: Record<string, unknown>) => {
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
    async (db: IDBDatabase, storeName: string, recordData: unknown) => {
      if (!db || !storeName) return false;

      try {
        const record = recordData as Record<string, unknown>;
        const key = record.id || record.key;
        if (key) {
          await deleteDbRecord(db, storeName, key as IDBValidKey);
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
    addRecord,
    updateRecord,
    deleteRecord,
  };
};
