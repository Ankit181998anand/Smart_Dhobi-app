import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
  import { Dimensions } from 'react-native';
  
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
  
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  
  const baseWidth = SCREEN_WIDTH < 768 ? 375 : 1200;
  const baseHeight = SCREEN_HEIGHT < 1280 ? 812 : 1850;
  
  const maxWidth = 2500;
  const maxHeight = 1850;
  
  export const SW = (dimension: number): number => {
    const width = wp((dimension / baseWidth) * 100 + '%');
    return Math.min(width, maxWidth);
  };
  
  export const SH = (dimension: number): number => {
    const height = hp((dimension / baseHeight) * 100 + '%');
    return Math.min(height, maxHeight);
  };
  
  export const SF = (dimension: number): number => {
    return SH(dimension) * (aspectRatio > 1.6 ? 1 : 0.9);
  };
  
  export const heightPercent = (percent: string | number): number => hp(percent);
  export const widthPercent = (percent: string | number): number => wp(percent);
  export const fontPercent = (percent: string | number): number => hp(percent);
  
  // Export screen dimensions as constants
  export { SCREEN_WIDTH, SCREEN_HEIGHT };
  