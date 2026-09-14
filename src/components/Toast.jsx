import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { toast } from '../utils/toastBus';
import { useTheme } from '../utils/useTheme';

const Toast = () => {
    const T = useTheme();
    const config = {
        success: { bg: '#059669', icon: 'checkmark-circle' },
        error: { bg: '#DC2626', icon: 'alert-circle' },
        info: { bg: T.primary, icon: 'information-circle' },
    };
    const [items, setItems] = useState([]);
    useEffect(() => {
        return toast.subscribe((action) => {
            if (action.type === 'add') {
                setItems((prev) => [...prev, action.item]);
            } else if (action.type === 'remove') {
                setItems((prev) => prev.filter((i) => i.id !== action.id));
            }
        });
    }, []);
    return (
        <View
            pointerEvents="box-none"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                alignItems: 'center',
                zIndex: 9999,
                paddingTop: 54,
                paddingHorizontal: 16,
            }}
        >
            {items.map((i) => {
                const c = config[i.type] || config.info;
                return (
                    <Pressable
                        key={i.id}
                        onPress={() => toast.dismiss(i.id)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: c.bg,
                            borderRadius: 18,
                            paddingVertical: 14,
                            paddingHorizontal: 18,
                            marginBottom: 10,
                            maxWidth: 420,
                            width: '100%',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.25)',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.35,
                            shadowRadius: 16,
                            elevation: 10,
                        }}
                    >
                        <Icon name={c.icon} size={22} color="#FFFFFF" />
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontWeight: '700',
                                fontSize: 14,
                                marginStart: 10,
                                flex: 1,
                                fontFamily: 'Cairo, sans-serif',
                            }}
                        >
                            {i.message}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

export default Toast;
