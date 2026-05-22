import React from 'react';
import { Image, StyleSheet, Text, TextStyle, View, TouchableOpacity, ViewStyle } from 'react-native';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_SEMIBOLD } from '../utils/constant';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { SvgXml } from 'react-native-svg';
import { SVG_ICON } from '../assets/Svg/svgIcon';

interface HeaderProps {
  title: string;
  subtitle?: string;
  textStyle?: TextStyle;
  isLeftIcon?: boolean;
  isRightIcon?: boolean;
  leftIconSource?: any;
  rightIconSource?: any;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  viewStyle?: ViewStyle;
  isGradientText?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title, subtitle, textStyle,
  isLeftIcon,
  isRightIcon,
  leftIconSource,
  rightIconSource,
  onLeftPress,
  onRightPress,
  viewStyle,
  isGradientText = false
}) => {
  const gradientColors = ['#8B5CF6', '#EC4899'];

  const renderIcon = (source: any, onPress?: () => void) => {
    if (!source) return null;
    
    const isSvg = typeof source === 'string';

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.iconContainer}>
        {isSvg ? (
          <SvgXml xml={source} width={24} height={24} />
        ) : (
          <Image source={source} style={styles.iconStyle} />
        )}
      </TouchableOpacity>
    );
  };

  const renderTitle = () => {
    if (isGradientText) {
      return (
        <MaskedView maskElement={<Text style={[styles.title, textStyle]}>{title}</Text>}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.title, textStyle, { opacity: 0 }]}>{title}</Text>
          </LinearGradient>
        </MaskedView>
      );
    }
    return <Text style={[styles.title, textStyle]}>{title}</Text>;
  };

  return (
    <View style={[styles.container, viewStyle]}>
      <View style={styles.row}>
        {isLeftIcon ? renderIcon(leftIconSource || SVG_ICON.arrow_back(COLORS.BLACK), onLeftPress) : <View style={styles.placeholder} />}
        <View style={styles.titleContainer}>
          {renderTitle()}
        </View>
        {isRightIcon ? renderIcon(rightIconSource, onRightPress) : <View style={styles.placeholder} />}
      </View>
      {subtitle ? (
        <Text style={styles.subTitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: COLORS.BLACK,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: COLORS.DarkGray,
    marginTop: 2,
    textAlign: 'center'
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#8B5CF6'
  },
  placeholder: {
    width: 40,
  }
});
