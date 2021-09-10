const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm')

exports.getSecrets = async function getSecrets(secretNames) {
  const client = new SSMClient({ region: process.env.AWS_REGION })
  const Names = secretNames.map((secretName) => process.env[secretName])
  const command = new GetParametersCommand({ Names, WithDecryption: true })
  const params = await client.send(command)

  return params.Parameters?.reduce((acc, { Name, Value }, index) => {
    if (Name)
      acc[secretNames.find((secretName) => Name.endsWith(secretName))] = Value
    return acc
  }, {})
}
