import { getPayload } from '@/app/(payload)/lib/payload/getPayload';
import { ClientRecord } from './types';

/**
 * Check if a client exists in the Payload Users collection
 */
export async function findClientByEmail(email: string): Promise<ClientRecord | null> {
    try {
        const payload = await getPayload();

        const users = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: email,
                },
            },
        });

        if (users.docs.length === 0) {
            return null;
        }

        const user = users.docs[0];

        return {
            id: user.id,
            email: user.email,
            name: user.email.split('@')[0],
            isMonthly: false, // TODO: Add monthly status to user collection
            createdAt: new Date(user.createdAt),
        };
    } catch (error) {
        console.error('Error finding client:', error);
        throw new Error('Failed to find client');
    }
}

/**
 * Create a new client in the Payload Users collection
 */
export async function createClient(
    email: string,
    name: string,
    phone?: string
): Promise<ClientRecord> {
    try {
        const payload = await getPayload();

        const user = await payload.create({
            collection: 'users',
            data: {
                email,
                password: Math.random().toString(36).slice(-12), // Generate random password for Payload
                role: 'editor',
            },
        });

        return {
            id: user.id,
            email: user.email,
            name,
            isMonthly: false,
            createdAt: new Date(user.createdAt),
        };
    } catch (error) {
        console.error('Error creating client:', error);
        throw new Error('Failed to create client');
    }
}

/**
 * Get or create a client
 */
export async function getOrCreateClient(
    email: string,
    name: string
): Promise<ClientRecord> {
    let client = await findClientByEmail(email);

    if (!client) {
        client = await createClient(email, name);
    }

    return client;
}

/**
 * Check if client is a monthly subscriber
 * TODO: Implement with proper monthly subscription tracking
 */
export async function isMonthlyClient(email: string): Promise<boolean> {
    const client = await findClientByEmail(email);
    return client?.isMonthly ?? false;
}

/**
 * Mark client as monthly subscriber
 * TODO: Implement with proper monthly subscription tracking
 */
export async function setClientAsMonthly(
    email: string,
    expiresAt: Date
): Promise<void> {
    try {
        const client = await findClientByEmail(email);

        if (!client) {
            throw new Error('Client not found');
        }

        const payload = await getPayload();

        await payload.update({
            collection: 'users',
            id: client.id,
            data: {
                // TODO: Add monthlyExpiresAt field to user collection
            },
        });
    } catch (error) {
        console.error('Error setting client as monthly:', error);
        throw new Error('Failed to update client');
    }
}
