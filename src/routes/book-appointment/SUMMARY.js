import { SCREEN_RESPONSES } from './DEFAULT.js';


export const SUMMARY = async (decryptedBody) => {
    const { flow_token, data } = decryptedBody;

    // This is the final screen - return success response
    return {
        screen: "SUCCESS",
        data: {
            ...SCREEN_RESPONSES.SUCCESS?.data,
            ...data
        },
    };
};
