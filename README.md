# Example of @sentry/node Express middleware breaking unhandledRejection listener

When adding `Sentry.Handlers.requestHandler()` as an Express middleware, `process.on('unhandledRejection')` stops working and unhandled promise rejections will crash Node.js.

Affected Sentry versions: @sentry/node@7.12+
Affected Node versions: tested on v16 and v18. This issue doesn't happen on Node v14 or v15.

## To reproduce

This repostitory includes two examples of the same code. In one example, we add the Sentry middlewares and in the other we don't add it. Apart from that, the code identical. In both examples we trigger an unhandled promise rejection when visiting the server.

First install the dependencies:
`yarn install`

Switch to the correct Node version (make sure testing on v16+). If using nvm, simply run `nvm install` in the project root.

Run `yarn with-sentry`. This starts the first server at `http://localhost:3000`
Visit `http://localhost:3000`, and notice that the server crashes.

Run `yarn without-sentry`. This starts the first server at `http://localhost:3001`
Visit `http://localhost:3001`, and notice that the server does not crash. It will correctly log the `Unhandled rejection` instead.

## Possible cause

[In a recent change (@sentry/node@7.12)](https://github.com/getsentry/sentry-javascript/pull/5627/files). Sentry stopped listening for the error event on the domain. But somehow `unhandledRejection` are intepreted as `uncaughtException` inside domains (bug in Node?).
