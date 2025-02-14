import React, { useEffect, useState } from "react";

const welcome = {
  greeting: 'Hey',
  title: 'React',
}

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState({key: 'search', initialState: 'React'})
  const [stories, setStories] = useState<Story[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>("loading")

  useEffect(() => {
    getAsyncStories()
    .then(result => {
      setLoadingState("loaded")
      setStories(result.data.stories)
    })
    .catch(() => setLoadingState("error"))
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleRemoveStory = (item: Story) => {
    const newStories = stories.filter(x => x.objectID !== item.objectID)
    setStories(newStories)
  }

  const filteredStories =
    stories
    .filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}!</h1>

      <InputWithLabel id="search" onChange={handleSearch} type="search" value={searchTerm} >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {loadingState === "error"
        ? <p>Something went wrong...</p>
      : loadingState === "loading"
        ? <p>Loading...</p>
      : <StoryList stories={filteredStories} onRemoveItem={handleRemoveStory} />}
    </div>
  )
}

const StoryList = ({ stories, onRemoveItem }: { stories: Story[], onRemoveItem: (item: Story) => void }) => {
  return (
    <ul>
      {stories.map(x => <StoryItem key={x.objectID} story={x} onRemoveItem={onRemoveItem} />)}
    </ul>
  )
}

interface StoryItemProps {
  story: Story
  onRemoveItem: (item: Story) => void
}

const StoryItem = ({ story, onRemoveItem }: StoryItemProps) => {
  return (
    <li>
      <span>
        <a href={story.url}>{story.title}</a>
      </span>
      <span>{story.author}</span>
      <span>{story.num_comments}</span>
      <span>{story.points}</span>
      <span><button onClick={() => onRemoveItem(story)} aria-label="delete">X</button></span>
    </li>)
}

interface InputProps {
  children: React.ReactNode
  id: string
  type?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
const InputWithLabel = ({ id, children, onChange, type = "text", value }: InputProps) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input id={id} type={type} onChange={onChange} value={value} />
    </>
  )
}

const useStorageState = <T extends string,>({ key, initialState }: { key: string, initialState: T }) => {
  const state = useState(localStorage.getItem(key) ?? initialState)

  let value = state[0]
  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value])

  return state
}

const initialStories = [
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

interface AsyncStories {
  data: {
    stories: Story[]
  }
}
const getAsyncStories = (): Promise<AsyncStories> => {
  return new Promise((resolve, reject) =>
    setTimeout(
      () => {
        if (Math.random() > 0.5) {
          resolve({ data: { stories: initialStories } })
        } else {
          reject("Error")
        }
      },
      2000
    ));
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

type LoadingState = "loading" | "loaded" | "error"
