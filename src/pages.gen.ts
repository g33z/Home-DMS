import type { PathsForPages, GetConfigResponse } from 'waku/router';

import type { getConfig as DocIndex_getConfig } from './pages/doc/index';
import type { getConfig as Index_getConfig } from './pages/index';
import type { getConfig as NewIndex_getConfig } from './pages/new/index';

type Page =
| ({path: '/doc'} & GetConfigResponse<typeof DocIndex_getConfig>)
| ({path: '/'} & GetConfigResponse<typeof Index_getConfig>)
| ({path: '/new'} & GetConfigResponse<typeof NewIndex_getConfig>)
;

  declare module 'waku/router' {
    interface RouteConfig {
      paths: PathsForPages<Page>;
    }
    interface CreatePagesConfig {
      pages: Page;
    }
  }
  