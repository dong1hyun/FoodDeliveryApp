import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";

function Orders() {
    const orders = useSelector((state: RootState) => state.order.orders);
    return <View>
        {/* {orders.map((v) => (
            <Text>{v.orderId}</Text>
        ))} */}
    </View>
}

export default Orders;