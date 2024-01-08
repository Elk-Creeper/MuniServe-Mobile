import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Modal,
} from 'react-native';
import React, { useState } from 'react';
import { firebase } from '../config';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const togglePasswordVisibility3 = () => {
        setShowPassword3(!showPassword3);
    };

    const validatePassword = () => {
        if (newPassword.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
            return false;
        }
        return true;
    };

    const handleChangePassword = () => {
        const user = firebase.auth().currentUser;

        if (user) {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

            setLoading(true);

            user.reauthenticateWithCredential(credential)
                .then(() => {
                    if (newPassword === confirmNewPassword) {
                        if (validatePassword()) {
                            user.updatePassword(newPassword)
                                .then(() => {
                                    firebase.firestore().collection('users').doc(user.uid).update({
                                        password: newPassword,
                                    })
                                        .then(() => {
                                            Alert.alert('Password Updated', 'Your password has been successfully updated.');
                                        })
                                        .catch((error) => {
                                            Alert.alert('Error', error.message);
                                        })
                                        .finally(() => {
                                            setLoading(false);
                                        });
                                })
                                .catch((error) => {
                                    Alert.alert('Error', error.message);
                                    setLoading(false);
                                });
                        } else {
                            setLoading(false);
                        }
                    } else {
                        Alert.alert('Passwords do not match', 'Please make sure the new passwords match.');
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    Alert.alert('Authentication Failed', error.message);
                    setLoading(false);
                });
        } else {
            Alert.alert('User not found', 'Please make sure you are logged in.');
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Change Password</Text>

            <View style={styles.con}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Current Password"
                    secureTextEntry={!showPassword1}
                    value={currentPassword}
                    onChangeText={(text) => setCurrentPassword(text)}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility1}>
                    <MaterialIcons
                        name={showPassword1 ? 'visibility' : 'visibility-off'}
                        size={22}
                        color="black"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.con}>
                <TextInput
                    style={styles.textInput}
                    placeholder="New Password"
                    secureTextEntry={!showPassword2}
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility2}>
                    <MaterialIcons
                        name={showPassword2 ? 'visibility' : 'visibility-off'}
                        size={22}
                        color="black"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.con}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Confirm New Password"
                    secureTextEntry={!showPassword3}
                    value={confirmNewPassword}
                    onChangeText={(text) => setConfirmNewPassword(text)}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility3}>
                    <MaterialIcons
                        name={showPassword3 ? 'visibility' : 'visibility-off'}
                        size={22}
                        color="black"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="slide"
                visible={loading}
                onRequestClose={() => setLoading(false)}
            >
                <View style={styles.modalContainer}>
                    <ActivityIndicator size="large" color="#307A59" />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: "#FFFFFF",
        flexGrow: 1,
        padding: 35,
    },
    button: {
        marginTop: 200,
        height: 50,
        width: "100%",
        backgroundColor: "#307A59",
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 17,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 150,
    },
    textInput: {
        paddingTop: 10,
        paddingBottom: 15,
        width: "100%",
        fontSize: 16,
        borderColor: "#307A59",
        borderWidth: 1.5,
        borderRadius: 10,
        marginBottom: 20,
        textAlign: "left",
        paddingHorizontal: 15,
        height: 50
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    con: {
        flexDirection: 'row',
    },
    eyeIcon: {
        padding: 12,
        marginLeft: 235,
        position: 'absolute'
    },
});