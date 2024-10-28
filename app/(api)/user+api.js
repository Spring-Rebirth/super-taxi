// 这些API只能在开发环境中使用
import { neon } from '@neondatabase/serverless';
import Constants from 'expo-constants';

const neonURL = Constants.expoConfig.extra.neonURL
const sql = neon(`${neonURL}`);

export async function POST(request) {
    try {
        const { name, email, clerkId } = await request.json();

        if (!name || !email || !clerkId) {
            return Response.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const response = await sql`
            INSERT INTO users (
                name,
                email,
                clerk_id
            )
            VALUES (
                ${name},
                ${email},
                ${clerkId}
            )
        `;

        return new Response(JSON.stringify({ data: response }), { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: error }, { status: 500 });
    }
}

// See https://neon.tech/docs/serverless/serverless-driver
// for more information