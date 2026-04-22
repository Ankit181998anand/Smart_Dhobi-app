import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SF, SH, SW } from '../utils/Dimensions';
import COLORS, { FONT_FAMILY_SEMIBOLD } from '../utils/constant';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../assets/Svg/svgIcon';

type Props = {
    value: string;
    onFindPress: () => void;
    loading: boolean;
};

const LocationSearchBar: React.FC<Props> = ({ value, onFindPress, loading }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onFindPress} disabled={loading}>
                <SvgXml
                    xml={SVG_ICON.Location_Icon("#A855F7")}
                    width={SW(20)}
                    height={SH(20)}
                    style={{ marginRight: SW(10) }}
                />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
                {value ? (
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.addressText}
                    >
                        {value}
                    </Text>
                ) : (
                    <TextInput
                        placeholder="Enter your location"
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                        editable={false}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.buttonWrapper}
                onPress={onFindPress}
                disabled={loading}
            >
                <LinearGradient
                    colors={['#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Image
                                source={require("../assets/icons/search.png")}
                                style={styles.searchIcon}
                            />
                            <Text style={styles.buttonText}> Find</Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default LocationSearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingHorizontal: SW(13),
        paddingVertical: SH(8),
        alignItems: 'center',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        margin: 20,
    },
    icon: {
        width: SW(20),
        height: SH(20),
        marginRight: SW(10),
        tintColor: '#A855F7'
    },
    searchIcon: {
        width: SW(20),
        height: SH(20),
        tintColor: COLORS.WHITE
    },
    input: {
        flex: 1,
        fontSize: SF(14),
        color: '#111827',
    },
    buttonWrapper: {
        borderRadius: 50,
        overflow: 'hidden',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SW(13),
        paddingVertical: SH(8),
        borderRadius: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_SEMIBOLD
    },
    inputWrapper: {
        flex: 1,
    },
    addressText: {
        fontSize: SF(12),
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: "#111827",
    },
});

