import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getStorageItem(item) {
    let value = null;
    try {
        value = await AsyncStorage.getItem(item);
    } catch (error) {
        console.error("Erro ao recuperar um item do storage.", error);
    }
    return value;
}

export async function setStorageItem(item: string, value: string) {
    try {
      await AsyncStorage.setItem(item, value);
    } catch (error) {
      console.error("Erro ao salvar item no storage.", error);
    }
  }
  
  export async function removeStorageItem(item: string) {
    try {
      await AsyncStorage.removeItem(item);
    } catch (error) {
      console.error("Erro ao remover item do storage.", error);
    }
  }