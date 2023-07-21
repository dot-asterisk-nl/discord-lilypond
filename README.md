# Discord-lilypond

A bot for Discord which supports lilypond.

## How to run (native)

* Ensure you have a running instance of [lilypond-web](https://github.com/dot-asterisk-nl/lilypond-web)
* Create a Discord bot in https://discord.com/developers/applications.
* Get the `clientId` and `token`.
* Configure your environment variables to comply with the `config.js`.
```
TOKEN=<your given token in Discord (alpha-numeric with a dot somewhere)>,
CLIENT_ID=<your given ID in Discord (number)>,
ENDPOINT=<the base Lilypond-Web URL (http://lilypond-web:8080)>,
```
* Run `npm install` and then `node .`.

Your bot should now be online and give a message saying that it is in stdout.

## How to run (docker)

* Create a Discord bot in https://discord.com/developers/applications.
* Get the `clientId` and `token`.
* See the file in `docker/docker-example.yml` for a working Docker stack and create your own. Note that the [lilypond-web](https://github.com/dot-asterisk-nl/lilypond-web) docker image is mandatory.

Also note: The .yml has some sane defaults for LilyPond security. Make sure that capabilities are dropped and 
that the lilypond-web service is decently isolated on the network level.

## Contributing

Please open issues on this page if there's any problems whatsoever.