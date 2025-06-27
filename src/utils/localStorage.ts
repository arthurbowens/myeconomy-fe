import * as SecureStorage from 'expo-secure-store'

export async function setItem(key: any, value: string) {
    try {
        await SecureStorage.setItemAsync(key, value)
    } catch (error) {
        throw error
    }
}

export async function getItem(key: string) {
    try {
        const value = await SecureStorage.getItemAsync(key)

        return value
    } catch (error) {
        throw error
    }
}

export async function removeItem(key: string) {
    try {
        await SecureStorage.deleteItemAsync(key)
    } catch (error) {
        throw error
    }
}