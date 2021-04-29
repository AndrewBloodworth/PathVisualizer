import React from 'react';
import { Nav } from '../components/nav/Nav'
import { Grid } from '../components/grid/Grid'

export const App = () => {
    return (
        <main className='App'>
            <Nav />
            <Grid />
        </main>
    )
}