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