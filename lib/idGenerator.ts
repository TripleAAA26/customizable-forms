
export function idGenerator():string {
    //Math.floor(Math.random() * 10001).toString()
    return crypto.randomUUID()
}