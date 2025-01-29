const welcome = {
  greeting: 'Hey',
  title: 'React',
}

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
  },
]

function App() {
  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}!</h1>

      <ul>
        {list.map(x => <li><a href={x.url}>{x.title}</a></li>)}
      </ul>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  )
}

export default App
