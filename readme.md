# User stories

**Sprint 1:**
Done:

- As a User, I want to join the room
- As a User, I want to list the people in the room
- As a User, I want to become the MJ of a room I created
- As a User, I want to become a Player in a room I joined
- As a MJ, I want to kick a Player in my room
- As a User I want to create a character
- As a User, I want to create an Adventure as MJ

Pending:

- As a User, I want to join an Adventure as Player
- As a Player/MJ, I want to insert Character(s) inside of an Adventure

Delayed:

- As a User, I want to list the rooms I already joined once
- As a MJ, I want to pass my MJ right to a Player and become a Player

User ->\* Character

What is a Player ?
What is a MJ ?
User is a Player and / or MJ
What is an Aventure ?
Is there a player limit in an Adventure/Room ?
What is a Room ?
How can a User define himself as a MJ ?
How can a User define himself as a Player ?
Can a User be a MJ and a Player ? In the same room ? In different rooms ?
Can a Room have multiple MJ inside ?

## TODO

// Guard reading the header for the Authorization token
// Guard <-- injects token manager, write username on request object
// CustomParamDecorator --> lire la requete, get the username
// Controller, use Guard + use Custom Param Decorator = have username when emitting command

JDR depend d'Authentication et c'est normal

## Comment dependre d'info d'adventure dans character

Adventure -> GetCharacterNamesQuery(advantureName) -> CharacterName[]

CreateCharacterCommand -> App{AdventureGateway} <-- implements -- Infra{RealAdventureGateway}
CreateCharacterCommand -> App{AdventureGateway} <-- implements -- Infra{FakeAdventureGateway}
