import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
                    width={20}
                    height={20}
                    style={{ marginRight: 10 }}
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
        paddingHorizontal: 13,
        paddingVertical: 8,
        alignItems: 'center',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        margin: 20,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: '#A855F7'
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.WHITE
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    buttonWrapper: {
        borderRadius: 50,
        overflow: 'hidden',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD
    },
    inputWrapper: {
        flex: 1,
    },
    addressText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_SEMIBOLD,
        color: "#111827",
    },
});
