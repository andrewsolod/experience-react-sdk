/*
 * Copyright 2019 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const next = require('next');
const routes = require('./routes');
const app = next({dev: process.env.NODE_ENV !== 'production'});
const handler = routes.getRequestHandler(app);

const {createServer} = require('http');
app.prepare().then(() => {
  app.setAssetPrefix('http://localhost:3000');
  createServer(handler).listen(3000);
});
