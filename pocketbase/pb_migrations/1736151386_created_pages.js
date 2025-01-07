/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "file2359244304",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "file",
        "presentable": false,
        "protected": false,
        "required": true,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
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
      }
    ],
    "id": "pbc_3945946014",
    "indexes": [],
    "listRule": null,
    "name": "pages",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3945946014");

  return app.delete(collection);
})
