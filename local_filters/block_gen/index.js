const fs = require("fs")

const blocks = fs.readFileSync("BP/vanilla_solids.txt").toString().split(/\r\n|\n\r|\n|\r/)
const lang = fs.readFileSync("BP/vanilla.lang").toString().split(/\r\n|\n\r|\n|\r/)
const blocknomc = []

for (block of blocks) {
    blocknomc.push(block.split(":")[1])
}

const vanillaBlocksJson = JSON.parse(fs.readFileSync("BP/vanilla_blocks.json"))
const newBlocksJson = {}
for (block of blocks) {
    // generate blocks file
    const blockName = block.split(":")[1]
    const file = {
        "format_version": "1.16.100",
        "use_template": "fake_blocks:fake_block",
        "minecraft:block": {
            "description": {
                "identifier": `fake_blocks:fake_${blockName}`
            }
        }
    }
    fs.writeFileSync(`BP/blocks/fake_blocks/${blockName}.block.json`, JSON.stringify(file))


    // generate recipe
    const recipe = {
        "format_version": "1.12",
        "minecraft:recipe_shapeless": {
            "description": {
                "identifier": `fake_blocks:fake_${blockName}_recipe`
            },
            "priority": 0,
            "tags": ["crafting_table"],
            "ingredients": [
                {
                    "item": "fake_blocks:empty_fake_block"
                },
                {
                    "item": `${block}`
                }
            ],
            "result": {
                "item": `fake_blocks:fake_${blockName}`
            }
        }
    }
    fs.writeFileSync(`BP/recipes/${blockName}.json`, JSON.stringify(recipe))
}

for (block of Object.keys(vanillaBlocksJson)) {
    // console.log(block + blocknomc[1])
    if (blocknomc.indexOf(block) != -1) {
        newBlocksJson["fake_" + block] = vanillaBlocksJson[block]
    }
}

let newlang = [
    "tile.fake_blocks:empty_fake_block=Empty Fake Block"
]
for (text of lang) {
    const textBlock = text.match(/(?<=tile.)(.*)(?=.name)/g)[0]
    if (blocknomc.indexOf(textBlock) != -1) {
        newlang.push(text.replace("tile.", "tile.fake_blocks:fake_").replace("=", "=Fake "))
    }
}

fs.writeFileSync(`RP/texts/en_GB.lang`, newlang.join("\n"))
fs.writeFileSync(`RP/blocks.json`, JSON.stringify(newBlocksJson))