import { ReactNode, RefObject } from 'react';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';

type InfiniteListProps<T> = {
    values: T[];
    rowHeight: (data: T) => number;
    scrollElement: RefObject<Element>;
    children: (data: T) => ReactNode;
};
export const InfiniteList = <T,>({
    values,
    rowHeight,
    scrollElement,
    children,
}: InfiniteListProps<T>) => {
    if (!scrollElement.current) {
        return null;
    }

    return (
        <WindowScroller scrollElement={scrollElement.current}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <List
                            autoHeight
                            isScrolling={isScrolling}
                            onScroll={onChildScroll}
                            scrollTop={scrollTop}
                            height={height}
                            width={width}
                            rowHeight={({ index }) => rowHeight(values[index])}
                            rowCount={values.length}
                            rowRenderer={({ key, style, index }) => (
                                <div key={key} style={style}>
                                    {children(values[index])}
                                </div>
                            )}
                        />
                    )}
                </AutoSizer>
            )}
        </WindowScroller>
    );
};
