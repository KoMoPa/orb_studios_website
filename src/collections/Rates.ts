import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Rates: CollectionConfig = {
    slug: 'rates',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'updatedAt'],
    },
    access: {
        read: anyone,
        create: authenticated,
        update: authenticated,
        delete: authenticated,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'amount',
            type: 'text',
            required: true,
            admin: { description: 'include $$$'}
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Hourly', value: 'hourly'},
                { label: 'Monthly', value: 'monthly'},
                { label: 'Other', value: 'other' },
            ],
            defaultValue: 'hourly',
        },
        {
            name: 'includes',
            type: 'richText',
            admin: { description: 'whats included'}
        }
    ]
}