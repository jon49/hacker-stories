const welcome = {
  greeting: 'Hey',
  title: 'React',
}

const App = () => {
  const stories = [
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

  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}!</h1>

      <Search />

      <hr />

      <StoryList stories={stories} />
    </div>
  )
}

const StoryList = ({ stories }: { stories: Story[] }) => {
  return (
    <ul>
      {stories.map(x => <StoryItem key={x.objectID} story={x} />)}
    </ul>
  )
}

const StoryItem = ({ story }: { story: Story }) => {
  return (
    <li>
      <span>
        <a href={story.url}>{story.title}</a>
      </span>
      <span>{story.author}</span>
      <span>{story.num_comments}</span>
      <span>{story.points}</span>
    </li>)
}

const Search = () => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    console.log(event.target.value)
    console.log(event.timeStamp)
  }
  return (
    <>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
    </>
  )
}

export default App

interface Story {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number,
}
