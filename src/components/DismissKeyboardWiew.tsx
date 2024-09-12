import { ReactNode } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

function DismissKeyboardWiew({ children, style }: { children: ReactNode, style?: ViewStyle }) {
    return <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={style}>
        <KeyboardAwareScrollView>
            {children}
        </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
}

export default DismissKeyboardWiew;