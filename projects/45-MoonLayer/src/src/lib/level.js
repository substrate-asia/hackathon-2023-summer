import memory_level_1 from "memory-level";

export const ENCODING_OPTS = { keyEncoding: "buffer", valueEncoding: "buffer" };
/**
 * LevelDB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class LevelDB {
    _leveldb;
    /**
     * Initialize a DB instance. If `leveldb` is not provided, DB
     * defaults to an [in-memory store](https://github.com/Level/memdown).
     * @param leveldb - An abstract-leveldown compliant store
     */
    constructor(leveldb) {
        this._leveldb = leveldb ?? new memory_level_1.MemoryLevel(ENCODING_OPTS);
    }
    /**
     * @inheritDoc
     */
    async get(key) {
        let value = null;
        try {
            value = await this._leveldb.get(key, ENCODING_OPTS);
        }
        catch (error) {
            // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
            // This should be `true` if the error came from LevelDB
            // so we can check for `NOT true` to identify any non-404 errors
            if (error.notFound !== true) {
                throw error;
            }
        }
        return value;
    }
    /**
     * @inheritDoc
     */
    async put(key, val) {
        await this._leveldb.put(key, val, ENCODING_OPTS);
    }
    /**
     * @inheritDoc
     */
    async del(key) {
        await this._leveldb.del(key, ENCODING_OPTS);
    }
    /**
     * @inheritDoc
     */
    async batch(opStack) {
        await this._leveldb.batch(opStack, ENCODING_OPTS);
    }
    /**
     * @inheritDoc
     */
    copy() {
        return new LevelDB(this._leveldb);
    }
}
