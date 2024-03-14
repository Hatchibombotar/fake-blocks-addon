const fs = require("fs")

const blocks = fs.readFileSync("data/vanilla_solids.txt").toString().split(/\r\n|\n\r|\n|\r/)
const lang_vanilla = Object.fromEntries(fs.readFileSync("data/vanilla.lang").toString().split(/\r\n|\n\r|\n|\r/).map(x => x.split("=")))
const lang_ext = Object.fromEntries(fs.readFileSync("data/extended.lang").toString().split(/\r\n|\n\r|\n|\r/).map(x => x.split("=")))
const lang = {...lang_vanilla, ...lang_ext}

const vanillaBlocksJson = JSON.parse(fs.readFileSync("data/vanilla_blocks.json"))
const newBlocksJson = {}
let newlang = {
    "tile.hatchi:fake_block.name": "Fake Block Template"
}
for (const block of blocks) {
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
            }
        }
    }
    fs.writeFileSync(`BP/blocks/fake_blocks/${block}.json`, JSON.stringify(file, null, 4))

    newBlocksJson["fake_" + block] = vanillaBlocksJson[block]

    if (`tile.${block}.name` in lang) {
        newlang[`tile.hatchi:fake_${block}.name`] = "Fake " + lang[`tile.${block}.name`]
    } else {
        console.error(`could not find tile.${block}.name in vanilla.lang` )
    }
}

const lang_file = Object.entries(newlang).map(([k, v]) => k + "=" + v).join("\n")
fs.writeFileSync(`RP/texts/en_GB.lang`, lang_file)
fs.writeFileSync(`RP/texts/en_US.lang`, lang_file)
fs.writeFileSync(`RP/blocks.json`, JSON.stringify(newBlocksJson))