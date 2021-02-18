import React, { useState } from 'react'
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text, TouchableOpacity, TextInput, Platform } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'

import commonStyles from '../commonStyles'

import moment from 'moment'

const initialState = { description: '', date: new Date(), showDatePicker: false }

export default (props) => {

    const [state, setState] = useState({ ...initialState })

    getDatePicker = () => {

        let datePicker = (<DateTimePicker value={state.date} mode='date' onChange={(_, date) => {
            date = date ? date : new Date()
            setState({ ...state, date, showDatePicker: false })
        }} />)

        const formattedDate = moment(state.date).format('ddd, D [de] MMMM')

        if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => setState({ ...state, showDatePicker: true })}>
                        <Text style={styles.date}>
                            {formattedDate}
                        </Text>
                    </TouchableOpacity>
                    {state.showDatePicker && datePicker}
                </View>
            )
        }

        return datePicker
    }

    saveTask = () => {
        const newTask = {
            description: state.description,
            date: state.date
        }

        props.onSave && props.onSave(newTask)
        setState({ ...initialState })
    }

    return (
        <Modal onRequestClose={props.onCancel} transparent={true} visible={props.isVisible} animationType='slide'>
            <TouchableWithoutFeedback onPress={props.onCancel}>
                <View style={styles.background} ></View>
            </TouchableWithoutFeedback>
            <View style={styles.container}>
                <Text style={styles.header}> Nova Tarefa </Text>
                <TextInput style={styles.input} placeholder='Informe a descrição' value={state.description} onChangeText={description => setState({ ...state, description })} />
                {getDatePicker()}
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button} onPress={props.onCancel}>
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={saveTask}>
                        <Text>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={props.onCancel}>
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        backgroundColor: '#fff'
    },
    header: {
        fontFamily: 'Lato_400Regular',
        fontSize: 20,
        color: commonStyles.colors.secondary,
        padding: 15,
        backgroundColor: commonStyles.colors.today,
        textAlign: 'center'
    },
    input: {
        fontFamily: 'Lato_400Regular',
        height: 40,
        margin: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e3e3e3',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        margin: 20,
        marginRight: 25,
        color: commonStyles.colors.today,
    },
    date: {
        fontFamily: 'Lato_400Regular',
        fontSize: 20,
        marginLeft: 15
    }
})