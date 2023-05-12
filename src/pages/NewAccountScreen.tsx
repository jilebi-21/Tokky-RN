import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Button, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, TextInput, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { RootStackParamList } from '../../App'
import useTheme, { appTheme } from '../Theming'
import { FormField } from '../components/FormField'
import PickerDial from '../components/PickerDial'
import RootView from '../components/RootView'
import { ThemedButton, ThemedText } from '../components/ThemedComponents'
import { addAccount } from '../data/action'
import DB from '../database/AccountsDB'
import Account from '../models/Account'
import { Base32 } from '../utils/Base32'
import { DEFAULT_DIGITS, DEFAULT_PERIOD, isAndroid, isIOS } from '../utils/Utils'
import { AlgorithmType } from '../utils/Constants'

type AddAccountScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'NewAccountScreen'>
}

export default function NewAccountScreen({ navigation }: AddAccountScreenProps) {
    const [issuer, setIssuer] = useState<string>('')
    const [label, setLabel] = useState<string>('')
    const [secretKey, setSecretKey] = useState<string>('')

    const [algo, setAlgo] = useState<string>('sha1')
    const [digits, setDigits] = useState<number>(DEFAULT_DIGITS)
    const [period, setPeriod] = useState<number>(DEFAULT_PERIOD)

    const theme = useTheme()
    const styles = pageStyles(theme)

    const dispatch = useDispatch()

    const algorithm_options = [
        { label: 'SHA-1 (Default)', value: 'sha1', key: '1', inputLabel: 'SHA-1' },
        { label: 'SHA-256', value: 'sha256', key: '2', inputLabel: 'SHA-256' },
        { label: 'SHA-512', value: 'sha512', key: '3', inputLabel: 'SHA-512' },
    ]

    const digits_options = [
        { label: '4 digits', value: 4, key: '1' },
        { label: '5 digits', value: 5, key: '2' },
        { label: '6 digits', value: 6, key: '3' },
        { label: '7 digits', value: 7, key: '4' },
        { label: '8 digits', value: 8, key: '5' },
    ]

    async function createAccount() {
        if (issuer?.length == 0) {
            Alert.alert('Error', 'Please enter a issuer name')
            return
        }

        if (secretKey?.length == 0) {
            Alert.alert('Error', "Secret Key can't be empty")
            return
        }
        try {
            const secretKeyHex = Base32.base32ToHex(secretKey)

            let algoType: AlgorithmType = 'SHA-1'
            if (algo == 'sha256') algoType = 'SHA-256'
            if (algo == 'sha512') algoType = 'SHA-512'

            const newAccount = Account.createAccount(issuer, label, secretKeyHex, algoType, digits, period)

            try {
                const rowId = await DB.insert(newAccount)
                if (typeof rowId === 'number' && rowId > 0) dispatch(addAccount(newAccount))
            } catch (err) {
                console.log(err)
                Alert.alert('Error adding item to DB')
            }
            navigation.goBack()
        } catch (er: any) {
            Alert.alert(er.message)
        }
    }

    const SaveBtn = () => <ThemedButton title="Done" onPress={createAccount} />

    useLayoutEffect(() => {
        isIOS() &&
            navigation.setOptions({
                headerRight: () => <SaveBtn />,
                headerLeft: () => <ThemedButton title="Cancel" onPress={() => navigation.goBack()} />,
            })

        StatusBar.setBarStyle('light-content', true)
        return () => {
            StatusBar.setBarStyle('default', true)
        }
    }, [navigation, issuer, label, secretKey, algo, digits, period])

    const handleIssuerChange = (text: string) => {
        setIssuer(text)
    }
    const handleLabelChange = (text: string) => {
        setLabel(text)
    }
    const handleSecretKeyChange = (text: string) => {
        setSecretKey(text)
    }

    function Divider() {
        return <View style={styles.divider} />
    }

    return (
        <RootView style={[isIOS() && styles.root]}>
            <ScrollView>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={isIOS() ? 'padding' : undefined}>
                    <View style={{ height: 25 }} />
                    <FormField
                        style={styles.textInputStyle}
                        parentStyle={{ marginTop: 30 }}
                        label="Issuer"
                        placeholder="Company name"
                        onChangeText={handleIssuerChange}
                        autoFocus={true}
                    />
                    <Divider />
                    <FormField
                        style={styles.textInputStyle}
                        label="Label"
                        placeholder="Username or email (Optional)"
                        onChangeText={handleLabelChange}
                    />
                    <Divider />
                    <FormField style={styles.textInputStyle} label="Secret Key" placeholder="Secret Key" onChangeText={handleSecretKeyChange} />

                    <View style={styles.adv_layout_container}>
                        <ThemedText style={styles.adv_layout_title}>Advanced options</ThemedText>
                        <ThemedText style={styles.adv_layout_summary}>
                            Changing these options may cause unexpected consequences. Leave defaults if unsure.
                        </ThemedText>
                    </View>

                    <PickerDial
                        title={'Algorithm'}
                        onValueChange={value => setAlgo(value)}
                        items={algorithm_options}
                        value={algo}
                        fieldValue={algorithm_options.find(item => item.value === algo)!.inputLabel}
                    />
                    <Divider />
                    <PickerDial
                        title={'Length'}
                        onValueChange={value => setDigits(value)}
                        items={digits_options}
                        value={digits}
                        fieldValue={digits_options.find(item => item.value === digits)!.label}
                    />
                    <Divider />
                    <FormField
                        style={styles.textInputStyle}
                        label="Period"
                        placeholder="Period"
                        onChangeText={value => setPeriod(parseInt(value))}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
            {isAndroid() && <SaveBtn />}
        </RootView>
    )
}

const pageStyles = (theme: typeof appTheme) =>
    StyleSheet.create({
        root: {
            backgroundColor: theme.color.modal.bg,
        },
        divider: {
            height: 1.5,
            backgroundColor: theme.color.modal.bg_variant2,
        },
        textInputStyle: {
            backgroundColor: theme.color.modal.bg_variant,
            borderColor: theme.color.modal.bg_variant2,
        },
        adv_layout_container: {
            marginTop: 40,
            marginBottom: 25
        },
        adv_layout_title: {
            fontSize: 16,
            textAlign: 'center',
        },
        adv_layout_summary: {
            color: theme.color.text_color_secondary,
            marginTop: 5,
            textAlign: 'center',
        },
    })
