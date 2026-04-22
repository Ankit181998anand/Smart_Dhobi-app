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
import { SF, SH, SW } from '../utils/Dimensions';
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

// const GradientButton: React.FC<GradientButtonProps> = ({
//     title,
//     icon,
//     rightIcon,
//     onPress,
//     type = 'filled',
//     containerStyle,
//     textStyle,
//     iconStyle,
//     iconColor,
//     rightIconColor,
//     loading = false,
//     disabled = false,
// }) => {
//     const gradientColors = ['#8B5CF6', '#EC4899'];

//     const arrowTintColor = type === 'outlined' ? '#A855F7' : '#fff';

//     const content = (
//         <View style={[styles.content]}>
//             {icon && (
//                 <SvgXml
//                     xml={icon}
//                     width={SW(20)}
//                     height={SH(20)}
//                     style={[styles.icon, iconStyle]}
//                 />
//             )}
//             <Text
//                 style={[
//                     styles.text,
//                     type === 'outlined' ? styles.outlinedText : styles.filledText,
//                     textStyle,
//                 ]}
//             >
//                 {title}
//             </Text>
//             {rightIcon && (
//                 <SvgXml
//                     xml={rightIcon}
//                     width={SW(18)}
//                     height={SH(18)}
//                     style={styles.arrowIcon}
//                 />
//             )}
//         </View>
//     );

//     if (type === 'outlined') {
//         return (
//             <TouchableOpacity
//                 onPress={onPress}
//                 style={[styles.outlinedButton, containerStyle]}
//                 activeOpacity={0.8}
//             >
//                 {content}
//             </TouchableOpacity>
//         );
//     }

//     return (
//         <TouchableOpacity onPress={onPress} style={containerStyle} activeOpacity={0.8}>
//             <LinearGradient colors={gradientColors} style={styles.filledButton}>
//                 {content}
//             </LinearGradient>
//         </TouchableOpacity>
//     );
// };

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
          width={SW(20)}
          height={SH(20)}
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
          width={SW(18)}
          height={SH(18)}
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
    paddingVertical: SH(12),
    paddingHorizontal: SW(20),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButton: {
    paddingVertical: SH(12),
    paddingHorizontal: SW(20),
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
    fontSize: SF(14),
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  filledText: {
    color: '#fff',
  },
  outlinedText: {
    color: '#A855F7',
  },
  icon: {
    width: SW(20),
    height: SH(20),
    marginRight: SW(10),
  },
  arrowIcon: {
    width: SW(16),
    height: SH(16),
    marginLeft: SW(6),
  },
});
