import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

type QuickActionButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const QuickActionButton = memo(function QuickActionButton({
  icon,
  label,
  onPress,
  tone = 'primary',
  fullWidth = true,
  style,
}: QuickActionButtonProps) {
  const baseStyle = [
    styles.button,
    fullWidth ? styles.buttonFull : styles.buttonCompact,
    tone === 'primary' ? styles.primaryButton : styles.secondaryButton,
    style,
  ];
  const textColor = tone === 'primary' ? styles.primaryText : styles.secondaryText;
  return (
    <Pressable style={baseStyle} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={20} color={tone === 'primary' ? '#022c22' : '#34d399'} />
      </View>
      <Text style={[styles.label, textColor]}>{label}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#022c22',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonFull: {
    flex: 1,
  },
  buttonCompact: {
    paddingHorizontal: 18,
  },
  primaryButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#34D399',
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryText: {
    color: '#022c22',
  },
  secondaryText: {
    color: '#34D399',
  },
});


