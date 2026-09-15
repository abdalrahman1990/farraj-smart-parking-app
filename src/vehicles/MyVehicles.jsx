import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Pressable, RefreshControl, StyleSheet, Text as RNText, Image } from 'react-native';
import { useStore } from "react-redux";
import { Avatar, ListItem, Text, Button } from '@rneui/themed';
import { getVehicles } from './../apis/apis';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import urls from '../apis/urls';

const MyVehicles = (props) => {
    const T = useTheme();
    const styles = getStyles(T);
    const store = useStore();
    const user = store.getState().app.user;
    const lables = store.getState().app.trans;
    const [vehicles, setVehicles] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const lang = useLang();

    useFocusEffect(useCallback(() => {
        props.navigation.getParent().setOptions({
            headerTitle: lables['my_vehicles']
        });
    }, []));

    const loadVehicles = () => {
        return getVehicles(user.id)
            .then((res) => {
                if (res.code === 200) {
                    setVehicles(res.data.data);
                }
            })
            .catch(() => {
                setVehicles([]);
            });
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        colors={[T.primary]}
                        tintColor={T.primary}
                        onRefresh={() => {
                            setRefresh(true);
                            loadVehicles().finally(() => setRefresh(false));
                        }}
                    />
                }
            >
                {/* Header Card */}
                <View style={styles.headerCard}>
                    <View>
                        <Text style={styles.headerTitle}>{lables['my_vehicles'] || 'My Vehicles'}</Text>
                        <Text style={styles.headerSubtitle}>
                            {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} registered
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => props.navigation.navigate('NewVehicle')}
                        style={styles.addButton}
                    >
                        <Icon name="add-circle" size={22} color="#FFF" />
                        <RNText style={styles.addButtonText}>{lables['add_vehicle'] || 'Add'}</RNText>
                    </Pressable>
                </View>

                {/* Vehicle Cards */}
                <View style={styles.vehicleList}>
                    {vehicles.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Icon name="car-outline" size={60} color={T.inactive} />
                            <Text style={styles.emptyText}>No vehicles yet</Text>
                            <Text style={styles.emptySubText}>Tap "Add" to register your first vehicle</Text>
                        </View>
                    ) : (
                        vehicles.map((item) => (
                            <View key={item.id} style={styles.vehicleCard}>
                                <VehicleAvatar uri={item.image} />
                                <View style={styles.vehicleInfo}>
                                    <Text style={styles.vehicleName}>{item.name}</Text>
                                    <View style={styles.plateBadge}>
                                        <Icon name="card-outline" size={14} color={T.primaryLight} />
                                        <Text style={styles.plateText}>
                                            {item.plate_code + ' - ' + item.plate_number}
                                        </Text>
                                    </View>
                                </View>
                                <Icon name={lang === 'ar' ? 'chevron-back-outline' : 'chevron-forward-outline'} size={20} color={T.inactive} />
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const VehicleAvatar = ({ uri }) => {
    const T = useTheme();
    const [failed, setFailed] = useState(false);
    const absolutize = (u) => {
        if (!u || /^https?:\/\//.test(u)) return u;
        const base = (urls.host || '').replace(/\/$/, '');
        return base ? base + (u.startsWith('/') ? u : '/' + u) : u;
    };
    const src = absolutize(uri);
    if (!uri || !src || failed) {
        return (
            <View
                style={{
                    width: 60, height: 60, borderRadius: 30,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1.5, borderColor: T.border,
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
                }}
            >
                <Image
                    source={require('../assets/images/addcar.png')}
                    style={{ width: 44, height: 34 }}
                    resizeMode="contain"
                />
            </View>
        );
    }
    return (
        <Avatar
            source={{ uri: src }}
            size={60}
            rounded
            containerStyle={{
                borderWidth: 2,
                borderColor: T.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 3,
            }}
            onError={() => setFailed(true)}
        />
    );
};

const getStyles = (T) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: T.background,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    headerCard: {
        backgroundColor: T.primary,
        margin: 16,
        borderRadius: RADIUS.xl,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: T.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
        elevation: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        fontFamily: 'Cairo',
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 3,
    },
    addButton: {
        backgroundColor: 'rgba(255,255,255,0.22)',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 9,
        paddingHorizontal: 15,
        gap: 5,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 14,
    },
    vehicleList: {
        paddingHorizontal: 16,
    },
    vehicleCard: {
        backgroundColor: T.card,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: T.border,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOW.card,
    },
    avatarContainer: {
        borderWidth: 2,
        borderColor: T.border,
    },
    vehicleInfo: {
        flex: 1,
        marginStart: 14,
    },
    vehicleName: {
        fontSize: 16,
        fontWeight: '700',
        color: T.text,
        marginBottom: 5,
        fontFamily: 'Cairo',
    },
    plateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: T.primaryBg,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        gap: 4,
    },
    plateText: {
        fontSize: 12,
        color: T.primaryLight,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: T.textSecondary,
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 13,
        color: T.inactive,
        marginTop: 6,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

export default MyVehicles;