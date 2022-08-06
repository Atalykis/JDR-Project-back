class CharacterTemplate {
    public characteristics: Map<string, number|string|undefined> = new Map()
    public stats: Map<string, Stat>= new Map()

    constructor(private readonly universe: string, name: string){}

    addCharacteristic(characteristicName: string, value: string | number){
        this.characteristics.set(characteristicName, value)
    }

    addStat(statName: string, stat: Stat){
        this.stats.set(statName, stat)
    }
}
  
interface Stat {
    min: number,
    max: number
}
