# cosmic-encounter-discord-bot
play cosmic encounter through Discord messages and reactions


product goals:
- game that an entire Discord community can play together
- game that can be played asynchronously, cooperatively, or individually
- requires conversation, discussion, debate
- highly replayable with core ruleset & content
- individual participation optional
- can be visually compelling without knowing the rules / metagame
- enhanced by role-playing (as an NFT avatar)
- extensible through added content / modules
- can be easily reskinned / whitelabel


- setup local Supabase server
- setup webapp (Vue3 + TailwindCSS) connected to Supabase server
- setup Discord bot server with "LightsOut Games R&D"
- implement base game loop sequence for Cosmic Encounter
  - battle
  - cards in hand
  - prompts for decision 
  - "wait for decision" states

- 

- implement game state schema in Supabase
- render text-only game state through Vue3<>Supabase client
- implement game decisions through Vue3 UI
- implement board game engine API through supabase
- implement board game API client via Discord message reactions
- implement board game API client via Discord /commands


- setup local Colyseus server
- setup Defold development integrated with Colyseus
- forward game state through Colyseus room
- render 