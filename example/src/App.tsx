import './_App_prestart';
import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
// import { multiply } from 'pouchdb-adapter-react-native-level';
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
      await db.put('สวัสดี', 'ชาวโลก');
      const gotRes = await db.get('สวัสดี');
      console.log('got สวัสดี', gotRes);
      // const putRes = await db.get('doc2');
      // console.log('got putres', putRes);

    })();
    // multiply(3, 7).then(setResult);

    (async () => {
      console.log('test put pouch');
      const randId = Math.random().toString();
      await pouchdb.post({
        hello: 0.5,
        world: 3
      })
      await pouchdb.post({
        hello: 1,
        world: 4
      })
      await pouchdb.post({
        hello: 2,
        world: 5
      })
      await pouchdb.post({
        hello: 1,
        world: 3
      })
      console.log('try post data')
      const saveRes = await pouchdb.post({
        hello: 1,
        world: 3,
        _attachments: {
          'stuff': {
            content_type: 'application/json',
            data: 'aGVsbG93b3JsZA=='
          }
        }
      })
      console.log('did post; rechecking')
      const allDocs = await pouchdb.find({
        selector: {
          hello: { $lt: 1 }
          // hello: { $gt: 1 }
          // role: { $elemMatch: { $eq: role } },
        },
      });
      pouchdb.createIndex({ index: { fields: ['hello'] } })
      console.log('allPouchDocs less than 1 are', allDocs);
      console.log('noob data is', await pouchdb.get(saveRes.id));
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
