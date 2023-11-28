import * as React from 'react';
import { StyleSheet } from 'react-native';
import TabNavigator from "./navigate/TabNavigator";


function App() {
  return (
        <TabNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;