import { StyleSheet } from "react-native";
import COLORS from "../../utils/constant";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
    },
    logo: {
        width: 200,
        aspectRatio: 1,
        alignSelf: 'center',
    }
});

export default styles;