// --- Lookup Maps Definition ---

import dayjs from "dayjs";

// Exported map: Number (0-6) to Portuguese Day Name
export const daysOfWeekMap = {
    0: 'Domingo',
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira',
    6: 'Sábado'
};

// Exported map: Number (0-6) to English Day Name
export const daysOfWeekMapEnglish = {
    0: 'monday',
    1: 'tuesday',
    2: 'wednesday',
    3: 'thursday',
    4: 'friday',
    5: 'saturday',
    6: 'sunday'
};

// Exported reverse map: Portuguese Day Name to Number (0-6)
export const dayNameToNumberMap = Object.entries(daysOfWeekMap).reduce((acc, [number, name]) => {
    // Converts the string key (e.g., "1") back into an integer value (e.g., 1)
    acc[name] = parseInt(number, 10);
    return acc;
}, {});

// Exported reverse map: English Day Name to Number (0-6)
export const dayNameToNumberMapEnglish = Object.entries(daysOfWeekMapEnglish).reduce((acc, [number, name]) => {
    // Converts the string key (e.g., "1") back into an integer value (e.g., 1)
    acc[name] = parseInt(number, 10);
    return acc;
}, {});

// --- Helper Functions ---

/**
 * Converts a Portuguese day name (e.g., "Segunda-feira") to its number index (e.g., 1).
 * @param {string} dayName - The name of the day.
 * @returns {number|string} The corresponding day number (0-6) or an error message string.
 */
export function DayToNumber(dayName) {
    // Lookup the number using the reverse map
    const result = dayNameToNumberMap[dayName];

    // Check if the result is defined (i.e., if the name was found)
    if (result !== undefined) {
        return result;
    }
    return `Erro: Dia "${dayName}" não encontrado.`;
}

/**
 * Converts a day number index (e.g., 1) to its Portuguese day name (e.g., "Segunda-feira").
 * @param {number} dayNumber - The number index of the day (0 for Sunday, 1 for Monday, etc.).
 * @returns {string} The corresponding day name or an error message string.
 */
export function NumberToDay(dayNumber) {
    // Lookup the name using the primary map
    const result = daysOfWeekMap[dayNumber];

    if (result) {
        return result;
    }
    return `Erro: Número de dia ${dayNumber} é inválido (esperado 0-6).`;
}

// Converts day number to closest date that corresponds to its id
// 0=Sunday, 1=Monday, 2=Tuesday, ..., 6=Saturday
// Returns date in Supabase-compatible ISO format (YYYY-MM-DD)
export function getClosestDate(dayNumber) {
    const today = dayjs();
    const currentDay = today.day();

    // Calculate days to add
    let daysToAdd = dayNumber - currentDay;

    // If the target day has already passed this week, get next week's date
    if (daysToAdd < 0) {
        daysToAdd += 7;
    }

    // Add the days and format for Supabase (YYYY-MM-DD)
    const targetDate = today.add(daysToAdd, 'day');
    return targetDate.format('YYYY-MM-DD');
}

// Add hours to dates
// Returns date in Supabase-compatible ISO format (YYYY-MM-DD HH:mm:ss+00)
export function addsHoursToDate(date, hours) {
    const targetDate = dayjs(date);
    return targetDate.add(hours, 'hour').utc().format('YYYY-MM-DD HH:mm:ss+00');
}