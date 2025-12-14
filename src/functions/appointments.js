import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import supabase from '../config/supabase.js'
import { findProfessionalId } from './professionals.js'
import { findServiceId } from './services.js'
import { findServicesDuration } from './services.js'
import { getClosestDate } from '../utils/dateHelpers.js'
import { addsHoursToDate } from '../utils/dateHelpers.js'


dayjs.extend(utc)
dayjs.extend(timezone)

const SLOT_DURATION_MINUTES = 30

/**
 * Retorna os slots de horário ocupados de um profissional em um dia da semana específico
 * @param {string} professionalName - Nome do profissional
 * @param {number} choosenWeekDay - Dia da semana (0-6, onde 0 = Domingo)
 * @returns {Promise<Array<{start_time: string, end_time: string}>>} Array de slots ocupados
 */
export const findAppointments = async (professionalName, choosenWeekDay) => {
    const professional_id = await findProfessionalId(professionalName)

    const targetDate = getNextWeekdayDate(choosenWeekDay)
    const appointments = await fetchAppointments(targetDate)

    return generateOccupiedSlots(appointments)
}

/**
 * Calcula a próxima data do dia da semana escolhido
 */
const getNextWeekdayDate = (targetWeekday) => {
    const today = dayjs()
    const currentWeekday = today.day()

    let daysUntil = targetWeekday - currentWeekday
    if (daysUntil < 0) {
        daysUntil += 7
    }

    return today.add(daysUntil, 'day')
}

/**
 * Busca agendamentos do dia no Supabase
 */
const fetchAppointments = async (date) => {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('start_time', date.startOf('day').toISOString())
        .lte('start_time', date.endOf('day').toISOString())

    if (error) {
        console.error('Error fetching appointments:', error)
        return []
    }

    return data || []
}

/**
 * Gera todos os slots de 30min ocupados baseado nos agendamentos
 */
const generateOccupiedSlots = (appointments) => {
    const occupiedSlots = []

    appointments.forEach(appointment => {
        const slots = splitAppointmentIntoSlots(appointment)
        occupiedSlots.push(...slots)
    })

    return occupiedSlots
}

/**
 * Divide um agendamento em slots de 30 minutos
 */
const splitAppointmentIntoSlots = (appointment) => {
    const slots = []
    let currentTime = dayjs(appointment.start_time)
    const endTime = dayjs(appointment.end_time)

    while (currentTime.isBefore(endTime)) {
        const slotEnd = currentTime.add(SLOT_DURATION_MINUTES, 'minute')

        slots.push({
            start_time: currentTime.format('HH:mm'),
            end_time: slotEnd.format('HH:mm')
        })

        currentTime = slotEnd
    }

    return slots
}

// CREATE APPOINTMENT

const CreateAppointment = async (professionalName, clienteName, serviceName, date, time) => {

    const closestDate = getClosestDate(date)
    const closestDateAndTime = addsHoursToDate(closestDate, time)

    const { data, error } = await supabase
        .from('appointments')
        .insert([
            {
                professional_id: findProfessionalId(professionalName),
                client_id: findClientId(clienteName),
                service_id: findServiceId(serviceName),
                start_time: closestDateAndTime,
                end_time: closestDateAndTime.add(findServiceDuration(serviceName), 'minute')
            }
        ])
        .select()

    if (error) {
        console.error('Error creating appointment:', error)
        return null
    }

    return data || null
}