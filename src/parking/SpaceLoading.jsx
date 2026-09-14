import React from 'react';
import { Skeleton } from '@rneui/themed';
import { View } from 'react-native';
import { tileSize, columnsFor } from '../utils/responsive';
import { useTheme } from '../utils/useTheme';
const SpaceLoading = () => {
    const T = useTheme();
    const cols = columnsFor(86, 10, 76);
    const size = tileSize(cols, 10, 76);
    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
            }}
        >
            {Array.from({ length: cols * 2 }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={size}
                    height={size}
                    style={{ margin: 5, borderRadius: 20 }}
                    skeletonStyle={{ backgroundColor: T.border }}
                />
            ))}
        </View>
    );
}

export default SpaceLoading;
