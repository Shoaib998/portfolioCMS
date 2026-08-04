import app from "./app";
import { env } from "./config/env";
import logger from "./shared/logger/logger";

const PORT = Number(env.PORT);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});