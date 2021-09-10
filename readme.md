# Discord Bot on Amplify

![image](https://user-images.githubusercontent.com/5033303/132928672-95479b10-c0c8-4bde-9bf7-7150eee73787.png)

Prerequisites:

- [AWS Account](https://aws.amazon.com/account/)
- [AWS Amplify CLI](https://www.npmjs.com/package/@aws-amplify/cli)

## Getting Started

1. [Create a new Discord Application](https://discord.com/developers/applications)

   1. take note of the Application ID and Public Key
   2. add a bot
   3. add newly created Discord bot to our Discord server

      ```text
      https://discord.com/oauth2/authorize?client_id=<discord-app-id>&permissions=2048&scope=bot%20applications.commands
      ```

      1. `2048` as permissions signify only "Send Messages" for bot permissions

2. `amplify init`
3. add secrets, run `amplify push`
