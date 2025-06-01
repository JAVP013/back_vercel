import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../utils/dbConnect';
import * as handler from '..//mnt/data/back_pagina_web_extracted/back_pagina_web/src/routes/company.routes.ts';

export default async function(req: VercelRequest, res: VercelResponse) {
    await dbConnect();
    return handler.default(req, res);
}