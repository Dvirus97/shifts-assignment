
/**
 * map between name and color
 */
export const colorMap = new Map<string, string>()


export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    color += "80";
    return color;
}