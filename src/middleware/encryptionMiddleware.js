import { decryptRequest, FlowEndpointException } from '../utils/encryption.js';

export const flowEncryptionMiddleware = (req, res, next) => {
    // 1. Correção: Tratamento das quebras de linha na chave
    const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!privateKey) {
        // Dica: Em middlewares, é melhor passar erros pro next() ou retornar status direto,
        // jogar throw new Error aqui pode derrubar o app se não tiver tratamento global.
        console.error("Private key is missing");
        return res.status(500).send();
    }

    try {
        const decrypted = decryptRequest(req.body, privateKey);
        req.decryptedData = decrypted;
        next();
    } catch (error) {
        console.error(error); // Sempre logue o erro real para debug!

        // 2. Correção: Verifique se é um erro conhecido
        if (error instanceof FlowEndpointException) {
            return res.status(error.statusCode).send();
        }

        // Plano B: Erro genérico de servidor
        return res.status(500).send();
    }
};