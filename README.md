# lansare [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> CLI project deployment tracker

Lansare is a project that allows for developers to track the deployment of new code from the same CLI they use to deploy their projects in the first place. By default, it ships with the ability to track deployments either against New Relic or against a static text file.

## Install

```sh
$ npm install --global lansare
```

## CLI Usage

## Project Usage

First and foremost, you need to define a `.lansarerc` file in the root of your project configuration. This file defines details around the project and the various environments to which is is being deployed. Typically, these environments will each have their own Name and API key within NewRelic.

```js
{
	"projects": {
	    "{{project name}}": {
	        "production": {
	            "name"       : "Application Name in New Relic",
				"nrid"       : "Application ID in New Relic",
				"api_key"    : "User API Key in New Relic"
	        },
	        "staging"   : {
	            "name"       : "Application Name in New Relic",
				"nrid"       : "Application ID in New Relic",
				"api_key"    : "User API Key in New Relic"		        
	        },
	        "local"     : {}
	    }
	}
}
```

This configuration will allow for multiple projects to be deployed from the same codebase to various New Relic dashboards. At least one project is required with at least one environment. Either a `name` or `nrid` is required. The `api_key` field is also required.

Once defined, a deployment can be tracked in New Relic by invoking Lansare at the command line:

```sh
lansare {{project name}}:{{environment}} -d "Description" -c "Changelog" -r "Revision" -u "User"
```

All command line flags except for the changelog are required.

### Logfile Tracking

To log to a static file instead of New Relic, pass `log` along with the `--dispatcher` flag and specify a `--logfile` to which the system should write. Lansare will automatically append to the logfile.

```sh
lansare {{project name}}:{{environment}} -d "Description" -c "Changelog" -r "Revision" -u "User" --dispatcher log --logfile log.txt
```

New log entries will be appended in the format:

```
Date | User | Project | Environment | Description | Changelog | Revision
```

If an environment is meant to log to a file _only_, then the configuration object can be left empty in `.lansarerc`.

## License

MIT © [Eric Mann](https://eamann.com)


[npm-image]: https://badge.fury.io/js/lansare.svg
[npm-url]: https://npmjs.org/package/lansare
[travis-image]: https://travis-ci.org/ericmann/lansare.svg?branch=master
[travis-url]: https://travis-ci.org/ericmann/lansare
[daviddm-image]: https://david-dm.org/ericmann/lansare.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ericmann/lansare
