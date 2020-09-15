'use strict';
const path = require('path');
const _ = require('lodash');
// const titleize = require('titleize');
// const humanizeString = require('humanize-string');
const readPkgUp = require('read-pkg-up');
const updateNotifier = require('update-notifier');
const Configstore = require('configstore');
// const {namespaceToName} = require('yeoman-environment');

/**
 * The router is in charge of handling different screens.
 * @constructor
 * @param  {Environment} env A yeoman environment instance
 * @param  {Configstore} [conf] An optional config store instance
 */
class Router {
  constructor(env, conf) {
    const pkg = require('../package.json');
    this.routes = {};
    this.env = env;
    this.conf = conf || new Configstore(pkg.name, {
      generatorRunCount: {}
    });
  }

  /**
   * Navigate to a route
   * @param  {String} name Route name
   * @param  {*}      arg  A single argument to pass to the route handler
   */
  navigate(name, arg) {
    if (typeof this.routes[name] === 'function') {
      return this.routes[name].call(null, this, arg);
    }

    throw new Error(`No routes called: ${name}`);
  }

  /**
   * Register a route handler
   * @param {String}   name    Name of the route
   * @param {Function} handler Route handler
   */
  registerRoute(name, handler) {
    this.routes[name] = handler;
    return this;
  }

  /**
   * Update the available generators in the app
   */
  updateAvailableGenerators() {
    this.generators = {};

    const resolveGenerators = generator => {
      // Skip sub generators
      if (!/:(app|all)$/.test(generator.namespace)) {
        return;
      }

      const {pkg} = readPkgUp.sync({cwd: path.dirname(generator.resolved)});

      if (!pkg) {
        return;
      }

      pkg.namespace = generator.namespace;
      pkg.appGenerator = true;
      pkg.prettyName = 'Pretty name';
      // pkg.prettyName = titleize(humanizeString(namespaceToName(generator.namespace)));
      pkg.update = updateNotifier({pkg}).update;

      if (pkg.update && pkg.version !== pkg.update.latest) {
        pkg.updateAvailable = true;
      }

      this.generators[pkg.name] = pkg;
    };

    _.forEach(this.env.getGeneratorsMeta(), resolveGenerators);
  }
}

module.exports = Router;
