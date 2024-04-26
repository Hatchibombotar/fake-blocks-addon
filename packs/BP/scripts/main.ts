import { BlockPermutation, Player, RawMessage, system, world } from "@minecraft/server"
import allowed_blocks from "./info"

function sendError(player: Player, message: RawMessage[]) {
    system.run(() => {
        player.sendMessage(
            [
                { text: "§c[!] " },
                ...message
            ]
        )
        player.playSound("note.bassattack")
    })
}

world.beforeEvents.itemUseOn.subscribe((e) => {
    if (!e.block.hasTag("hatchi:fake_block_template")) {
        return
    }

    const held_block = e.itemStack.typeId
    const held_block_namespace = held_block.split(":")[0]
    const held_block_id = held_block.split(":")[1]

    if (held_block_namespace != "minecraft") {
        sendError(e.source, [
            { translate: "custom.hatchi.fake_blocks.block_not_supported" },
        ])
        return
    }

    if (!allowed_blocks.includes(held_block_id)) {
        sendError(e.source, [
            { translate: "custom.hatchi.fake_blocks.block_not_supported" },
        ])
        return
    }
    system.run(() => {
        const permutation = BlockPermutation.resolve(`hatchi:fake_${held_block_id}`)

        e.block.setPermutation(permutation)
    })
    e.cancel = true

})