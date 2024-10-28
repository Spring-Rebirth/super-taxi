// 这些API只能在开发环境中使用
import { neon } from "@neondatabase/serverless";
import Constants from 'expo-constants';

const neonURL = Constants.expoConfig.extra.neonURL

export async function GET(request) {
    try {
        const sql = neon(`${neonURL}`);
        const response = await sql`SELECT * FROM drivers`;

        return Response.json({ data: response });
    } catch (error) {
        console.error("Error fetching drivers:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}