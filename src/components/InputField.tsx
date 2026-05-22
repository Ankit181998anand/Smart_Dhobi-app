import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Image,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { FONT_FAMILY_MEDIUM, FONT_FAMILY_SEMIBOLD } from '../utils/constant';
import { SvgXml } from 'react-native-svg';

interface InputFieldProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  iconSource?: string;
  placeholderTextColor?: string;
  numberOfLines?: number;
  keyboardType?: any;
  onIconPress?: () => void;
  loading?: boolean;
  containerStyle?: ViewStyle;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  isPassword = false,
  iconSource,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = '#999', // default color if not passed
  numberOfLines = 1,
  keyboardType = 'default',
  onIconPress,
  loading = false,
  containerStyle,
  ...rest
}) => {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>

        {iconSource && (
          <TouchableOpacity onPress={onIconPress} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#A855F7" />
            ) : (
              <SvgXml
                xml={iconSource}
                width={20}
                height={20}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          numberOfLines={numberOfLines}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Image
              source={
                secure
                   ? require('../assets/icons/visibility_off.png')
                   : require('../assets/icons/visibility_on.png')
              }
              style={styles.eyeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputField;


const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    color: '#333',
    fontFamily: FONT_FAMILY_SEMIBOLD
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 8,
  },
  eyeIcon: {
    width: 18,
    height: 18,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    color: '#333',
    fontFamily: FONT_FAMILY_MEDIUM,
    fontSize: 13
  },
});
