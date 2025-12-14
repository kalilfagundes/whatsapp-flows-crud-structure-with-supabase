import { Router } from 'express';
import { flowEncryptionMiddleware } from '../../middleware/encryptionMiddleware.js';
import { getNextScreen } from './DEFAULT.js';
import { encryptResponse } from '../../utils/encryption.js';

const router = Router();

router.use(flowEncryptionMiddleware);

router.post('/', async (req, res) => {
    const { decryptedBody, aesKeyBuffer, initialVectorBuffer } = req.decryptedData;

    const screenResponse = await getNextScreen(decryptedBody);

    res.send(encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer));
});

router.get('/', (req, res) => {
    res.send('Cannot GET /book-appointment! Use POST method.');
});

export default router;