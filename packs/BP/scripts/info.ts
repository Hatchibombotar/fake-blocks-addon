// @ts-ignore
import t from "../../data/vanilla_solids.txt"

const allowed_blocks = t.split("\n").map((x: string) => x.trim()) as string[]

export default allowed_blocks