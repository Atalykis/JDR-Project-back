# User stories

**Sprint 1:**
Done:

- As a User, I want to join the room
- As a User, I want to list the people in the room
- As a User, I want to become the GM of a room I created
- As a User, I want to become a Player in a room I joined
- As a GM, I want to kick a Player in my room
- As a User I want to create a character
- As a User, I want to join an Adventure as Player
- As a Player/GM, I want to insert Character(s) inside of an Adventure

- As a User, I want to create an Adventure as GM

Pending:

Delayed:

- As a User, I want to list the rooms I already joined once
- As a GM, I want to pass my GM right to a Player and become a Player

User ->\* Character

What is a Player ?
What is a GM ?
User is a Player and / or GM
What is an Aventure ?
Is there a player limit in an Adventure/Room ?
What is a Room ?
How can a User define himself as a GM ?
How can a User define himself as a Player ?
Can a User be a GM and a Player ? In the same room ? In different rooms ?
Can a Room have multiple GM inside ?

## TODO

// Replace all HTTP infrastructure with GraphQl
// Refacto Room Joining == character + user --> user + AddCharacter??
MongoDb Js Driver Adapter

JDR depend d'Authentication et c'est normal

## Done

// Guard reading the header for the Authorization token
// Guard <-- injects token manager, write username on request object
// CustomParamDecorator --> lire la requete, get the username
// Controller, use Guard + use Custom Param Decorator = have username when emitting command

## Comment dependre d'info d'adventure dans character

Adventure -> GetCharacterNamesQuery(advantureName) -> CharacterName[]

CreateCharacterCommand -> App{AdventureGateway} <-- implements -- Infra{RealAdventureGateway}
CreateCharacterCommand -> App{AdventureGateway} <-- implements -- Infra{FakeAdventureGateway}
