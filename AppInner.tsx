import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import { useState } from 'react';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import { Provider, useSelector } from 'react-redux';
import store, { useAppDispatch } from './src/store';
import { RootState } from './src/store/reducer';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import userSlice from './src/slices/user';
import { Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: { orderId: string };
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();


export default function AppInner() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getRefreshToken = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) return;
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          })
        );
      } catch (error) {
        console.error(error);
        // if((error as AxiosError).response?.data.code === 'expired') {
        //   Alert.alert('알림', "다시 로그인 해주세요.");
        // }
      }
    }
    getRefreshToken();
  }, []);
  const isLoggedIn = useSelector((state: RootState) => state.user.email);
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{ title: '오더 목록' }}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{ title: '내 정보' }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: '로그인' }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: '회원가입' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}