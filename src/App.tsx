import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const welcome = {
  greeting: 'Hey',
  title: 'React',
}

const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
): StoriesState => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return { data: action.payload, state: "loading" };
    case 'STORIES_FETCH_FAILURE':
      return { data: [], state: "error" }
    case 'STORIES_FETCH_SUCCESS':
      return { data: action.payload, state: "loaded" }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story: Story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState({key: 'search', initialState: 'React'})
  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], state: "loading" })
  const [confirmedSearch, setConfirmedSearch] = useState(true)

  const handleFetchStories = useCallback(() => {
    if (!confirmedSearch) return
    getAsyncStories(searchTerm)
    .then(result => {
      dispatchStories({ payload: result.hits, type: 'STORIES_FETCH_SUCCESS' })
    })
    .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }))
    .finally(() => setConfirmedSearch(false))
  }, [confirmedSearch])

  useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleRemoveStory = (item: Story) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item })
  }

  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}!</h1>

    <form onSubmit={e => {e.preventDefault(); setConfirmedSearch(true)}}>
      <InputWithLabel id="search" onChange={handleSearch} type="search" value={searchTerm} >
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={confirmedSearch || !searchTerm}>OK</button>
    </form>

      <hr />

      {stories.state === "error"
        ? <p>Something went wrong...</p>
      : stories.state === "loading"
        ? <p>Loading...</p>
      : <StoryList stories={stories.data} onRemoveItem={handleRemoveStory} />}
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

interface AsyncStories {
  hits: Story[]
}
const getAsyncStories = (query: string = "React"): Promise<AsyncStories> => {
  return axios.get(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}`)
  .then(x => x.data)
}

export default App

interface Story {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: string,
}

type LoadingState = "loading" | "loaded" | "error"

type StoriesSetAction = {
  type: 'STORIES_FETCH_INIT';
  payload: Story[];
};

type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
};

type StoriesLoadFailedAction = {
  type: 'STORIES_FETCH_FAILURE';
}

type StoriesLoadedAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Story[];
}

type StoriesAction = StoriesSetAction | StoriesRemoveAction | StoriesLoadFailedAction | StoriesLoadedAction;

interface StoriesState {
  data: Story[],
  state: LoadingState
}
