/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let settings = app.settings()

  // for all available settings fields you could check
  // /jsvm/interfaces/core.Settings.html
  settings.meta.appName = "Home-DMS"
  settings.batch = {
			"enabled": true,
			"maxRequests": 9999,
			"timeout": 10,
			"maxBodySize": 10737418240
	}

  app.save(settings)
})