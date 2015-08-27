# lansa [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> CLI project deployment tracker

Lansa is a project that allows for developers to track the deployment of new code from the same CLI they use to deploy their projects in the first place. By default, it ships with the ability to track deployments either against New Relic or against a static text file.

## Install

```sh
$ npm install --global lansa
```

## CLI Usage

## Project Usage

First and foremost, you need to define a `.lansarc` file in the root of your project configuration. This file defines details around the project and the various environments to which is is being deployed. Typically, these environments will each have their own Name and API key within NewRelic.

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
	        }
	    }
	}
}
```

This configuration will allow for multiple projects to be deployed from the same codebase to various New Relic dashboards. At least one project is required with at least one environment. Either a `name` or `nrid` is required. The `api_key` field is also required.

Once defined, a deployment can be tracked in New Relic by invoking Lansa at the command line:

```sh
lansa {{project name}}:{{environment}} -d "Description" -c "Changelog" -r "Revision" -u "User"
```

All command line flags except for the changelog are required.

### Logfile Tracking

To log to a static file instead of New Relic, pass `log` along with the `--dispatcher` flag and specify a `--logfile` to which the system should write. Lansa will automatically append to the logfile.

```sh
lansa {{project name}}:{{environment}} -d "Description" -c "Changelog" -r "Revision" -u "User" --dispatcher log --logfile log.txt
```

New log entries will be appended in the format:

```
Date | User | Project | Environment | Description | Changelog | Revision
```

## License

MIT © [Eric Mann](https://eamann.com)


[npm-image]: https://badge.fury.io/js/lansa.svg
[npm-url]: https://npmjs.org/package/lansa
[travis-image]: https://travis-ci.org/ericmann/lansa.svg?branch=master
[travis-url]: https://travis-ci.org/ericmann/lansa
[daviddm-image]: https://david-dm.org/ericmann/lansa.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ericmann/lansa
