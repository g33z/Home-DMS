/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3945946014")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3332084752",
    "hidden": false,
    "id": "relation3630795382",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "document",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3945946014")

  // remove field
  collection.fields.removeById("relation3630795382")

  return app.save(collection)
})
