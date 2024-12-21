import type { PathsForPages, GetConfigResponse } from 'waku/router';

import type { getConfig as DocId_getConfig } from './pages/doc/[id]';
import type { getConfig as Index_getConfig } from './pages/index';

type Page =
| ({path: '/doc/[id]'} & GetConfigResponse<typeof DocId_getConfig>)
| ({path: '/'} & GetConfigResponse<typeof Index_getConfig>)
;

  declare module 'waku/router' {
    interface RouteConfig {
      paths: PathsForPages<Page>;
    }
    interface CreatePagesConfig {
      pages: Page;
    }
  }
  