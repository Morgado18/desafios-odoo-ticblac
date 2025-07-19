import * as SQLite from "expo-sqlite"
import { v4 as uuidv4 } from "uuid"

interface SyncQueueItem {
  id: string
  table_name: string
  record_id: string
  operation: "INSERT" | "UPDATE" | "DELETE"
  data: string
  created_at: number
}

export class SyncQueue {
  private db: SQLite.SQLiteDatabase

  constructor() {
    this.db = SQLite.openDatabase("kandimba.db")
  }

  async addToQueue(
    tableName: string,
    recordId: string,
    operation: "INSERT" | "UPDATE" | "DELETE",
    data: any,
  ): Promise<string> {
    const id = uuidv4()
    const now = Date.now()

    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO sync_queue (id, table_name, record_id, operation, data, created_at) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, tableName, recordId, operation, JSON.stringify(data), now],
          (_, result) => {
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

  async removeFromQueue(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM sync_queue WHERE id = ?`,
          [id],
          (_, result) => {
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

  async getPendingChanges(): Promise<SyncQueueItem[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM sync_queue ORDER BY created_at ASC`,
          [],
          (_, result) => {
            const items: SyncQueueItem[] = []
            for (let i = 0; i < result.rows.length; i++) {
              items.push(result.rows.item(i) as SyncQueueItem)
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

  async clearQueue(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM sync_queue`,
          [],
          (_, result) => {
            resolve(true)
          },
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }

  async getQueueSize(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT COUNT(*) as count FROM sync_queue`,
          [],
          (_, result) => {
            resolve(result.rows.item(0).count)
          },
          (_, error) => {
            reject(error)
            return false
          },
        )
      })
    })
  }
}
