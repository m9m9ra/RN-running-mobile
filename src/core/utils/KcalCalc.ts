interface humanData {
    height: number,
    weight: number,
    averageSpeed: string | number
}

export const KcalPerMinute = ({height, weight, averageSpeed}: humanData): string => {
    /// kcal/min
    return Number(0.035 * weight + (Number(averageSpeed) * Number(averageSpeed) / height) * 0.029 * weight).toFixed(2);
}