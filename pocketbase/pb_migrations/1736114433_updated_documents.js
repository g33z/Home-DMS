/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3332084752")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file544531829",
    "maxSelect": 10000,
    "maxSize": 107374182400,
    "mimeTypes": [],
    "name": "pages",
    "presentable": true,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3332084752")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file544531829",
    "maxSelect": 10000,
    "maxSize": 107374182400,
    "mimeTypes": [],
    "name": "pages",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
