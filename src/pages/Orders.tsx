import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import { useCallback } from "react";
import { Order } from "../slices/order";
import EachOrder from "../components/EachOrder";

function Orders() {
    const orders = useSelector((state: RootState) => state.order.orders);
    const renderItem = useCallback(({item}: {item: Order}) => {
        return (
            <EachOrder item={item} />
        )
    }, []);
    return <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
    />
}

export default Orders;