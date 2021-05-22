import React from 'react';
import { Nav } from '../components/nav/Nav';
import { Grid } from '../components/grid/Grid';
import './index.css';

export const App = () => {
    return (
        <main className='App'>
            <Nav />
            <Grid />
        </main>
    )
}