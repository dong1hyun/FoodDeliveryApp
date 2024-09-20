import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Complete from './Complete';
import Ing from './Ing';
import { LoggedInParamList } from '../../AppInner';

const Stack = createNativeStackNavigator<LoggedInParamList>();


function Delivery() {
  return (
    <Stack.Navigator initialRouteName='Ing'>
      <Stack.Screen name="Ing" component={Ing} options={{title: '내 오더'}} />
      <Stack.Screen
        name="Complete"
        component={Complete}
        options={{title: '완료하기'}}
      />
    </Stack.Navigator>
  );
}

export default Delivery;