import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function ErrorBoundaryFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })
  React.useEffect(() => {
    if (!pokemonName) {
      setState(s => ({...s, status: 'idle'}))
      return
    }
    setState(s => ({...s, pokemon: null}))
    setState(s => ({...s, status: 'pending'}))
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState(s => ({...s, pokemon: pokemonData}))
        setState(s => ({...s, status: 'resolved'}))
      })
      .catch(error => {
        setState(s => ({...s, error: error}))
        setState(s => ({...s, status: 'rejected'}))
      })
  }, [pokemonName])
  const {pokemon, error, status} = state
  if (status === 'rejected') {
    throw new Error(error.message)
  }
  if (status === 'idle') {
    return 'Submit a pokemon'
  }

  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
  if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorBoundaryFallback}
          resetKeys={[pokemonName]}
          onReset={() => {
            setPokemonName(null)
          }}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
