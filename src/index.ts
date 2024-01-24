const CorePouch = require('./CorePouch').default;

// export function multiply(a: number, b: number): Promise<number> {
//   return Promise.resolve(a * b);
// }

function LevelPouchRN(opts: any, callback: (error: any) => void) {
  // Users can pass in their own leveldown alternative here, in which case
  // it overrides the default one. (This is in addition to the custom builds.)
  var leveldown = opts.db;

  var _opts = Object.assign({
    db: leveldown,
  }, opts);
  console.log('core is', CorePouch);
  // @ts-ignore
  CorePouch.call(this as any, _opts, callback);
}

// overrides for normal LevelDB behavior on Node
LevelPouchRN.valid = function () {
  // if you're using ReactNative, we assume you know what you're doing because you control the environment
  return true;
};
// no need for a prefix in ReactNative (i.e. no need for `_pouch_` prefix
LevelPouchRN.use_prefix = false;

export default function (PouchDB: any) {
  PouchDB.adapter('rnleveldb', LevelPouchRN, true);
}