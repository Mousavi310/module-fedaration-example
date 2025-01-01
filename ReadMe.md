I came across module federation in webpack. So there are 2 question for me here. What webpack does in a project and what is module federation.I was kind of familiar with webpack that it was a tool that help me to build my react app kind of. But wasn’t quite sure how the fundamental is working. So I started to [get familiar with webpack](https://www.sitepoint.com/webpack-beginner-guide/).

So essentially this is how webpack works: First it gets our source files in js, css, img and …  as input. Then it find their dependencies (so if you import something in your js file as dependency) and create output files from them usually one or few files.

Now what is interesting now for me is to know how we can load a component, dynamically from a service. When we are able to load an component from another service we are actually using [micro frontend architectural style](https://martinfowler.com/articles/micro-frontends.html). 

In this post, I’m going to create 2 application:
- A `host` application that loads other micro frontend applications
- A `products` application that is being loaded in the `host` application.

These applications are being created without [npx create-react-app command](https://mohammedismailp.medium.com/create-react-app-without-npx-create-react-app-ed15c05d355b). But you can also use `npx create-react-app` to create the app then reintroduce the webpack config file to it. 

So let's create a folder that contains 2 frontend application. To get start with you can look at the [start](https://github.com/Mousavi310/module-fedaration-example/tree/start) branch:

<img src="docs/project-structure.jpg?raw=true" alt="drawing" style="width:300px;"/>

As you see in the picture above we have 2 applications `host` and `app1`. `app1` is our products micro frontend.

Now let's assume that we have a component `Products.jsx` that has following content.


```jsx
import React from "react";

function Products() {
    return (
        <div>
            <div>
                <h2>Product 1</h2>
                <p1>Sample description for product 1</p1>
            </div>
            <div>
                <h2>Product 2</h2>
                <p1>Sample description for product 2</p1>
            </div>
        </div>
    )
}

export default Products

```

It is a simple list of products. It has 2 products actually. What is actually interesting for us is that we have this products in `app1` project which probably is hosted maybe in another server with different port but we want to expose this component over internet. To this we need to tweak webpack config file in the `app1` project:

First in the `webpack.config.js` make sure you import `ModuleFederationPlugin` plugin:

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin"); 
```

And then use this plugin:

```js
plugins: [
        new ModuleFederationPlugin({
            name: "App1",
            filename: "remoteEntry.js", 
            exposes: { 
              "./Products": "./src/components/Products", 
            },
        }),
    ],
 
```

Notice that we have exposed `products` and `host` application does not need to use the whole path of Products component to consume it. Also `remoteEntry.js` file will be exposed by `app1` and has all the metadata about products and `host` application can use it to import Products component.

Now it’s time to load products micro frontend into `host` application. First we must configure the module federation plugin. First import the plugin:

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin"); 
```

and then use it:

```js
new ModuleFederationPlugin({
            name: "HostApp",
            remotes: { 
                "App1": "App1@http://localhost:3001/remoteEntry.js",            
            },
        }),
```

Here `remotes` determines the list of services that we can import components or micro frontends. Here we make `App1` alias and as we see later we can import using `import('App1/Products')`.

Now we can import products in `App.jsx` component in the `host` application:

```jsx
import React, { lazy, Suspense } from 'react';

const Products = lazy(() => import('App1/Products'));

export default function App() {
    return (
        <div className="main">
            <h1>Host application</h1>
            <Suspense fallback={<div>Loading Header...</div>}>
                <Products />
            </Suspense>
        </div>
    )
}
```

Notice that we use dynamic loading to import products component:

```jsx
const Products = lazy(() => import('App1/Products'));
```

Because the component is not in our application. It will be loaded asynchronously. We use `lazy` function and `Suspense` component which helps to show loading while the component is being loaded from `app1`. 

The good thing about loading component from another service is that if it is updated in other service, it will be reflected on the host application that loaded that component and the `host` application does not need to be updated.

Of course this was quite simple explanation of the module federation concept. Next topic could be how to share dependencies using this plugin!


