import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { useThemeColor } from "app/hooks/useThemeColor";
import { FlatList, FlatListProps, StyleSheet, View } from "react-native";

export interface ListRef {
  scrollToEnd: () => void;
}

interface ListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  autoScroll?: boolean;
  maintainPosition?: boolean;
  containerStyle?: object;
  listStyle?: object;
}

function ListComponent<T>(
  {
    data,
    renderItem,
    autoScroll = false,
    maintainPosition = false,
    containerStyle,
    listStyle,
    ...flatListProps
  }: ListProps<T>,
  ref: React.Ref<ListRef>,
) {
  const flatListRef = useRef<FlatList<T>>(null);
  const backgroundColor = useThemeColor("background");

  useImperativeHandle(ref, () => ({
    scrollToEnd: () => {
      flatListRef.current?.scrollToEnd({ animated: true });
    },
  }));

  return (
    <View style={[styles.container, { backgroundColor }, containerStyle]}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => renderItem(item)}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (autoScroll) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
        onLayout={() => {
          if (autoScroll) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
        maintainVisibleContentPosition={
          maintainPosition
            ? {
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
              }
            : undefined
        }
        style={[styles.list, listStyle]}
        contentContainerStyle={styles.contentContainer}
        {...flatListProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export const List = forwardRef(ListComponent) as <T>(
  props: ListProps<T> & { ref?: React.Ref<ListRef> },
) => React.ReactElement;
