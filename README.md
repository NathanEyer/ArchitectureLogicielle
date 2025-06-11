# ArchitectureLogicielle 

Nathan Eyer
Mathieu Baudoin
Adrien Mangin

## Morpion en Node JS

Ce projet est un jeu de morpion codé avec NextJS / Tailwind et SupaBase pour le backend


## Installation et lancement

npm install

npm run start

# Note

Ne pas oubliez de mettre un .env valide de la forme

REACT_APP_ANON_KEY=key
REACT_APP_URL=link

Dans supabase, une table games de la forme :
create table public.games (
  id uuid not null default gen_random_uuid (),
  current_player text null default 'X'::text,
  winner text null,
  inserted_at timestamp without time zone null default now(),
  board text[] null,
  constraint games_pkey primary key (id)
) TABLESPACE pg_default;
