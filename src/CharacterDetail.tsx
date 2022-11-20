import { z } from "zod";
import { Link, useMatch } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import { characterSchema } from "./App";

type CharacterType = z.infer<typeof characterSchema>;

export const fetchCharacter = async (id: string) => {
  const data = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

  const response = await data.json();

  try {
    characterSchema.parse(response);
  } catch (error) {
    console.log(error);
  }

  return response as CharacterType;
};

const useCharacter = (id: string) => {
  return useQuery(["characters", id], () => fetchCharacter(id));
};

export const CharacterDetail = () => {
  const {
    params: { characterId },
  } = useMatch();

  const { data } = useCharacter(characterId);

  return (
    <main>
      <Link to={"/"}>Go back</Link>
      <h1>{data?.name}</h1>
      <img src={data?.image} alt={data?.name} />
    </main>
  );
};
