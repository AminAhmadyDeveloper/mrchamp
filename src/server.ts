import "dotenv/config";

import { createServer } from "http";
import { expressApp } from "./apps/express-app";
import { PORT } from "./constants/env-constants";

const server = createServer(expressApp);
server.listen(PORT, () => {
  console.log(`[nodejs] server is listening on port ${PORT}`);
});
