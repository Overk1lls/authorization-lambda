const randomSeconds = (min: number, max: number): number => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

export { randomSeconds };