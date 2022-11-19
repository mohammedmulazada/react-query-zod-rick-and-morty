import z from "zod";
import { useQuery } from "@tanstack/react-query";
import "./App.css";

const characterSchema = z.object({
  info: z.object({
    count: z.number(),
    next: z.string().optional(),
    pages: z.number(),
    prev: z.string().nullable(),
  }),
  results: z.array(
    z.object({
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
    })
  ),
});

type Character = z.infer<typeof characterSchema>;

const fetchCharacters = async () => {
  const data = await fetch("https://rickandmortyapi.com/api/character");

  const response = await data.json();

  try {
    characterSchema.parse(response);
  } catch (error) {
    console.log(error);
  }

  return response as Character;
};

function App() {
  const { status, data } = useQuery(["characters"], fetchCharacters);

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
          return <li key={character.id}>{character.name}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
