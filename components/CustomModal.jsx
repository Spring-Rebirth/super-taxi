import { useState } from 'react';
import { View, Text, Button } from 'react-native'
import Modal from 'react-native-modal';

export default function CustomModal() {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View>
            <Modal isVisible={isModalVisible}>
                <View className='w-[95%] h-96 rounded-xl items-center'>
                    <Text>Hello!</Text>
                    <Button title="Hide Modal" onPress={toggleModal} />
                </View>
            </Modal>
        </View>
    )
}