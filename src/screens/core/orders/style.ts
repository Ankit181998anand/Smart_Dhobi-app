import { StyleSheet } from "react-native";
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from "../../../utils/constant";
import { SF, SH, SW } from "../../../utils/Dimensions";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SW(16),
        paddingVertical: SH(10),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 3,
      },
      headerTitle: {
        fontSize: SF(18),
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: '#333',
      },
      ordersSummary: {
        paddingHorizontal: SW(15),
        paddingVertical: SH(10),
        backgroundColor: '#e9ecef',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
      },
      totalOrdersText: {
        fontSize: SF(15),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#555',
      },
      listContent: {
        paddingHorizontal: SW(15),
        paddingVertical: SH(10),
      },
      orderCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: SH(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
      },
      orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SH(10),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: SH(8),
      },
      orderId: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#333',
      },
      orderDate: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#666',
      },
      orderDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SH(5),
      },
      detailLabel: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#555',
      },
      detailValue: {
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#777',
      },
      detailValueAmount: {
        fontSize: SF(14),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#28a745', // Green for amount
      },
      orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SH(10),
        paddingTop: SH(8),
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
      statusBadge: {
        paddingHorizontal: SW(10),
        paddingVertical: SH(5),
        borderRadius: 5,
      },
      statusAccepted: {
        backgroundColor: '#d4edda', // Light green
      },
      statusPending: {
        backgroundColor: '#fff3cd', // Light yellow
      },
      statusCompleted: {
        backgroundColor: '#cfe2ff', // Light blue
      },
      statusText: {
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#28a745', // Darker green for text
      },
      viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SH(5),
        paddingHorizontal: SW(10),
        borderRadius: 5,
        backgroundColor: '#e7f0fa', // Light blue background
        gap: SW(7)
      },
      viewButtonText: {
        color: '#007bff',
        marginRight: SW(5),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: SF(13)
      },
      IconStyle:{
        width: SW(20),
        height: SH(20),
        tintColor: COLORS.BLACK
      },
      viewIconStyle:{
        width: SW(18),
        height: SH(18),
        tintColor: COLORS.DarkGray
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingText: {
        marginTop: SH(10),
        fontSize: SF(13),
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#555',
      },
      emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      emptyListText: {
        fontSize: SF(16),
        color: '#777',
        fontFamily: FONT_FAMILY_SEMIBOLD
      },
      
});

export default styles;