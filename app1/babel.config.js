'use strict';

module.exports = function (api) {
    /** Permacache the computed config and avoid re-executing the config function every time a file is compiled. */
    api.cache.forever();

    const config = {
        /** Babel 'presets' can act as sharable set of Babel 'plugins' and/or config 'options'. */
        presets: [
            "@babel/preset-env",
            "@babel/preset-react"
        ],
        /** Babel's code transformations are enabled by applying 'plugins'. */
        plugins: [
            "@babel/plugin-transform-runtime"
        ]
    };
    return config;
}