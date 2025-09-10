export function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Erro ao salvar dados no localStorage para a chave "${key}":`, error);
    }
}

export function loadData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Erro ao carregar dados do localStorage para a chave "${key}":`, error);
        return defaultValue;
    }
}