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
import useSocket from './src/hooks/useSocket';
import orderSlice from './src/slices/order';

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
  const isLoggedIn = useSelector((state: RootState) => state.user.email);
  const dispatch = useAppDispatch();
  const [socket, disconnect] = useSocket();
  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }
    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);
  useEffect(() => {
    axios.interceptors.request.use(
      response => {
        return response;
      },
      async (error) => {
        const { config, response: { status } } = error;
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            const originalRequest = config;
            const token = await EncryptedStorage.getItem('refreshToken');
            const {data} = await axios.post(
              `${Config.API_URL}/refreshToken`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              }
            );
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            originalRequest.header.authorization = `Bearer ${data.data.accessToken}`
            return axios(originalRequest);
          }
        }
        else return Promise.reject(error);
      }
    )
  }, []);
  useEffect(() => {
    const getRefreshToken = async () => {
      try {
        console.log("refresh");
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
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          })
        );
      } catch (error) {
        // console.error(error);
        if((error as AxiosError<{code: string}>).response?.data.code === 'expired') {
          Alert.alert('알림', "다시 로그인 해주세요.");
        }
      }
    }
    getRefreshToken();
  }, []);
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