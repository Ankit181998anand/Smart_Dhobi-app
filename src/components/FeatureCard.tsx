import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType, ViewStyle, ImageStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SH, SW, SF } from '../utils/Dimensions';
import COLORS, { FONT_FAMILY_EXTRABOLD, FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from '../utils/constant';
import { SvgXml } from 'react-native-svg';

interface FeatureCardProps {
  icon: string;
  title: string;
  subtitle: string;
  gradientColors: string[];
  cardStyle?: ViewStyle;
  iconStyle: ImageStyle;
  iconWrapperStyle: ViewStyle;
  step?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, subtitle, gradientColors, cardStyle, iconStyle, step, iconWrapperStyle }) => {
  return (
    <View style={[styles.card, cardStyle]}>
      {step !== undefined && (
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      )}
      <LinearGradient colors={gradientColors} style={[styles.iconWrapper, iconWrapperStyle]}>
        {icon && (
          <SvgXml
            xml={icon}
            width={20}
            height={20}
            style={[styles.icon, iconStyle || {}]}
          />
        )}
      </LinearGradient>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default FeatureCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAFAFF',
    borderRadius: SW(14),
    paddingVertical: SH(20),
    paddingHorizontal: SW(30),
    alignItems: 'center',
    marginBottom: SH(16),
    borderWidth: 1,
    borderColor: '#E0E0F0',
  },
  stepBadge: {
    position: 'absolute',
    top: SH(8),
    right: SW(8),
    width: SW(24),
    height: SW(24),
    borderRadius: SW(12),
    backgroundColor: COLORS.WHITE, // light purple background
    borderWidth: 2,
    borderColor: '#E9D5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: SF(12),
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: '#9333EA',
  },
  iconWrapper: {
    width: SW(40),
    height: SW(40),
    borderRadius: SW(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SH(14),
  },
  icon: {
    width: SW(22),
    height: SW(22),
    tintColor: COLORS.BLACK
  },
  title: {
    fontSize: SF(15),
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SF(13),
    fontFamily: FONT_FAMILY_MEDIUM,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: SH(4),
  },
});
