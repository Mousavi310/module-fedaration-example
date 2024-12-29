const path = require('path');

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { dependencies } = require("./package.json");

module.exports = {
    /**
     * mode:
     * It specifies the 'mode' which tells webpack to use its built-in optimizations accordingly.
     * Supported values: 'none', 'development', 'production'.
     * @defaultvalue 'production'
     */
    mode: "development",
    /**
     * The entry point or points where to start the application bundling process.
     * If an array is passed then all items will be processed.
     */
    entry: "./index.js",

    plugins: [
        //...
        new ModuleFederationPlugin({
            name: "HostApp",
            remotes: { 
                "App1": "App1@http://localhost:3001/remoteEntry.js",            
            },
        }),
    ],
    /**
     * The top-level 'output' key contains a set of options instructing webpack on how and
     * where it should output your bundles, assets, and anything else you bundle or load with webpack.
     */
    output: {
        /** The output directory as an absolute path. */
        path: path.resolve(__dirname, "public"),
        /** This option determines the name of each output bundle. */
        filename: "main.js"
    },
    /**
     * These options determine how the different types of 'modules' within a project will be treated.
     */
    module: {
        /**
         * An array of 'Rules' which are matched to requests when modules are created.
         * These rules can modify how the module is created.
         * They can apply loaders to the module, or modify the parser.
         */
        rules: [
            {
                /** Include all modules that pass test assertion. */
                test: /\.(js|jsx)$/,
                /** Exclude all modules matching any of these conditions. */
                exclude: /node_modules/,
                /** Loader to be used */
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                /** Each entry specifies a loader to be used. */
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    /** Loading the image file to the specified directory. */
                    name: 'resource/image/[name].[ext]'
                }
            }
        ]
    },
    /** These options change how modules are resolved. */
    resolve: {
        /** Attempt to resolve these extensions in order. */
        extensions: ['.js', '.jsx', '.json']
    },
    /** The set of options used by 'webpack-dev-server' for configuring DevServer. */
    devServer: {
        /**
         * Tells DevServer to open the browser after server had been started. Set it to 'true' to open your default browser.
         * @defaultvalue false
         */
        open: true,
        /** Enable webpack's 'Hot Module Replacement' feature. */
        hot: true,
        port: 3000
    }
}