import z from "zod";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-location";
import "./App.css";

export const characterSchema = z.object({
  id: z.number(),
  created: z.string(),
  episode: z.array(z.string()),
  gender: z.string(),
  image: z.string(),
  location: z.object({
    name: z.string(),
    url: z.string(),
  }),
  name: z.string(),
  origin: z.object({
    name: z.string(),
    url: z.string(),
  }),
  species: z.string(),
  status: z.string(),
  type: z.string(),
  url: z.string(),
});

const allCharactersSchema = z.object({
  info: z.object({
    count: z.number(),
    next: z.string().optional(),
    pages: z.number(),
    prev: z.string().nullable(),
  }),
  results: z.array(characterSchema),
});

type allCharacters = z.infer<typeof allCharactersSchema>;

export const fetchCharacters = async () => {
  const data = await fetch("https://rickandmortyapi.com/api/character");

  const response = await data.json();

  try {
    allCharactersSchema.parse(response);
  } catch (error) {
    console.log(error);
  }

  return response as allCharacters;
};

const useCharacters = () => {
  return useQuery({
    queryFn: fetchCharacters,
    queryKey: ["characters"],
  });
};

export const fetchCharactersInfinite = async ({ pageParam = 1 }) => {
  return (await fetch(
    `https://rickandmortyapi.com/api/character/?page=${pageParam}`
  ).then((result) => result.json())) as allCharacters;
};

function App() {
  const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryFn: fetchCharactersInfinite,
    queryKey: ["characters"],
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage?.info?.pages) {
        return pages.length + 1;
      }

      return undefined;
    },
  });

  if (status === "loading") {
    return <h1>"...loading"</h1>;
  }

  if (status === "error") {
    return <h1>"Error"</h1>;
  }

  return (
    <div className="App">
      <ul>
        {data?.pages.map((page) => {
          return page?.results?.map((character) => {
            return (
              <li key={character.id}>
                <Link to={`/character/${character.id}`}>{character.name}</Link>
              </li>
            );
          });
        })}
      </ul>

      {hasNextPage && (
        <button
          onClick={() =>
            fetchNextPage({ pageParam: data?.pages?.length! + 1 || 1 })
          }
        >
          Load more
        </button>
      )}
    </div>
  );
}

export default App;
