import { SCREEN_RESPONSES } from './DEFAULT.js';
import { findProfessionals } from '../../functions/professionals.js';
import { convertToIntervals } from '../../utils/scheduleHelpers.js';
import { dayNameToNumberMapEnglish } from '../../utils/dateHelpers.js';
import { findProfessionalId } from '../../functions/professionals.js';
import supabase from '../../config/supabase.js';


export const EDIT_PROFESSIONAL = async (decryptedBody) => {
    const { data } = decryptedBody;
    const intervals = convertToIntervals(data.newProfessionalWorkingTime);
    const days = data.newProfessionalWorkingDays.map(day => dayNameToNumberMapEnglish[day]);

    const { data: professionalData, error: professionalError } = await supabase
        .from('professionals')
        .select("id")
        .eq("name", data.professionalName)
        .single();

    console.log(professionalData)

    if (professionalError) {
        console.error("Erro no Supabase:", professionalError.message);
        console.error("Detalhes:", professionalError.details);
        console.error("Dica:", professionalError.hint);
        return;
    }

    const professionalId = professionalData.id;

    console.log(professionalId)

    const { data: eraseProfessionalSchedule, error: eraseProfessionalScheduleError } = await supabase
        .from('professional_schedule')
        .delete()
        .eq('professional_id', professionalId);

    if (eraseProfessionalScheduleError) {
        console.error("Erro ao deletar agendamento do profissional:", eraseProfessionalScheduleError.message);
        return;
    }

    // Criar um objeto para cada combinação de dia e intervalo
    const entries = days.flatMap(day =>
        intervals.map(interval => ({
            professional_id: professionalId,
            day_of_week: day,
            start_time: interval.start + ':00',
            end_time: interval.end + ':00'
        }))
    );

    const { data: professionalSchedule, error: professionalInsertError } = await supabase
        .from('professional_schedule')
        .insert(entries)
        .select();

    const { data: updateProfessionalName, error: updateProfessionalNameError } = await supabase
        .from('professionals')
        .update({ name: data.newProfessionalName })
        .eq('id', professionalId)
        .select();

    return {
        ...SCREEN_RESPONSES.DONE,
        data: {
            ...SCREEN_RESPONSES.DONE?.data,
            ...data,
            component_action: data.component_action,
            action_professional: data.action_professional,
            professional: data.professional,
            professionalName: data.professionalName,
            professionalWorkingDays: JSON.stringify(data.professionalWorkingDays),
            professionalWorkingTime: JSON.stringify(data.professionalWorkingTime)
        }
    };
};