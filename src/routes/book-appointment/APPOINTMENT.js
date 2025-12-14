import { findServices } from '../../functions/services.js';
import { findProfessionalWorkableDays, findProfessionalWorkableTimesInChoosenDayOfWeek } from '../../functions/professionals.js';
import { findProfessionals } from '../../functions/professionals.js';
import { SCREEN_RESPONSES } from './DEFAULT.js';


const services = await findServices();
const professionals = await findProfessionals();


export const APPOINTMENT = async (decryptedBody) => {
    const { data } = decryptedBody;

    //Success
    if (data.time && data.date && data.services && data.professionals) {
        return {
            ...SCREEN_RESPONSES.APPOINTMENT,
            data: {
                ...SCREEN_RESPONSES.APPOINTMENT?.data,
                ...data,
            }
        };
    }

    //Time
    else if (data.date && data.services && data.professionals) {
        const time = await findProfessionalWorkableTimesInChoosenDayOfWeek(data.professionals, data.date);
        const date = await findProfessionalWorkableDays(data.professionals);
        return {
            ...SCREEN_RESPONSES.APPOINTMENT,
            data: {
                ...SCREEN_RESPONSES.APPOINTMENT?.data,
                ...data,
                time: time,
                date: date,
                professionals: professionals,
                services: services,
                is_professional_available: true,
                is_service_available: true,
                is_date_enabled: true,
                is_time_enabled: true,
            },
        };
    }

    //Date
    else if (data.services && data.professionals) {
        const date = await findProfessionalWorkableDays(data.professionals);
        return {
            ...SCREEN_RESPONSES.APPOINTMENT,
            data: {
                ...SCREEN_RESPONSES.APPOINTMENT?.data,
                ...data,
                date: date,
                professionals: professionals,
                services: services,
                is_professional_available: true,
                is_service_available: true,
                is_date_enabled: true,
                is_time_enabled: false,
            },
        };
    }

    //Service
    else if (data.professionals) {
        return {
            ...SCREEN_RESPONSES.APPOINTMENT,
            data: {
                ...SCREEN_RESPONSES.APPOINTMENT?.data,
                ...data,
                professionals: professionals,
                services: services,
                is_professional_available: true,
                is_service_available: true,
                is_date_enabled: false,
                is_time_enabled: false,
            },
        };
    }

    // Default return if no condition matches
    return {
        ...SCREEN_RESPONSES.APPOINTMENT,
        data: {
            ...SCREEN_RESPONSES.APPOINTMENT?.data,
            ...data,
        }
    };
};

