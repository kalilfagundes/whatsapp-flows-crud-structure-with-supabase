import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import supabase from '../config/supabase.js';
import { daysOfWeekMap, dayNameToNumberMap, DayToNumber, NumberToDay } from '../utils/dateHelpers.js';
import { findAppointments } from './appointments.js';
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

// Find Professionals by Name

export const findProfessionals = async () => {
    const { data, error } = await supabase
        .from('professionals')
        .select('id:name, title:name')
        .order('name', { ascending: true })
    if (error) {
        console.error('Error fetching professionals:', error)
        return []
    }
    return data || []
}

// Fetch ProfessionalId by Name

export const findProfessionalId = async (professionalName) => {
    const { data, error } = await supabase
        .from('professionals')
        .select('id')
        .eq('name', professionalName)
        .order('name', { ascending: true })
    if (error) {
        console.error('Error fetching professionals:', error)
        return []
    }

    const professionalId = data || []
    return professionalId.map(professional => professional.id) || []
}

// Find Which Days of the Week Professionals Works

export const findProfessionalWorkableDays = async (professionalName) => {

    let professional_id = await findProfessionalId(professionalName)
    if (professional_id.length === 0) {
        return []
    }

    const { data, error } = await supabase
        .from('professional_schedule')
        .select('id:day_of_week::text,day_of_week::text', { distinct: true })
        .eq('professional_id', professional_id)
        .order('day_of_week', { ascending: true })

    if (error) {
        console.error('Error fetching professional workable days:', error)
        return []
    }

    const professionalWorkableDaysArray = data || []

    const professionalWorkableDays = professionalWorkableDaysArray.map(item => ({
        id: daysOfWeekMap[item.day_of_week] || `Dia ${item.day_of_week} Inválido`,
        title: daysOfWeekMap[item.day_of_week] || `Dia ${item.day_of_week} Inválido`
    }));

    return [...new Map(
        professionalWorkableDays.map(item => [item.title, { id: item.id, title: item.title }])
    ).values()];
}

// Find what are the free slots of a given professional in a choosen day of the week
export const findProfessionalWorkableTimesInChoosenDayOfWeek = async (professionalName, choosenWeekDay) => {

    const choosenWeekdayMap = DayToNumber(choosenWeekDay)

    //Gets Professional ID
    let professional_id = await findProfessionalId(professionalName)
    if (professional_id.length === 0) {
        return []
    }

    function getClosestWeekday(targetWeekday) {
        let date = dayjs();

        while (date.day() !== targetWeekday) {
            date = date.add(1, 'day');
        }

        return date;
    }

    const choosenWeekDayDate = getClosestWeekday(choosenWeekdayMap)

    // GetsDefaultWorkableHoursOfChoosenDayOfWeek
    const { data, error } = await supabase
        .from('professional_schedule')
        .select('start_time, end_time')
        .eq('professional_id', professional_id)
        .order('start_time', { ascending: true })

    if (error) {
        console.error('Error fetching professional workable times:', error)
        return []
    }

    const professionalWorkableTimesArray = data || []

    function generate30MinSlots(professionalWorkableTimesArray) {
        const slots = [];

        professionalWorkableTimesArray.forEach(range => {
            // Parse times usando dayjs
            let currentTime = dayjs(range.start_time, 'HH:mm:ss');
            const endTime = dayjs(range.end_time, 'HH:mm:ss');

            // Loop até chegar no horário final
            while (currentTime.isBefore(endTime)) {
                // Adiciona 30 minutos
                const slotEndTime = currentTime.add(30, 'minute');

                // Só adiciona o slot se não ultrapassar o horário final
                if (slotEndTime.isSameOrBefore(endTime)) {
                    slots.push({
                        start_time: currentTime.format('HH:mm'),
                        end_time: slotEndTime.format('HH:mm')
                    });
                }

                currentTime = slotEndTime;
            }
        });

        return slots;
    }

    const workableTimes = generate30MinSlots(professionalWorkableTimesArray)

    const appointments = await findAppointments(professionalName, choosenWeekdayMap)

    const availableTime = workableTimes.filter(slot =>
        !appointments.some(appointment =>
            appointment.start_time === slot.start_time &&
            appointment.end_time === slot.end_time
        )
    )

    return [...new Map(
        availableTime.map(slot => [slot.start_time, { id: slot.start_time, title: slot.start_time }])
    ).values()];

}

// Add professional

export const addProfessional = async (professionalName, professionalWorkingDays, professionalWorkingTime) => {
    const professional = {
        name: professionalName
    }

    const { data, error } = await supabase.from('professionals').insert(professional);
    if (error) {
        console.error('Error adding professional:', error)
        return null
    }



    const professionalSchedule = {
        professional_id: data[0].id,
        day_of_week: professionalWorkingDays,
        start_time: professionalWorkingTime,
        end_time: professionalWorkingTime
    }

    const professionalId = data[0].id;

    return professionalId;
}

