import { SCREEN_RESPONSES } from './DEFAULT.js';
import { findProfessionals } from '../../functions/professionals.js';
import { findProfessionalId } from '../../functions/professionals.js';

const professionals = await findProfessionals();


export const WELCOME = async (decryptedBody) => {
    const { data } = decryptedBody;

    //Success
    if (data.action_name == "manage_professional") {
        return {
            ...SCREEN_RESPONSES.MANAGE_PROFESSIONAL,
            data: {
                ...SCREEN_RESPONSES.MANAGE_PROFESSIONAL?.data,
                ...data,
                professional: professionals
            }
        };
    }

    //Time
    else if (data.action_name == "add_professional") {
        return {
            ...SCREEN_RESPONSES.ADD_PROFESSIONAL,
            data: {
                ...SCREEN_RESPONSES.ADD_PROFESSIONAL?.data,
                ...data
            },
        };
    }

    //Date
    else if (data.action_name == "view_schedule") {
        return {
            ...SCREEN_RESPONSES.VIEW_SCHEDULE,
            data: {
                ...SCREEN_RESPONSES.VIEW_SCHEDULE?.data,
                ...data
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

