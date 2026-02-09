import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import TextComponent from '@components/global/TextComponent';
import { ENV, Fonts } from '@utils/Constants';
import InputField from '@components/global/InputField';
import MessageLeftComponent from '@components/global/MessageLeftComponent';
import MessageRightComponent from '@components/global/MessageRightComponent';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getTime, isToday, isSameDay, getFullDate } from "@utils/ChatHelper";
import { socket } from '@utils/Socket';



const { width } = Dimensions.get('window');


type RouteParams = {
  myId: string;
  otherUserId: string;
};

type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

type MessageType = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: FirestoreTimestamp | string;
};


const MessageScreen2 = () => {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { myId, otherUserId } = route.params;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<MessageType[]>([]);
    const flatListRef = React.useRef<FlatList>(null);

    

    const fetchMessages = async (myId: string, otherUserId: string) => {

        const payload = {
            userA: myId, 
            userB: otherUserId
        }

        try {
            const api = `${ENV.API_IP}:3000/api/message/getMessage`;
            const res = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload), 
            });
            const data = await res.json();

            if (res.ok) {
                setMessages(data || []);
            }
        } catch (error) {
            console.log("Error loading messages:", error);
        }
    };

    const snedMessageFunction = async (myId: string, otherUserId: string, message: string) => {

        const chatId = myId < otherUserId ? `${myId}_${otherUserId}` : `${otherUserId}_${myId}`;


        const payload = {
            senderId: myId,
            receiverId: otherUserId,
            text: message,
            chatId
        }

        try {
            const api = `${ENV.API_IP}:3000/api/message/sendMessage`;

            const res = await fetch(api, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload), 
            });

            // if (res.status === 200) {
            //     setMessage('')

            //     const newMsg: MessageType = {
            //         id: Date.now().toString(), // temporary id
            //         senderId: myId,
            //         receiverId: otherUserId,
            //         text: message,
            //         createdAt: new Date().toISOString(),
            //     };

            //     setMessages(prev => [...prev, newMsg]);
            //     // 🔥 send via socket to receiver
            //     socket.emit("sendMessage", {
            //         id: Date.now().toString(),
            //         senderId: myId,
            //         receiverId: otherUserId,
            //         text: message,
            //         chatId,
            //         createdAt: new Date().toISOString(),
            //     });

            // }

            if (res.status === 200) {
                setMessage('');

                const msgPayload = {
                    id: Date.now().toString(),
                    senderId: myId,
                    receiverId: otherUserId,
                    text: message,
                    chatId,
                    createdAt: new Date().toISOString(),
                };

                // ❗ DO NOT setMessages here
                // Let socket event handle UI update

                socket.emit("sendMessage", msgPayload);
            }


            const data = await res.json();
            console.log(data);


        } catch (error) {
            console.log("Error in swypedUser API:", error);
        }
    }

    const renderItem = ({ item, index }: { item: MessageType; index: number }) => {
        const isMine = item.senderId === myId;

        const prevMessage = messages[index - 1];

        const showDateLabel =
            index === 0 || !isSameDay(item.createdAt, prevMessage?.createdAt);

        const label = isToday(item.createdAt) ? "Today" : getFullDate(item.createdAt);

        const time = getTime(item.createdAt);

        return (
            <>
            {showDateLabel && (
                <View style={styles.wrapper}>
                <View style={styles.line} />
                <Text style={styles.text}>{label}</Text>
                <View style={styles.line} />
                </View>
            )}

            {isMine ? (
                <MessageRightComponent message={item.text} time={time} />
            ) : (
                <MessageLeftComponent message={item.text} time={time} />
            )}
            </>
        );
    };

    

    useEffect(() => {
        fetchMessages(myId, otherUserId);

        const chatId =
            myId < otherUserId
                ? `${myId}_${otherUserId}`
                : `${otherUserId}_${myId}`;

        // 🔹 connect once
        socket.connect();

        // 🔹 join correct room
        socket.emit("joinChat", chatId);

        // 🔹 listen BEFORE any message comes
        socket.on("newMessage", (newMsg) => {
            setMessages(prev => [...prev, newMsg]);
        });

        return () => {
            socket.off("newMessage");
            socket.disconnect();
        };
    }, [myId, otherUserId]);



    return (
        <View style={styles.container}>


            <CustomSafeAreaView>


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
                                Emelie Clark

                            </TextComponent>


                        </View>

                    </View>
                    {/* <View style={{ flex: 1, padding: 16 }}> */}
                        {/* <View style={styles.wrapper}>
                            <View style={styles.line} />
                            <Text style={styles.text}>Today</Text>
                            <View style={styles.line} />
                        </View> */}


                        {/* <MessageLeftComponent
                            message="Hi Jake, how are you? I saw on the app that we’ve crossed paths several times this week 😄"
                            time="2:55 PM"
                        />


                        <MessageRightComponent
                            message="Hey! Yes, I’ve noticed that too 😄 How’s your week been?Hey! Yes, I’ve noticed that too 😄 How’s your week been?Hey! Yes, I’ve noticed that too 😄 How’s your week been?Hey! Yes, I’ve noticed that too 😄 How’s your week been?"
                            time="2:57 PM"
                        /> */}


                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 16 }}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        />


                    {/* </View> */}
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 24, flexDirection: 'row', gap: 10 }}>
                        <InputField
                            placeholder="Message"
                            style={styles.formessage}
                            placeholderTextColor="#000000"
                            value={message}
                            onChangeText={setMessage}
                        />
                        <TouchableOpacity style={styles.sendmessage} activeOpacity={0.6} onPress={()=> snedMessageFunction(myId, otherUserId, message)}>
                            <View >
                                <Image
                                    source={require("@assets/icons/send.png")}
                                    style={styles.image2}
                                />

                            </View>

                        </TouchableOpacity>

                    </View>
                </View>
            </CustomSafeAreaView>
        </View>
    )
}

export default MessageScreen2




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topmessagebar: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#666666',
    },
    image: {
        width: 24,
        height: 24,

    },
    image2: {
        width: 23,
        height: 20,
    },
    backcon: {
        paddingVertical: 8,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },

    title1: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
    },
    formessage: {
        flex: 1,
        width: 'auto',
        backgroundColor: '#fff',
        color: '#000',
        shadowColor: "0",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,

    },
    sendmessage: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FF7F7F',
        borderWidth: 2,
        backgroundColor: '#FFB6C1',
        // padding: 24,
        width: 54,
        borderRadius: 12,
    },

    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    text: {
        marginHorizontal: 10,
        color: '#444',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
})