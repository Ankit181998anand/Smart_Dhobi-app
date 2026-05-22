import React from 'react';
import { View, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0F0',
  },
  stepBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE, // light purple background
    borderWidth: 2,
    borderColor: '#E9D5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: '#9333EA',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: COLORS.BLACK
  },
  title: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_MEDIUM,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 4,
  },
});
