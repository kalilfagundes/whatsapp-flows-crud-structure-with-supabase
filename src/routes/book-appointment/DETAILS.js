import { SCREEN_RESPONSES } from './DEFAULT.js';

export const DETAILS = async (decryptedBody) => {
    const { data, flow_token } = decryptedBody;

    // Build appointment summary from the data
    const appointment = `Professional: ${data.professionals}\nService: ${data.services}\nDate: ${data.date}\nTime: ${data.time}`;

    return {
        screen: "SUMMARY",
        data: {
            ...SCREEN_RESPONSES.SUMMARY?.data,
            ...data,
            appointment_summary: appointment
        }
    };
};
