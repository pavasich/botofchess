const subTiers = [
    '1',
    '1000',
    '2000',
    '3000',
];

export default function getTier(plan: number | string): string {
    const tier = subTiers.indexOf(`${plan}`);
    if (tier === 0 || tier === 1) {
        return '1';
    }
    if (tier === 2) return '2';
    if (tier === 3) return '3';
    return '0';
}
