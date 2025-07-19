import * as SecureStore from "expo-secure-store";

let token = null;

export async function setToken(newToken) {
    token = newToken ? String(newToken).trim() : null;
    console.log("setToken - Valor recebido:", newToken);
    console.log("setToken - Valor convertido:", token);
    console.log("setToken - Tipo convertido:", typeof token);

    if (token !== null) {
        try {
            await SecureStore.setItemAsync("token", token);
            console.log("Token salvo com sucesso:", token);
        } catch (error) {
            console.log("Erro ao salvar token no SecureStore:", error);
            throw error;
        }
    } else {
        await SecureStore.deleteItemAsync("token");
        console.log("Token nulo, chave deletada do SecureStore");
    }
}

export async function getToken() {
    if (token !== null) {
        console.log("Token retornado da memória:", token);
        return token;
    }
    token = await SecureStore.getItemAsync("token");
    console.log("Token recuperado do SecureStore:", token);
    return token;
}