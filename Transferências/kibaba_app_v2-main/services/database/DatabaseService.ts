import { Platform } from "react-native"
import NetInfo from "@react-native-community/netinfo"
import * as SQLite from "expo-sqlite"
import { supabase } from "./supabaseClient"
import { v4 as uuidv4 } from "uuid"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SyncQueue } from "./SyncQueue"
import { ConflictResolver } from "./ConflictResolver"

// Database tables
export const TABLES = {
  USER_PROFILE: "user_profiles",
  CYCLE_DATA: "cycle_data",
  TEMPERATURE_READINGS: "temperature_readings",
  SYMPTOMS: "symptoms",
  NOTES: "notes",
  POSTS: "posts",
  COMMENTS: "comments",
}

export class DatabaseService {
  private db: SQLite.SQLiteDatabase
  private isOnline = false
  private syncQueue: SyncQueue
  private conflictResolver: ConflictResolver
  private syncInProgress = false
  private lastSyncTimestamp = 0

  constructor() {
    // Open SQLite database
    this.db = SQLite.openDatabase("kandimba.db")
    this.syncQueue = new SyncQueue()
    this.conflictResolver = new ConflictResolver()

    // Initialize database
    this.initDatabase()

    // Monitor network status
    this.setupNetworkMonitoring()

    // Load last sync timestamp
    this.loadLastSyncTimestamp()
  }

  private async loadLastSyncTimestamp() {
    try {
      const timestamp = await AsyncStorage.getItem("lastSyncTimestamp")
      if (timestamp) {
        this.lastSyncTimestamp = Number.parseInt(timestamp, 10)
      }
    } catch (error) {
      console.error("Failed to load last sync timestamp:", error)
    }
  }

  private async saveLastSyncTimestamp(timestamp: number) {
    try {
      await AsyncStorage.getItem("lastSyncTimestamp")
      this.lastSyncTimestamp = timestamp
    } catch (error) {
      console.error("Failed to save last sync timestamp:", error)
    }
  }

  private setupNetworkMonitoring() {
    // Subscribe to network info updates
    NetInfo.addEventListener((state) => {
      const wasOnline = this.isOnline
      this.isOnline = state.isConnected && state.isInternetReachable

      // If we just came online, trigger sync
      if (!wasOnline && this.isOnline) {
        this.syncWithRemoteDatabase()
      }
    })
  }

  private initDatabase() {
    // Create tables if they don't exist
    this.db.transaction(
      (tx) => {
        // User profiles table
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${TABLES.USER_PROFILE} (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT,
          email TEXT,
          avatar_url TEXT,
          preferences TEXT,
          created_at INTEGER,
          updated_at INTEGER,
          is_synced INTEGER DEFAULT 0,
          is_deleted INTEGER DEFAULT 0,
          server_updated_at INTEGER DEFAULT 0
        );
      `)

        // Cycle data table
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${TABLES.CYCLE_DATA} (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          cycle_start_date INTEGER,
          cycle_end_date INTEGER,
          cycle_length INTEGER,
          period_length INTEGER,
          notes TEXT,
          created_at INTEGER,
          updated_at INTEGER,
          is_synced INTEGER DEFAULT 0,
          is_deleted INTEGER DEFAULT 0,
          server_updated_at INTEGER DEFAULT 0
        );
      `)

        // Temperature readings table
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${TABLES.TEMPERATURE_READINGS} (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          date INTEGER,
          temperature REAL,
          notes TEXT,
          created_at INTEGER,
          updated_at INTEGER,
          is_synced INTEGER DEFAULT 0,
          is_deleted INTEGER DEFAULT 0,
          server_updated_at INTEGER DEFAULT 0
        );
      `)

        // Symptoms table
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${TABLES.SYMPTOMS} (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          date INTEGER,
          symptom_type TEXT,
          intensity INTEGER,
          notes TEXT,
          created_at INTEGER,
          updated_at INTEGER,
          is_synced INTEGER DEFAULT 0,
          is_deleted INTEGER DEFAULT 0,
          server_updated_at INTEGER DEFAULT 0
        );
      `)

        // Notes table
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${TABLES.NOTES} (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          date INTEGER,
          content TEXT,
          created_at INTEGER,
          updated_at INTEGER,
          is_synced INTEGER DEFAULT 0,
          is_deleted INTEGER DEFAULT 0,
          server_updated_at INTEGER DEFAULT 0
        );
      `)

        // Posts table
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${TABLES.POSTS} (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT,
          content TEXT,
          post_type TEXT,
          media_urls TEXT,
          created_at INTEGER,
          updated_at INTEGER,
          is_synced INTEGER DEFAULT 0,
          is_deleted INTEGER DEFAULT 0,
          server_updated_at INTEGER DEFAULT 0
        );
      `)

        // Comments table
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${TABLES.COMMENTS} (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          post_id TEXT,
          content TEXT,
          parent_comment_id TEXT,
          created_at INTEGER,
          updated_at INTEGER,
          is_synced INTEGER DEFAULT 0,
          is_deleted INTEGER DEFAULT 0,
          server_updated_at INTEGER DEFAULT 0
        );
      `)

        // Sync queue table
        tx.executeSql(`
        CREATE TABLE IF NOT EXISTS sync_queue (
          id TEXT PRIMARY KEY,
          table_name TEXT NOT NULL,
          record_id TEXT NOT NULL,
          operation TEXT NOT NULL,
          data TEXT,
          created_at INTEGER
        );
      `)
      },
      (error) => {
        console.error("Error creating database tables:", error)
      },
    )
  }

  // Generic CRUD operations

  async create(table: string, data: any): Promise<string> {
    const id = data.id || uuidv4()
    const now = Date.now()
    const record = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      is_synced: 0,
      is_deleted: 0,
      server_updated_at: 0,
    }

    return new Promise((resolve, reject) => {
      // Convert record to columns and values
      const columns = Object.keys(record).join(", ")
      const placeholders = Object.keys(record)
        .map(() => "?")
        .join(", ")
      const values = Object.values(record)

      this.db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
          values,
          (_, result) => {
            // Add to sync queue if online
            if (this.isOnline) {
              this.syncQueue.addToQueue(table, id, "INSERT", record)
              this.attemptSync()
            }
            resolve(id)
          },
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  async read(table: string, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${table} WHERE id = ? AND is_deleted = 0`,
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0))
            } else {
              resolve(null)
            }
          },
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  async readAll(table: string, conditions = "", params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${table} WHERE is_deleted = 0 ${conditions ? "AND " + conditions : ""}`

      this.db.transaction((tx) => {
        tx.executeSql(
          query,
          params,
          (_, result) => {
            const items = []
            for (let i = 0; i < result.rows.length; i++) {
              items.push(result.rows.item(i))
            }
            resolve(items)
          },
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  async update(table: string, id: string, data: any): Promise<boolean> {
    const now = Date.now()
    const record = {
      ...data,
      updated_at: now,
      is_synced: 0,
    }

    // Remove id from the record to avoid updating it
    delete record.id

    return new Promise((resolve, reject) => {
      // Convert record to SET clause
      const setClause = Object.keys(record)
        .map((key) => `${key} = ?`)
        .join(", ")
      const values = [...Object.values(record), id]

      this.db.transaction((tx) => {
        tx.executeSql(
          `UPDATE ${table} SET ${setClause} WHERE id = ?`,
          values,
          (_, result) => {
            // Add to sync queue if online
            if (this.isOnline) {
              this.syncQueue.addToQueue(table, id, "UPDATE", { id, ...record })
              this.attemptSync()
            }
            resolve(result.rowsAffected > 0)
          },
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  async delete(table: string, id: string): Promise<boolean> {
    const now = Date.now()

    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `UPDATE ${table} SET is_deleted = 1, updated_at = ?, is_synced = 0 WHERE id = ?`,
          [now, id],
          (_, result) => {
            // Add to sync queue if online
            if (this.isOnline) {
              this.syncQueue.addToQueue(table, id, "DELETE", { id })
              this.attemptSync()
            }
            resolve(result.rowsAffected > 0)
          },
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  // Synchronization methods

  private async attemptSync() {
    if (this.isOnline && !this.syncInProgress) {
      this.syncWithRemoteDatabase()
    }
  }

  async syncWithRemoteDatabase() {
    if (this.syncInProgress) return

    this.syncInProgress = true

    try {
      // 1. Push local changes to server
      await this.pushLocalChanges()

      // 2. Pull remote changes
      await this.pullRemoteChanges()

      // 3. Update last sync timestamp
      const now = Date.now()
      await this.saveLastSyncTimestamp(now)

      console.log("Sync completed successfully")
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async pushLocalChanges() {
    const pendingChanges = await this.syncQueue.getPendingChanges()

    for (const change of pendingChanges) {
      try {
        const { table_name, record_id, operation, data } = change
        const parsedData = JSON.parse(data)

        switch (operation) {
          case "INSERT":
          case "UPDATE":
            await supabase.from(table_name).upsert({
              ...parsedData,
              server_updated_at: Date.now(),
            })
            break

          case "DELETE":
            await supabase
              .from(table_name)
              .update({ is_deleted: true, server_updated_at: Date.now() })
              .eq("id", record_id)
            break
        }

        // Mark as synced in local DB
        await this.markAsSynced(table_name, record_id)

        // Remove from sync queue
        await this.syncQueue.removeFromQueue(change.id)
      } catch (error) {
        console.error("Error pushing change:", change, error)
        // Continue with next change
      }
    }
  }

  private async pullRemoteChanges() {
    for (const table of Object.values(TABLES)) {
      try {
        // Fetch records updated since last sync
        const { data, error } = await supabase.from(table).select("*").gt("server_updated_at", this.lastSyncTimestamp)

        if (error) throw error

        if (data && data.length > 0) {
          for (const remoteRecord of data) {
            // Check if record exists locally
            const localRecord = await this.read(table, remoteRecord.id)

            if (!localRecord) {
              // Record doesn't exist locally, insert it
              await this.insertRemoteRecord(table, remoteRecord)
            } else if (remoteRecord.server_updated_at > localRecord.updated_at) {
              // Remote is newer, update local
              await this.updateLocalRecord(table, remoteRecord)
            } else if (remoteRecord.server_updated_at < localRecord.updated_at && localRecord.is_synced === 0) {
              // Local is newer and not synced, resolve conflict
              await this.resolveConflict(table, localRecord, remoteRecord)
            }
          }
        }
      } catch (error) {
        console.error(`Error pulling changes for table ${table}:`, error)
      }
    }
  }

  private async insertRemoteRecord(table: string, record: any) {
    return new Promise((resolve, reject) => {
      // Convert record to columns and values
      const columns = Object.keys(record).join(", ")
      const placeholders = Object.keys(record)
        .map(() => "?")
        .join(", ")
      const values = Object.values(record)

      this.db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
          values,
          (_, result) => resolve(result.rowsAffected > 0),
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  private async updateLocalRecord(table: string, record: any) {
    const { id, ...rest } = record

    return new Promise((resolve, reject) => {
      // Convert record to SET clause
      const setClause = Object.keys(rest)
        .map((key) => `${key} = ?`)
        .join(", ")
      const values = [...Object.values(rest), id]

      this.db.transaction((tx) => {
        tx.executeSql(
          `UPDATE ${table} SET ${setClause} WHERE id = ?`,
          values,
          (_, result) => resolve(result.rowsAffected > 0),
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  private async resolveConflict(table: string, localRecord: any, remoteRecord: any) {
    // Use conflict resolver to determine which record to keep
    const resolvedRecord = this.conflictResolver.resolve(localRecord, remoteRecord)

    // Update local record with resolved data
    await this.updateLocalRecord(table, resolvedRecord)

    // Push resolved record to server
    await supabase.from(table).upsert({
      ...resolvedRecord,
      server_updated_at: Date.now(),
    })
  }

  private async markAsSynced(table: string, id: string) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `UPDATE ${table} SET is_synced = 1 WHERE id = ?`,
          [id],
          (_, result) => resolve(result.rowsAffected > 0),
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  // Utility methods

  async clearDatabase() {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          Object.values(TABLES).forEach((table) => {
            tx.executeSql(`DROP TABLE IF EXISTS ${table}`)
          })
          tx.executeSql(`DROP TABLE IF EXISTS sync_queue`)
        },
        (error) => {
          reject(error)
        },
        () => {
          this.initDatabase()
          resolve(true)
        },
      )
    })
  }

  async getDatabaseSize(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (Platform.OS === "ios") {
        // iOS doesn't provide direct access to database file size
        resolve(0)
      } else {
        // For Android, we can get the file size
        this.db.transaction((tx) => {
          tx.executeSql(
            "PRAGMA page_count",
            [],
            (_, { rows }) => {
              const pageCount = rows.item(0).page_count
              tx.executeSql(
                "PRAGMA page_size",
                [],
                (_, { rows }) => {
                  const pageSize = rows.item(0).page_size
                  resolve(pageCount * pageSize)
                },
                (_, error) => {
                  reject(error)
                  return false
                },
              )
            },
            (_, error) => {
              reject(error)
              return false
            },
          )
        })
      }
    })
  }

  async exportData(): Promise<string> {
    const data = {}

    for (const table of Object.values(TABLES)) {
      data[table] = await this.readAll(table)
    }

    return JSON.stringify(data)
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData)

      for (const [table, records] of Object.entries(data)) {
        for (const record of records as any[]) {
          await this.create(table, record)
        }
      }

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }

  // Check if we're online
  isNetworkAvailable(): boolean {
    return this.isOnline
  }

  // Force a sync
  async forceSync(): Promise<boolean> {
    if (!this.isOnline) {
      return false
    }

    await this.syncWithRemoteDatabase()
    return true
  }
}

// Singleton instance
export const databaseService = new DatabaseService()
