import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import AppLoading from 'expo-app-loading';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';

import moment from 'moment'
import 'moment/locale/pt-br'

import Icon from 'react-native-vector-icons/FontAwesome'

import todayImage from '../../assets/imgs/today.jpg'
import Task from '../components/Task'
import AddTask from './AddTask'
import commonStyles from '../commonStyles'

export default () => {

    const [tasks, setTasks] = useState([]);

    const [showDoneTasks, setShowDoneTasks] = useState(true)

    const [showAddTask, setShowAddTask] = useState(false)

    const [visibleTasks, setVisibleTasks] = useState([])

    useEffect(() => {

        async function getTask() {
            const tasksState = await AsyncStorage.getItem('tasksState')
            const state = JSON.parse(tasksState) || []
            setTasks(state)
            filterTasks()
        }

        getTask()
    }, [])

    toggleTask = (taskID) => {
        const listTasks = [...tasks]

        listTasks.forEach((task) => {
            if (task.id === taskID) {
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        setTasks(listTasks)
    }

    toggleFilter = () => {
        setShowDoneTasks(!showDoneTasks)
    }

    useEffect(() => {
        filterTasks()
    }, [showDoneTasks]);

    useEffect(() => {
        filterTasks()
    }, [tasks]);

    filterTasks = () => {
        let visibleTasks = null
        if (showDoneTasks) {
            visibleTasks = [...tasks]
        } else {
            const pending = taks => taks.doneAt === null
            visibleTasks = tasks.filter(pending)
        }

        setVisibleTasks(visibleTasks)
        AsyncStorage.setItem('tasksState', JSON.stringify(tasks))
    }

    addTask = (newTask) => {
        if (!newTask.description || !newTask.description.trim()) {
            Alert.alert("Dados inválidos", "Descrição não foi informada")
            return
        }

        const newListTasks = [...tasks]
        newListTasks.push({
            id: Math.random(),
            description: newTask.description,
            estimateAt: newTask.date,
            doneAt: null
        })

        setTasks(newListTasks)
        setShowAddTask(false)
    }

    deleteTask = (id) => {
        const newListTasks = tasks.filter(task => task.id !== id)
        setTasks(newListTasks)
    }

    let [fontsLoaded] = useFonts({ Lato_400Regular });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

    return (
        <SafeAreaView style={styles.container}>
            <AddTask isVisible={showAddTask} onCancel={() => { setShowAddTask(false) }} onSave={addTask} />
            <ImageBackground source={todayImage} style={styles.background}>
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={toggleFilter}>
                        <Icon name={showDoneTasks ? 'eye' : 'eye-slash'} size={20} color={commonStyles.colors.secondary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>Hoje</Text>
                    <Text style={styles.subtitle}>{today}</Text>
                </View>
            </ImageBackground>
            <View style={styles.tasklist}>
                <FlatList data={visibleTasks} keyExtractor={item => `${item.id}`}
                    renderItem={({ item }) => { return <Task {...item} toggleTask={toggleTask} onDelete={deleteTask} /> }} />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.addButton} onPress={() => { setShowAddTask(true) }}>
                <Icon name='plus' size={20} color={commonStyles.colors.secondary} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    tasklist: {
        flex: 7,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.font,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },
    subtitle: {
        fontFamily: commonStyles.font,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    iconBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginHorizontal: 20,
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
})