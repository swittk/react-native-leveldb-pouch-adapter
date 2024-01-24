// similar to an idb or websql transaction object
// designed to be passed around. basically just caches
// things in-memory and then does a big batch() operation
// when you're done

import { nextTick } from 'pouchdb-utils';
import { SKReactNativeLevel } from 'react-native-leveldb-level-adapter';
import { AbstractSublevel } from 'abstract-level';
/*
prefix() was originally precodec.encode() / decode()
ReadStream.prototype.destroy = function () {
  this._cleanup();
};

var precodec = {
  encode: function (decodedKey) {
    return '\xff' + decodedKey[0] + '\xff' + decodedKey[1];
  },
  decode: function (encodedKeyAsBuffer) {
    var str = encodedKeyAsBuffer.toString();
    var idx = str.indexOf('\xff', 1);
    return [str.substring(1, idx), str.substring(idx + 1)];
  },
  lowerBound: '\x00',
  upperBound: '\xff'
};

*/

/**
 * 
 * @param {LevelTransaction} transaction 
 * @param {AbstractSublevel} store 
 * @returns 
 */
function getCacheFor(transaction, store) {
  // Originally was
  // var prefix = store.prefix()[0];
  // This is likely fucked up too; find appropriate way to do it.
  var prefix = store.prefix;
  // var prefix = sublevel.prefix;
  var cache = transaction._cache;
  var subCache = cache.get(prefix);
  if (!subCache) {
    subCache = new Map();
    cache.set(prefix, subCache);
  }
  return subCache;
}

class LevelTransaction {
  constructor() {
    this._batch = [];
    this._cache = new Map();
  }

  get(store, key, callback) {
    var cache = getCacheFor(this, store);
    var exists = cache.get(key);
    if (exists) {
      return nextTick(function () {
        callback(null, exists);
      });
    } else if (exists === null) { // deleted marker
      /* istanbul ignore next */
      return nextTick(function () {
        callback({ name: 'NotFoundError', code: 'LEVEL_NOT_FOUND' });
      });
    }
    store.get(key, function (err, res) {
      if (err) {
        /* istanbul ignore else */
        if (err.code === 'LEVEL_NOT_FOUND') {
          cache.set(key, null);
        }
        return callback(err);
      }
      cache.set(key, res);
      callback(null, res);
    });
  }
  /**
   * 
   * @param {{
   *   key: string,
   *   value: any,
   *   prefix: AbstractSublevel,
   *   type: string
   * }[]} batch 
   */
  batch(batch) {
    for (var i = 0, len = batch.length; i < len; i++) {
      var operation = batch[i];

      var cache = getCacheFor(this, operation.prefix);

      if (operation.type === 'put') {
        cache.set(operation.key, operation.value);
      } else {
        cache.set(operation.key, null);
      }
    }
    this._batch = this._batch.concat(batch);
  }

  /**
   * 
   * @param {SKReactNativeLevel} db 
   * @param {*} callback 
   */
  execute(db, callback) {
    var keys = new Set();
    var uniqBatches = [];
    // remove duplicates; last one wins
    for (var i = this._batch.length - 1; i >= 0; i--) {
      var operation = this._batch[i];
      // TODO: Find out how to properly do this, because it is definitely fucking up right here with prefixes and magic keys here.
      // var lookupKey = operation.prefix.prefix()[0] + '\xff' + operation.key;
      var lookupKey = operation.prefix.prefix + operation.key;
      if (keys.has(lookupKey)) {
        continue;
      }
      keys.add(lookupKey);
      uniqBatches.push(operation);
    }

    /** DB Batch interface now expects "sublevel" instead of "prefix" */
    db.batch(uniqBatches.map((v) => {
      return {
        ...v,
        sublevel: v.prefix
      }
    }), callback);
    // db.iterator().all().then((vals)=>{
    //   console.log('db now has', JSON.stringify(vals))
    // })
  }
}

export default LevelTransaction;