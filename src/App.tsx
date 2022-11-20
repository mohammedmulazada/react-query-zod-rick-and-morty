import z from "zod";
import { useQuery } from "@tanstack/react-query";
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

function App() {
  const { status, data } = useCharacters();

  if (status === "loading") {
    return <h1>"...loading"</h1>;
  }

  if (status === "error") {
    return <h1>"Error"</h1>;
  }

  return (
    <div className="App">
      <ul>
        {data.results.map((character) => {
          return (
            <li key={character.id}>
              <Link to={`/character/${character.id}`}>{character.name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
