//import { useState} from 'react'
import './App.css'
import { ThemeProvider } from './ThemeContext';
import Button from './Button';
import Header from './Header';
import ButtonCount from './ButtonCount';
import Heading from './Heading';
import Section from './Section';
import Counter from './Counter';

function App() {
  return (
    <>
      <ThemeProvider>
        <Header>My header</Header>
        <Button />
        <h1>Vite + React (no theme)</h1>
        <ButtonCount />
      </ThemeProvider>

      <Counter /> 
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more  (also no theme)
      </p>
      <Section>
        <Heading>Title</Heading>
        <Section>
          <Heading>Heading</Heading>
          <Heading>Heading</Heading>
          <Heading>Heading</Heading>
          <Section>
            <Heading>Sub-heading</Heading>
            <Heading>Sub-heading</Heading>
            <Heading>Sub-heading</Heading>
            <Section>
              <Heading>Sub-sub-heading</Heading>
              <Heading>Sub-sub-heading</Heading>
              <Heading>Sub-sub-heading</Heading>
            </Section>
          </Section>
        </Section>
      </Section>
    </>
  )
}

export default App
