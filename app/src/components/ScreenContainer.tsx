import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';

type ScreenContainerProps = {
  children: ReactNode;
};

export function ScreenContainer({ children }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        className="flex-1 px-5 pt-4 pb-6"
        style={{
          flex: 1,
          paddingBottom: Math.max(24, insets.bottom + 12),
          backgroundColor: colors.background,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}


