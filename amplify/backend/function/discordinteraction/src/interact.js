const { bank } = require('/opt/bank')
const { generateResponse, verifyEvent } = require('/opt/discord')
const { getSecrets } = require('/opt/secrets')

let secrets
const secretNames = [
  'DISCORD_BOT_TOKEN',
  'DISCORD_APP_ID',
  'DISCORD_PUBLIC_KEY',
]

async function loadSecrets() {
  console.log('Loading secrets')
  try {
    const secrets = await getSecrets(secretNames)
    for (let [secretName, secretValue] of Object.entries(secrets)) {
      process.env[secretName] = secretValue
    }
  } catch (error) {
    console.log(error)
  }
  console.log('Secrets successfully loaded', process.env)
}

async function handleCommand({ token, context }) {
  const somethingWentWrongResponse = '🤕 Something went wrong'
  const command = bank.get(context.data.name)
  if (!command) throw new Error(`Invalid slash command: ${context.data.name}`)
  console.log(
    `Handling command "${command?.config?.name}" for user ${context.member.user.id}`
  )

  let commandResponse
  try {
    commandResponse = await command.handler(context)
  } catch (error) {
    console.error(`Error executing command "${command?.config?.name}"`, error)
  }

  let toRespond = commandResponse ?? somethingWentWrongResponse
  if (typeof toRespond === 'string') {
    toRespond = generateResponse(toRespond)
  }

  return toRespond
}

exports.interact = async function interact(event) {
  console.log('EVENT:', JSON.stringify(event))
  if (!secrets) {
    secrets = await getSecrets(secretNames)
    await loadSecrets()
  }
  if (event?.body) {
    const { type, token, ...context } = event.body
    const verified = await verifyEvent(event)
    switch (type) {
      case 1: {
        if (!verified) break
        return {
          type: 1,
        }
      }
      case 2: {
        if (verified) {
          return {
            type: 4,
            data: await handleCommand({ token, context }),
          }
        }
        break
      }
    }
  }
  throw new Error('[UNAUTHORIZED] Invalid request')
}
