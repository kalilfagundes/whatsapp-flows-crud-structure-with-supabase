import { SCREEN_RESPONSES } from './DEFAULT.js';
import { findProfessionals } from '../../functions/professionals.js';
import supabase from '../../config/supabase.js';
import { findProfessionalId } from '../../functions/professionals.js';


const professional = await findProfessionals();


export const MANAGE_PROFESSIONAL = async (decryptedBody) => {
    const { data } = decryptedBody;

    if (data.action_professional == "edit_professional") {
        return {
            ...SCREEN_RESPONSES.EDIT_PROFESSIONAL,
            data: {
                ...SCREEN_RESPONSES.EDIT_PROFESSIONAL?.data,
                ...data,
                professional: data.professional
            }
        };
    }

    else if (data.action_professional == "add_professional") {
        return {
            ...SCREEN_RESPONSES.ADD_PROFESSIONAL,
            data: {
                ...SCREEN_RESPONSES.ADD_PROFESSIONAL?.data,
                ...data,
                professional: data.professional
            },
        };
    }

    else if (data.action_professional == "delete_professional") {
        // Warning: SCREEN_RESPONSES.DELETE_PROFESSIONAL is not defined in DEFAULT.js
        // Returning DONE for now to avoid crash

        const [professionalId] = await findProfessionalId(data.professional)

        console.log(professionalId)

        const deleteProfessionalAppointments = await supabase
            .from('appointments')
            .delete()
            .eq('professional_id', professionalId);

        const deleteProfessionalSchedule = await supabase
            .from('professional_schedule')
            .delete()
            .eq('professional_id', professionalId);

        const deleteProfessional = await supabase
            .from('professionals')
            .delete()
            .eq('id', professionalId);

        return {
            ...SCREEN_RESPONSES.DONE,
            data: {
                ...SCREEN_RESPONSES.DONE?.data,
                ...data,
                professional: data.professional
            },
        };
    }

    // Default fallback
    console.error("Unknown action_professional:", data.action_professional);
    return {
        ...SCREEN_RESPONSES.MANAGE_PROFESSIONAL, // Stay on same screen or go to error
        data: {
            ...SCREEN_RESPONSES.MANAGE_PROFESSIONAL?.data,
            ...data
        }
    };
};

