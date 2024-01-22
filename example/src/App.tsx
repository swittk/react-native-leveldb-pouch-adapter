import './_App_prestart';
import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
// import { multiply } from 'pouchdb-adapter-react-native-leveldb';
import Pouch from './Pouch';
// const rnld = require('react-native-leveldb-leveldown-adapter');
// console.log('rnld is', rnld);
import { SKReactNativeLevel } from 'react-native-leveldb-level-adapter';


export default function App() {
  console.log('initme');

  const ldown = new SKReactNativeLevel('db0.db');
  console.log('ldown is', ldown);
  const db = React.useMemo(() => {
    return new SKReactNativeLevel('db0.db');
    // return new Pouch('db0.db', {
    //   adapter: 'rnleveldb',
    //   // db: new SKReactNativeLevel('db0.db')
    // } as any);
  }, []);
  const pouchdb = React.useMemo(() => {
    const pouchdb = new Pouch('myDb');
    return pouchdb;
  }, []);
  console.log('db is', db);
  console.log('pouchdb is', pouchdb);
  const [result, setResult] = React.useState<number | undefined>();

  // React.useEffect(() => {
  //   (async () => {
  //     console.log('test put');
  //     await db.put({ _id: 'doc4', hello: 1, world: 2 })
  //     console.log('did put');
  //     // const putRes = await db.get('doc2');
  //     // console.log('got putres', putRes);
  //   })();
  //   // multiply(3, 7).then(setResult);
  // }, []);

  React.useEffect(() => {
    (async () => {
      console.log('test put');
      await db.put('กาก', 'กากจุง\u0000มุงมุง');
      console.log('did put hi\u0000world');
      const gotRes = await db.get('กาก');
      console.log('got res', gotRes);
      // const putRes = await db.get('doc2');
      // console.log('got putres', putRes);

    })();
    // multiply(3, 7).then(setResult);

    (async () => {
      console.log('test put pouch');
      await pouchdb.put({
        _id: Math.random().toString(),
        hello: 2,
        world: 3
      })
      const allDocs = await pouchdb.find();
      console.log('allPouchDocs are', allDocs);
    })();

  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
