const STORAGE_KEY = 'notas';

export function getNotas() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveNotas(notas) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
  } catch {}
}

export function clearNotas() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}