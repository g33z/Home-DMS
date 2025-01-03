import documentTags from "./data/documentTags";

const count: Record<string, number> = {}

documentTags.forEach(tag => {
    if(count[tag]){
        count[tag] += 1
    } else {
        count[tag] = 1
    }
})

Object.entries(count).filter(([tag, occ]) => occ > 1).forEach(i => console.log(i))