const welcome = {
  greeting: 'Hey',
  title: 'React',
}

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

function App() {
  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}!</h1>

      <Search />

      <hr />

      <List />
    </div>
  )
}

function List() {
  return (
    <ul>
      {list.map(x =>
        <li key={x.objectID}>
          <span>
            <a href={x.url}>{x.title}</a>
          </span>
          <span>{x.author}</span>
          <span>{x.num_comments}</span>
          <span>{x.points}</span>
        </li>)}
    </ul>
  )
}

function Search() {
  return (
    <>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </>
  )
}

export default App
