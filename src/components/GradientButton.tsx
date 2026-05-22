import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FONT_FAMILY_SEMIBOLD } from '../utils/constant';
import { SvgXml } from 'react-native-svg';

type ButtonType = 'filled' | 'outlined';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: ImageStyle;
  icon?: string;
  rightIcon?: string;
  iconColor?: string;
  rightIconColor?: string;
  loading?: boolean;
  disabled?: boolean;
  gradientColors?: string[];
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  icon,
  rightIcon,
  onPress,
  type = 'filled',
  containerStyle,
  textStyle,
  iconStyle,
  loading = false,
  disabled = false,
  gradientColors,
}) => {
  const defaultColors = ['#8B5CF6', '#EC4899'];
  const activeColors = gradientColors || defaultColors;

  const content = loading ? (
    <ActivityIndicator size="small" color={type === 'outlined' ? '#A855F7' : '#fff'} />
  ) : (
    <View style={styles.content}>
      {icon && (
        <SvgXml
          xml={icon}
          width={20}
          height={20}
          style={[styles.icon, iconStyle]}
        />
      )}
      <Text
        style={[
          styles.text,
          type === 'outlined' ? styles.outlinedText : styles.filledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
      {rightIcon && (
        <SvgXml
          xml={rightIcon}
          width={18}
          height={18}
          style={styles.arrowIcon}
        />
      )}
    </View>
  );

  if (type === 'outlined') {
    return (
      <TouchableOpacity
        onPress={!loading && !disabled ? onPress : undefined}
        style={[styles.outlinedButton, containerStyle]}
        activeOpacity={0.8}
        disabled={loading || disabled}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={!loading && !disabled ? onPress : undefined}
      style={containerStyle}
      activeOpacity={0.8}
      disabled={loading || disabled}
    >
      <LinearGradient colors={activeColors} style={styles.filledButton}>
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default GradientButton;

const styles = StyleSheet.create({
  filledButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  filledText: {
    color: '#fff',
  },
  outlinedText: {
    color: '#A855F7',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 6,
  },
});
