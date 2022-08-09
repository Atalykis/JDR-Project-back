export interface StatisticValue {
    min: number,
    max: number
}

export interface Characteristic {
    name: string,
    value: string
}

export interface Statistic {
    name: string
    value: StatisticValue
}

export class CharacterTemplate{
    private characteristics: Map<string, string> = new Map()
    private statistics: Map<string, StatisticValue> = new Map()
    constructor(public name: string, public universe: string){}

    addCharacteristic(characteristicName: string, value: string){
        if(this.characteristics.has(characteristicName)){
            throw new CannotAddCharacteristicWithAlreadyTakenName(characteristicName)
        }
        this.characteristics.set(characteristicName, value)
    }

    setCharacteristic(characteristicName: string, value: string){
        this.characteristics.set(characteristicName, value) 
    }

    hasCharacteristic(characteristicName: string){
        return this.characteristics.has(characteristicName)
    }

    getCharacteristic(characteristicName: string){
        return this.characteristics.get(characteristicName)
    }

    addStatistic(statisticName: string, value: StatisticValue){
        if(this.statistics.has(statisticName)){
            throw new CannotAddStatisticWithAlreadyTakenName(statisticName)
        }
        this.statistics.set(statisticName, value)
    }

    setStatistic(statisticName: string, value: StatisticValue){
        this.statistics.set(statisticName, value)
    }

    hasStatistic(statisticName: string){
        return this.statistics.has(statisticName)
    }

    getStatistic(statisticName: string){
        return this.statistics.get(statisticName)
    }

    get id(){
        return new CharacterTemplateId(this.name, this.universe)
    }

    get fullCharacteristics(){
        const characteristics: Characteristic[] = []
        this.characteristics.forEach((value, key) => characteristics.push({name: key, value: value}))
        return characteristics
    }

    get fullStatistics(){
        const statistics: Statistic[] = []
        this.statistics.forEach((value, key) => statistics.push({name: key, value: value}))
        return statistics
    }
}


export class CharacterTemplateId{
    constructor(public readonly name: string, public universe: string){}

    static equals(left: CharacterTemplateId, right: CharacterTemplateId){

        if (left.name !== right.name) return false;
        if (left.universe !== right.universe) return false;
        return true
    }

    equals(other: CharacterTemplateId){
        return CharacterTemplateId.equals(this, other)
    }

    toObject(){
        return {
            name: this.name,
            universe: this.universe
        }
    }
}

export class CannotAddCharacteristicWithAlreadyTakenName extends Error {
    constructor(name: string){
        super(`could not add characteristic with already taken name ${name}`)
    }
}

export class CannotAddStatisticWithAlreadyTakenName extends Error{
    constructor(name: string){
        super(`cannot add statistic with already taken name : ${name}`)
    }
}
