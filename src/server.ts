import app from "./app";
import { properties } from "./config/properties";
import { DBConnection } from "./database/index";


DBConnection();

app.listen(properties.PORT, () => {
  console.info(`your server is running on Port no ${properties.PORT}`);
});
