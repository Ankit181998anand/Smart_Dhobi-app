import { StyleSheet } from "react-native";
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from "../../../utils/constant";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
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
        fontSize: 18,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: '#333',
      },
      ordersSummary: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#e9ecef',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
      },
      totalOrdersText: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#555',
      },
      listContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
      },
      orderCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
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
        marginBottom: 10,
        paddingBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 10,
    },
    paymentStatus: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_EXTRABOLD,
    },
      orderId: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#333',
      },
      orderDate: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#666',
      },
      orderDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
      },
      detailLabel: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#555',
      },
      detailValue: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#777',
        flexShrink: 1,
        marginLeft: 10,
      },
      detailValueAmount: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: '#28a745', // Green for amount
      },
      orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
      statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
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
        fontSize: 11,
        fontFamily: FONT_FAMILY_EXTRABOLD,
        color: COLORS.WHITE,
    },
      viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#e7f0fa', // Light blue background
        gap: 7
      },
      viewButtonText: {
        color: '#007bff',
        marginRight: 5,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        fontSize: 13
      },
      IconStyle:{
        width: 20,
        height: 20,
        tintColor: COLORS.BLACK
      },
      viewIconStyle:{
        width: 18,
        height: 18,
        tintColor: COLORS.DarkGray
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingText: {
        marginTop: 10,
        fontSize: 13,
        fontFamily: FONT_FAMILY_MEDIUM,
        color: '#555',
      },
      emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      emptyListText: {
        fontSize: 16,
        color: '#777',
        fontFamily: FONT_FAMILY_SEMIBOLD
      },
      
});

export default styles;