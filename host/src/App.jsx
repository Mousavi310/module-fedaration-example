import React, { lazy, Suspense } from 'react';

const Products = lazy(() => import('App1/Products'));


export default function App() {
    return (
        <div className="main">
            <Suspense fallback={<div>Loading Header...</div>}>
                <Products />
            </Suspense>
        </div>
    )
}