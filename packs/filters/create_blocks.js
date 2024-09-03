const fs = require("fs")

const blocks = fs.readFileSync("data/vanilla_solids.txt").toString().split(/\r\n|\n\r|\n|\r/)
const lang_base = Object.fromEntries(fs.readFileSync("data/base.lang").toString().split(/\r\n|\n\r|\n|\r/).map(x => x.split("=")))
const lang_vanilla = Object.fromEntries(fs.readFileSync("data/vanilla.lang").toString().split(/\r\n|\n\r|\n|\r/).map(x => x.split("=")))
const lang_ext = Object.fromEntries(fs.readFileSync("data/extended.lang").toString().split(/\r\n|\n\r|\n|\r/).map(x => x.split("=")))
const lang = {...lang_vanilla, ...lang_ext}

const vanillaBlocksJson = JSON.parse(fs.readFileSync("data/vanilla_blocks.json"))
const extendedBlocksJson = JSON.parse(fs.readFileSync("data/blocks_extended.json"))
const blocksjson = {...vanillaBlocksJson, ...extendedBlocksJson}

const newBlocksJson = {}
let newlang = {
    ...lang_base
}
for (const block of blocks) {
    if (block[0] == "#" || block == "") {
        continue
    }
    const file = {
        "format_version": "1.20.70",
        "minecraft:block": {
            "description": {
                "identifier": `hatchi:fake_${block}`
            },
            "components": {
                "minecraft:collision_box": false,
                "minecraft:material_instances": {
                    "*": {
                        "render_method": "alpha_test",
                    }
                },
                "minecraft:loot": "loot_tables/blocks/fake_blocks.json",
                "tag:hatchi:fake_block_template": {},
            }
        }
    }
    fs.writeFileSync(`BP/blocks/fake_blocks/${block}.json`, JSON.stringify(file, null, 4))

    if (blocksjson[block] == undefined) {
        console.error(`could not find ${block} in blocks.json`)
    }
    newBlocksJson["fake_" + block] = blocksjson[block]

    if (`tile.${block}.name` in lang) {
        newlang[`tile.hatchi:fake_${block}.name`] = "Fake " + lang[`tile.${block}.name`]
    } else {
        console.error(`could not find tile.${block}.name in vanilla.lang` )
    }
}

newBlocksJson.format_version = "1.21.20"

const lang_file = Object.entries(newlang).map(([k, v]) => k + "=" + v).join("\n")
fs.writeFileSync(`RP/texts/en_GB.lang`, lang_file)
fs.writeFileSync(`RP/texts/en_US.lang`, lang_file)
fs.writeFileSync(`RP/blocks.json`, JSON.stringify(newBlocksJson))