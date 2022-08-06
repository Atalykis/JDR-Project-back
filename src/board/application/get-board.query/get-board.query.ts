import { BoardStore } from "../board.store"

interface GetBoardQuery{
    roomName: string
}

export class GetBoardQueryHandler {
    constructor(private readonly boardStore: BoardStore){}

    async handle(query: GetBoardQuery){
        const board = await this.boardStore.load(query.roomName)

        if (!board) {
            return 
          }

        return {
            roomName: board.roomName,
            lines: board.lines.map((ownedLine) => ownedLine.line),
            tokens: board.tokens.map((ownedToken) => ownedToken.token)
        }
    }
}