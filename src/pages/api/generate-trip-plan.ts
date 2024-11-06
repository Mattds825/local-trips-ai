import { NextApiRequest, NextApiResponse } from 'next';
import { generateTripPlan } from './ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const formData = req.body;
            const tripPlan = await generateTripPlan(formData);
            res.status(200).json(tripPlan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate trip plan' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}