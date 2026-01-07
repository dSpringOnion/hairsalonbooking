export type Service = {
    id: string;
    name: string;
    durationMinutes: number;
    priceStart: number;
    description: string;
    category: 'cut' | 'color' | 'style' | 'treatment';
};

export const SERVICES: Service[] = [
    {
        id: 'womens-cut',
        name: "Women's Cut",
        durationMinutes: 45,
        priceStart: 65,
        description: "Customized shape & style for your face shape.",
        category: 'cut'
    },
    {
        id: 'mens-cut',
        name: "Men's Grooming",
        durationMinutes: 30,
        priceStart: 45,
        description: "Precision cut, wash, and style.",
        category: 'cut'
    },
    {
        id: 'balayage',
        name: "Balayage",
        durationMinutes: 180, // 3 hours
        priceStart: 220,
        description: "Hand-painted dimension for a natural, sun-kissed look.",
        category: 'color'
    },
    {
        id: 'perm',
        name: "Permanent Wave",
        durationMinutes: 120, // 2 hours
        priceStart: 150,
        description: "Add long-lasting texture and body.",
        category: 'style'
    },
    {
        id: 'blowout',
        name: "Luxury Blowout",
        durationMinutes: 45,
        priceStart: 55,
        description: "Wash, scalp massage, and professional blowout.",
        category: 'style'
    }
];

export function getService(id: string): Service | undefined {
    return SERVICES.find(s => s.id === id);
}
