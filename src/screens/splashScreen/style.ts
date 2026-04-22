import { StyleSheet } from "react-native";
import { SW } from "../../utils/Dimensions";
import COLORS from "../../utils/constant";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
    },
    logo: {
        width: SW(200),
        aspectRatio: 1,
        alignSelf: 'center',
    }
});

export default styles;