import React, { useEffect, useState } from "react";

const welcome = {
  greeting: 'Hey',
  title: 'React',
}

const allStories = [
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

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState({key: 'search', initialState: 'React'})

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const stories = allStories.filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}!</h1>

      <InputWithLabel id="search" onChange={handleSearch} type="search" value={searchTerm} >
        <strong>Search:</strong>
      </InputWithLabel>

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

interface SearchProps {
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => any
  searchTerm: string
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

export default App

interface Story {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number,
}
