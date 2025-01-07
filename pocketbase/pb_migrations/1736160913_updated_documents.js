/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3332084752")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3945946014",
    "hidden": false,
    "id": "relation544531829",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "pages",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3332084752")

  // remove field
  collection.fields.removeById("relation544531829")

  return app.save(collection)
})
