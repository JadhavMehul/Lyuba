import { View, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import { goBack } from "@utils/NavigationUtils";
import { apiFetch } from '@utils/api'

type BlockedUser = {
    uid: string;
    firstName?: string;
    lastName?: string;
    pictures?: string[];
};

const BlockListScreen = () => {
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [unblockingId, setUnblockingId] = useState<string | null>(null);

    const loadBlockedUsers = useCallback(async () => {
        try {
            const res = await apiFetch('/api/userDetails/blockedUsers', { method: 'POST' });
            const data = await res.json();
            setBlockedUsers(data.success ? data.data : []);
        } catch (error) {
            console.log('Error loading blocked users:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBlockedUsers();
    }, [loadBlockedUsers]);

    const handleUnblock = (user: BlockedUser) => {
        Alert.alert(
            'Unblock user',
            `Unblock ${user.firstName || 'this user'}? They'll be able to see your profile and message you again.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unblock',
                    onPress: async () => {
                        setUnblockingId(user.uid);
                        try {
                            await apiFetch('/api/userDetails/unblockUser', {
                                method: 'POST',
                                body: { blockedUserId: user.uid },
                            });
                            setBlockedUsers(prev => prev.filter(u => u.uid !== user.uid));
                        } catch (error) {
                            console.log('Error unblocking user:', error);
                            Alert.alert('Error', 'Unable to unblock this user right now.');
                        } finally {
                            setUnblockingId(null);
                        }
                    },
                },
            ],
        );
    };

    return (
        <CustomSafeAreaView style={{}}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.topmessagebar}>
                    <View style={styles.backcon}>
                        <TouchableOpacity onPress={goBack}>
                            <Image
                                source={require("@assets/icons/back.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TextComponent style={styles.title1}>
                            Block List
                        </TextComponent>
                    </View>
                </View>

                <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : blockedUsers.length === 0 ? (
                        <TextComponent style={styles.emptyText}>
                            You haven't blocked anyone.
                        </TextComponent>
                    ) : (
                        <FlatList
                            data={blockedUsers}
                            keyExtractor={(item) => item.uid}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={styles.row}>
                                    <Image
                                        source={
                                            item.pictures?.[0]
                                                ? { uri: item.pictures[0] }
                                                : require("@assets/icons/Account.png")
                                        }
                                        style={styles.avatar}
                                    />
                                    <TextComponent style={styles.name}>
                                        {`${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unknown user'}
                                    </TextComponent>
                                    <TouchableOpacity
                                        style={styles.unblockBtn}
                                        onPress={() => handleUnblock(item)}
                                        disabled={unblockingId === item.uid}
                                    >
                                        <TextComponent style={styles.unblockText}>
                                            {unblockingId === item.uid ? '...' : 'Unblock'}
                                        </TextComponent>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </CustomSafeAreaView>
    )
}

const styles = StyleSheet.create({
    title1: {
        fontFamily: Fonts.Poppins_SemiBold_600,
        fontSize: 24,
        color: '#000000',
        textAlign: 'left',
        lineHeight: 30,
    },
    backcon: {
        flexDirection: 'row',
        gap: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    image: {
        width: 24,
        height: 24,
    },
    topmessagebar: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#666666',
    },
    emptyText: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FFE3E8',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFE3E8',
    },
    name: {
        flex: 1,
        fontFamily: Fonts.Poppins_Medium_500,
        fontSize: 16,
        color: '#000000',
    },
    unblockBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FF6F61',
    },
    unblockText: {
        fontFamily: Fonts.Poppins_Medium_500,
        fontSize: 14,
        color: '#FF6F61',
    },
})

export default BlockListScreen
