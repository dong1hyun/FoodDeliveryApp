import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import orderSlice, { Order } from "../slices/order";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import axios, { AxiosError } from "axios";
import Config from "react-native-config";
import { RootState } from "../store/reducer";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LoggedInParamList } from "../../AppInner";
import NaverMapView, { Marker, Path } from "react-native-nmap";

function EachOrder({ item }: { item: Order }) {
    console.log('start:', item.start, 'end:', item.end);
    const [detail, setDetail] = useState(false);
    const [loading, setLoading] = useState(false);
    const { start, end } = item;
    const accessToken = useSelector<RootState>(state => state.user.accessToken);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
    const toggleDetail = useCallback(() => {
        setDetail(prev => !prev);
    }, []);
    const onAccept = useCallback(async () => {
        try {
            setLoading(true);
            await axios.post(
                `${Config.API_URL}/accept`,
                { orderId: item.orderId },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            dispatch(orderSlice.actions.acceptOrder(item.orderId));
            setLoading(false);
            navigation.navigate('Delivery');
        } catch (error) {
            let errorResponse = (error as AxiosError<{ message: string }>).response;
            if (errorResponse?.status === 400) {
                Alert.alert('알림', errorResponse.data.message);
                dispatch(orderSlice.actions.rejectOrder(item.orderId));
            }
            setLoading(false);
        }
    }, []);
    const onReject = useCallback(() => {
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
    }, []);

    return (
        <View style={styles.orderContainer}>
            <Pressable onPress={toggleDetail} style={styles.info}>
                <Text style={styles.eachInfo}>
                    {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                </Text>
                <Text>건대입구</Text>
                <Text>구의동</Text>
            </Pressable>
            {detail ?
                (<View>
                    <View
                        style={{
                            width: Dimensions.get('window').width - 30,
                            height: 200,
                            marginTop: 10,
                        }}>
                        <NaverMapView
                            style={{ width: '100%', height: '100%' }}
                            zoomControl={false}
                            center={{
                                zoom: 10,
                                tilt: 50,
                                latitude: (start.latitude + end.latitude) / 2,
                                longitude: (start.longitude + end.longitude) / 2,
                            }}>
                            <Marker
                                coordinate={{
                                    latitude: start.latitude,
                                    longitude: start.longitude,
                                }}
                                pinColor="blue"
                            />
                            <Path
                                coordinates={[
                                    {
                                        latitude: start.latitude,
                                        longitude: start.longitude,
                                    },
                                    { latitude: end.latitude, longitude: end.longitude },
                                ]}
                            />
                            <Marker
                                coordinate={{ latitude: end.latitude, longitude: end.longitude }}
                            />
                        </NaverMapView>
                    </View>
                    <View style={styles.bttonWrapper}>
                        <Pressable onPress={onAccept} disabled={loading} style={styles.acceptButton}>
                            <Text style={styles.buttonText}>수락</Text>
                        </Pressable>
                        <Pressable onPress={onReject} disabled={loading} style={styles.rejectButton}>
                            <Text style={styles.buttonText}>거절</Text>
                        </Pressable>
                    </View>
                </View>
                ) : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    orderContainer: {
        backgroundColor: 'gray',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    eachInfo: {

    },
    bttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    acceptButton: {
        backgroundColor: 'blue',
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
    rejectButton: {
        backgroundColor: 'red',
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EachOrder;