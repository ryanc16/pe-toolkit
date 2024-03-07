const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const ConsoleReporter = require('jasmine-console-reporter');

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
    new SpecReporter({
        spec: {
            displayDuration: true,
            displayPending: false,
            displayFailed: true,
            displayStacktrace: "pretty"
        }
    })
);
jasmine.getEnv().addReporter(
    new ConsoleReporter({
        colors: 1,
        emoji: false,
        verbosity: {
            pending: false,
            disabled: false,
            specs: false,
            summary: true
        }
    })
);