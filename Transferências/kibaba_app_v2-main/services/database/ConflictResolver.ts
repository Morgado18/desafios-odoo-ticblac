interface Record {
    id: string
    created_at: number
    updated_at: number
    server_updated_at: number
    [key: string]: any
  }
  
  export class ConflictResolver {
    /**
     * Resolves conflicts between local and remote records
     * Strategy: Last-write-wins with field-level merging for complex objects
     */
    resolve(localRecord: Record, remoteRecord: Record): Record {
      // If one record is deleted and the other is not, prioritize the deletion
      if (localRecord.is_deleted && !remoteRecord.is_deleted) {
        return { ...localRecord, server_updated_at: Date.now() }
      }
  
      if (!localRecord.is_deleted && remoteRecord.is_deleted) {
        return { ...remoteRecord, server_updated_at: Date.now() }
      }
  
      // If both records have the same updated_at timestamp, use the remote record
      if (localRecord.updated_at === remoteRecord.updated_at) {
        return { ...remoteRecord, server_updated_at: Date.now() }
      }
  
      // If local record is newer, use it as the base but merge in non-conflicting remote changes
      if (localRecord.updated_at > remoteRecord.server_updated_at) {
        return this.mergeRecords(localRecord, remoteRecord)
      }
  
      // If remote record is newer, use it as the base but merge in non-conflicting local changes
      return this.mergeRecords(remoteRecord, localRecord)
    }
  
    /**
     * Merges two records, using the primary record as the base
     * and incorporating non-conflicting changes from the secondary record
     */
    private mergeRecords(primary: Record, secondary: Record): Record {
      const result = { ...primary }
  
      // Skip these fields when merging
      const skipFields = ["id", "created_at", "updated_at", "server_updated_at", "is_synced", "is_deleted"]
  
      // For each field in the secondary record
      for (const [key, value] of Object.entries(secondary)) {
        // Skip special fields
        if (skipFields.includes(key)) continue
  
        // If the field doesn't exist in the primary record, add it
        if (primary[key] === undefined) {
          result[key] = value
          continue
        }
  
        // If the field is an object in both records, merge them recursively
        if (
          typeof primary[key] === "object" &&
          primary[key] !== null &&
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(primary[key]) &&
          !Array.isArray(value)
        ) {
          result[key] = this.mergeObjects(primary[key], value)
        }
  
        // For arrays, we don't have a good way to merge, so we keep the primary
        // For primitive values, we keep the primary
      }
  
      // Update the server_updated_at timestamp
      result.server_updated_at = Date.now()
  
      return result
    }
  
    /**
     * Merges two objects recursively
     */
    private mergeObjects(primary: object, secondary: object): object {
      const result = { ...primary }
  
      for (const [key, value] of Object.entries(secondary)) {
        // If the key doesn't exist in the primary object, add it
        if (!(key in primary)) {
          result[key] = value
          continue
        }
  
        // If both values are objects, merge them recursively
        if (
          typeof primary[key] === "object" &&
          primary[key] !== null &&
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(primary[key]) &&
          !Array.isArray(value)
        ) {
          result[key] = this.mergeObjects(primary[key], value)
        }
  
        // For arrays and primitive values, we keep the primary
      }
  
      return result
    }
  }
  