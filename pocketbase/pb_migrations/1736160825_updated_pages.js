/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3945946014")

  // remove field
  collection.fields.removeById("number2105870632")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3945946014")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2105870632",
    "max": null,
    "min": null,
    "name": "pageNumber",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
