# pouchdb-adapter-react-native-level

Minor modification on the existing PouchDB LevelDB adapter, mainly by updating the code to use a `abstract-level` compliant database (which is the successor to the now obsolete `abstract-leveldown` interface currently used by most projects).

Based on `react-native-leveldb` by GreenTriangle, wrapped through my `abstract-level` compliant adapter for it ([react-native-leveldb-level-adapter](https://github.com/swittk/react-native-leveldb-level-adapter))

## Installation

```sh
npm install pouchdb-adapter-react-native-level
```

## Usage

```js
import PouchDB from 'pouchdb-core'
import HttpPouch from 'pouchdb-adapter-http'
import replication from 'pouchdb-replication'
import mapreduce from 'pouchdb-mapreduce'
import find from 'pouchdb-find'
import RNPouchAdapter from 'pouchdb-adapter-react-native-level';

// These imports and statements are used to shim global variables used by PouchDB
import 'fast-text-encoding';
import 'react-native-get-random-values';
import { btoa, atob } from 'react-native-quick-base64';
import { Buffer } from 'buffer';
if (!global.btoa) {
  global.btoa = btoa;
}
if (!global.atob) {
  global.atob = atob;
}
if (!global.Buffer) {
  global.Buffer = Buffer;
}

const Pouch = PouchDB.plugin(HttpPouch)
  .plugin(replication)
  .plugin(mapreduce)
  .plugin(find)
  .plugin(RNPouchAdapter)

const pouchdb = new Pouch('myDb');

const saveResult = await pouchdb.post({
    hello: 1,
    world: 3,
    _attachments: {
        'stuff': {
        content_type: 'application/json',
        data: 'aGVsbG93b3JsZA=='
        }
    }
})
const foundDocs = await pouchdb.find({
    selector: {
      hello: { $gte: 1 }
    },
});

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
