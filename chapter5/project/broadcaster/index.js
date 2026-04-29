import "dotenv/config"
import axios from "axios"
import { connect, StringCodec } from "nats"

const FULLSTACK_DISCORD_WEBHOOK = process.env.FULLSTACK_DISCORD_WEBHOOK
const NATS_URL = process.env.NATS_URL

const sc = StringCodec()
const nc = await connect({ servers: NATS_URL })

console.log(`Connected to NATS: ${nc.getServer()}`)

const subjects = ["todo_created", "todo_updated"]

for (const subject of subjects) {
  nc.subscribe(subject, {
    queue: "broadcaster",
    callback: (err, msg) => {
      const payloadText = sc.decode(msg.data)

      const message = {
        content: `${subject}:\n\n${payloadText}`,
      }

      if (FULLSTACK_DISCORD_WEBHOOK) {
        axios.post(FULLSTACK_DISCORD_WEBHOOK, message)
      } else {
        console.log(`INFO: ${message.content}`)
      }
    },
  })
}
