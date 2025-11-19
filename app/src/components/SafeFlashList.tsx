import { memo } from 'react';
import { FlatList, type FlatListProps } from 'react-native';

type SafeFlashListProps<T> = Omit<FlatListProps<T>, 'renderItem' | 'data'> & {
  data: ReadonlyArray<T>;
  renderItem: NonNullable<FlatListProps<T>['renderItem']>;
  keyExtractor: NonNullable<FlatListProps<T>['keyExtractor']>;
  estimatedItemSize?: number;
};

function InnerSafeFlashListComponent<T>({
  estimatedItemSize: _estimatedItemSize,
  scrollEventThrottle,
  ...rest
}: SafeFlashListProps<T>) {
  return <FlatList {...rest} scrollEventThrottle={scrollEventThrottle ?? 16} />;
}

export const SafeFlashList = memo(InnerSafeFlashListComponent) as typeof InnerSafeFlashListComponent;

