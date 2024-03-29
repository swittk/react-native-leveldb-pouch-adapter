// import 'react-native-get-random-values'
import PouchDB from 'pouchdb-core'
import HttpPouch from 'pouchdb-adapter-http'
import replication from 'pouchdb-replication'
import mapreduce from 'pouchdb-mapreduce'
import find from 'pouchdb-find'
import RNPouchAdapter from 'pouchdb-adapter-react-native-level';

// const SQLiteAdapterFactory = require('pouchdb-adapter-react-native-sqlite');
// import WebSQLite from 'react-native-quick-websql'

// const SQLiteAdapter = SQLiteAdapterFactory(WebSQLite)

const Pouch = PouchDB.plugin(HttpPouch)
  .plugin(replication)
  .plugin(mapreduce)
  .plugin(find)
  .plugin(RNPouchAdapter)

export default Pouch;